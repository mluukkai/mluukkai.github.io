---
layout: page
title: osa 4
permalink: /osa4/
---

<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>
</div>

## Osan 4 oppimistavoitteet

- Node/express
  - Router
  - Helmet.js https://www.npmjs.com/package/helmet
- Node-sovellusten testaut
  - ava/supertest
- Mongoose
  - Monimutkaasemmat skeemat
  - Viittaukset kokoelmien välillä
- Web
  - Http-operaatioiden safety ja idempotency
  - Token-autentikaatio
  - JWT
- Muu
  - lint
- JS
  - async/await
- React
  - Lisää formeista: mm refs
  - Bootstrap (reactstrap) tai Semantic UI
  - Periaatteita: Virtual dom
  - Proptype
  - child https://reactjs.org/docs/composition-vs-inheritance.html
- Frontendin testauksen alkeet
  - Ava jsdom enzyme

## Sovellukuksen rakenteen parantelu

Muutetaan sovelluksen rakennetta, siten että projektin juuressa oleva _index.js_ lähinnä ainoastaan konfiguroi sovelluksen tietokannan ja middlewaret ja siirretään rotejen määrittely omaan tiedostoonsa.

Routejen tapahtumankäsittelijöitä kutsutaan usein _kontrollereiksi_. Luodaankin hakemisto _controllers_ ja sinne tiedosto _notes.js_ johon tulemme siirtämään kaikki muistiinpanoihin liittyvien reittien määrittelyt.

Tiedoston sisältö on seuraava:

```js
const routerRouter = require('express').Router()
const Note = require('../models/note')

const formatNote = (note) => {
  const formattedNote = { ...note._doc, id: note._id }
  delete formattedNote._id

  return formattedNote
}

routerRouter.get('/', (request, response) => {
  Note
    .find({}, '-__v')
    .then(notes => {
      response.json(notes.map(formatNote))
    })
})

routerRouter.get('/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(formatNote(note))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

routerRouter.delete('/:id', (request, response) => {
  Note
    .findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

routerRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.content === undefined ? false : body.important,
    date: new Date(),
  })

  note
    .save()
    .then(note => {
      return formatNote(note)
    })
    .then(formattedNote => {
      response.json(formattedNote)
    })

})

routerRouter.put('/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note
    .findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(formatNote(updatedNote))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

module.exports = routerRouter;
```

Käytännössä kyse melkein suora copypaste tiedostosta _index.js_.

Muutoksia on pari. Tiedoston alussa luodaan [router](http://expressjs.com/en/api.html#router)-olio:

```js
const routerRouter = require('express').Router()

//...

module.exports = routerRouter
```

Tiedoston määrittelemä moduuli tarjoaa moduulin käyttäjille routerin.

Kaikki määriteltävät routet liitetään router-olioon, samaan tapaan kuin aiemmassa versiossa routet liitettiin sovellusta edustavaan olioon.

Huomioinarvoinen seikka routejen määrittelyssä on se, että polut ovat typistyneet, aiemmin määrittelimme esim.

```js
app.delete('/api/notes/:id', (request, response) => {
```

nyt riittää määritellä

```js
routerRouter.delete('/:id', (request, response) => {
```

Mistä routereissa oikeastaan on kyse? Expressin manuaalin sanoin

> A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

Router on siis _middleware_, jonka avulla on mahdollista määritellä joukko "toisiinsa liittyviä" routeja yhdessä paikassa.

Ohjelman käynnistyspiste, eli määrittetyt tekevä _index.js_ ottaa määrittelemämme routerin käyttöön seuraavasti:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

Näin määrittelemäämme routeria käytetään _jos_ polun alkuosa on _/api/notes_. notesRouter-olion sisällä tarvitsee tämän takia käyttää ainoastaan polun loppuosia, eli tyhjää polkua _/_ tai pelkkää parametria _/:id_.

### sovelluksen muut osat

Sovelluksen käynnistyspisteenä _index.js_ näyttää muutosten jälkeen seuraavalta:

```js
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const utils = require('./utils')

if ( process.env.NODE_ENV!=='production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url, { useMongoClient: true })
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(utils.loggerMiddleware)

const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)

app.use(utils.errorMiddleware)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Tiedostossa siis otetaan käyttöön joukko middlewareja, näistä yksi on polkuun _/api/notes_ kiinnitettävä _notesRouter_ (tai notes-kontrolleri niinkuin jotkut sitä kutsuisivat) avataan yhteys tietokantaan ja käynnistetään sovellus.

Middlewareista kaksi _utils.loggerMiddleware_ ja _utils.errorMiddleware_ on määritelty hakemiston _utils_ tiedostossa _index.js_:

```js
const loggerMiddleware = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorMiddleware = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  loggerMiddleware,
  errorMiddleware
}
```

Tietokantayhteyden muodostaminen on nyt siirretty konfiguraatiot tekevän _index.js_:n vastuulle. Hakemistossa _models_ oleva tiedosto _note.js_ sisältää nyt ainoastaan muistiinpanojen skeeman määrittelyn.

```js
const mongoose = require('mongoose')

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

module.exports = Note
```

Tämän hetkinen koodi on kokonaisuudessaan githubissa repositoriossa xxx.

Express-sovelluksien rakenteelle, eli hakemistojen ja tiedostojen nimennälle ei ole olemassa mitään standardia (samaan tapaan kuin esim Ruby on Railsissa). Tässä käyttämämme malli noudattaa eräitä internetissä mainittuja hyviä käytäntöjä.

[express cli](https://expressjs.com/en/starter/generator.html)

Tiedostonimi index

## node-sovellusten testaaminen

Olemme laiminlyöneet ikävästi yhtä oleellista ohjelmistokehityksen osa-aluetta, automatisoitua testausta.

Aloitamme yksikkötestauksesta. Sovelluksemme logiikka on sen verran yksinkertaista, että siinä ei ole juurikaan mielekästä yksikkötestattavaa. Lisätäänkin tiedostoon _utils/index.js_ pari yksinketaista funktiota testattavaksi:

```js
//...
const palindrom = (string) => {
  const letters = []
  for(let i = 0; i < string.length; i++) {
    letters.push(string.charAt(i))
  }

  return letters.reverse().join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  loggerMiddleware,
  errorMiddleware,
  palindrom,
  average
}
```

Javascriptiin on tarjolla runsaasti erilaisia testikirjastoja eli _test runneria_. Käytämme tällä kurssilla Facebookin kehittämää ja sisäisesti käyttämää [jest](https://facebook.github.io/jest/):iä, joka on toiminnaltaan ja syntakstiltaankin hyvin samankaltainen kuin tämän hetken eniten eniten käytetty testikirjasto [Mocha](https://mochajs.org/). Muitakin mahdollisuuksia olisi, esim. eräissä piireissä suosiota nopeasti saavuttanut [ava](https://github.com/avajs/ava).

Jest on tälle kurssille luoteva valinta, sillä sopii hyvin backendien testaamiseen, mutta suorastaan loistaa Reactilla tehtyjen frontendien testauksessa.

Koska testejä on tarkoitus suorittaa ainoastaan sovellusta kehitettäessä, asennetaan _jest_ kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev jest
```

määritellään _npm_ skripti _test_ suorittmaan testaus avalla ja raportoimaan testien suorituksesta _verbose_-tyylillä:

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "watch": "node_modules/.bin/nodemon index.js",
    "test": "node_modules/.bin/jest --verbose test"
  },
  //...
}
```

Tehdään testejä varten hakemisto _test_ ja sinne tiedosto _palindrom.test.js_ ja sille sisältö

```js
const palindrom = require('../utils').palindrom

test("palindrom of a", () => {
  const result = palindrom('a') 

  expect(result).toBe('a')
})

test("palindrom of react", () => {
  const result = palindrom('react')

  expect(result).toBe('tcaer')
})

test("palindrom of saippuakauppias", () => {
  const result = palindrom('saippuakauppias')

  expect(result).toBe('saippuakauppias')
})
```

Testi ottaa ensimmäisellä rivillä testattavan funktion sijoittaen sen muuttujaan _palindrom_.

Ysittäinen testitapaus määritellään funktion _test_ avulla. Ensimmäisenä parametrina on merkkijonomuotoinen testin kuvaus. Toisena parametrina on _funktio_, joka määrittelee testitapauksen toiminnallisuuden. Esim. testitapauksista toinen näyttää seuraavalta:

```
() => {
  const result = palindrom('react')

  expect(result).toBe('tcaer')
}
```

Ensin suoritetaan testattava koodi, eli generoidaan merkkijonon _react_ palindromi. Seuraavaksi varmistetaan tulos metodin [expect](https://facebook.github.io/jest/docs/en/expect.html#content) avulla. Expect käärii tuloksena olevan arvon olioon, joka tarjoaa joukon _matcher_-funktioita, joiden avulla tuloksen oikeellisuutta voidaan tarkastella. Koska kyse on kahden merkkijonon samuuden vertailusta, sopii tilanteeseen matcheri [toBe](https://facebook.github.io/jest/docs/en/expect.html#tobevalue).

Kuten odotettua, testit menevät läpi:

![]({{ "/assets/4/1.png" | absolute_url }})

Jestin antamat virheilmoitukset ovat hyviä, rikotaan testi

```js
test("palindrom of react", () => {
  const result = palindrom('react')

  expect(result).toBe('tkaer')
})
```

seurauksena on seuraava virheilmotus

![]({{ "/assets/4/2.png" | absolute_url }})

Jest olettaa oletusarvoisesti, että testitiedoston nimessä on sana testi. Käytetään tällä kurssilla konventiota, millä testitiedostojen nimen loppu on _.test.js_

Lisätään muutama testi metodille _average_, tiedostoon _test/average.test.js_. 

```js
const average = require('../utils').average

describe("average", () => {

  test("of one value is the value itself", () => {
    expect(average([1])).toBe(1)
  })

  test("of many is caclulated right", () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test("of empty array is zero", () => {
    expect(average([])).toBe(0)
  })

})

```

Testi paljastaa, että metodi toimii väärin tyhjällä taulukolla (sillä nollallajaon tulos on _NaN_):

![]({{ "/assets/4/3.png" | absolute_url }})

Metodi on helppo korjata

```js
const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return array.length == 0 ? 0 : array.reduce(reducer, 0) / array.length
}
```

Pari huomiota keskiarvon testeistä. Määrittelimme testien ympärille nimellä "average" varustetun _describe_-lohkon. 

```js
describe("average", () => {
  // testit
})
```

Describejen avulla yksittäisessä tiedostossa olevat testit voidaan jaoitella loogisiin kokonaisuuksiin. Testituloste hyödyntää myös describe-kohkon nimeä:

![]({{ "/assets/4/3.png" | absolute_url }})

Kuten myöhemmin tulemme näkemään, _describe_-lohkot ovat tarpeellisia siinä vaiheessa, jos haluamme osalle yksittäisen testitiedoston testitapauksista jotain yhteisiä alustustoimenpiteitä.

Toisena huomiona se, että kirjoitimme testit aavistuksen tiiviimmässä muodossa, ottamatta testattavan metodin tulosta erikseen apumuuttujaan:

```js
  test("of empty array is zero", () => {
    expect(average([])).toBe(0)
  })
```  

## Tehtäviä

### tee testit ja toteuta metodit...

## api:n testaaminen

Joissain tilanteissa voisi olla mielekästä suorittaa ainakin osa backendin testauksesta siten, että oikea tietokanta eristettäisiin testeistä ja korvattaisiin "valekomponentilla" eli mockilla, eräs tähän sopiva ratkaisu olisi [mongo-mock](https://github.com/williamkapke/mongo-mock)

Koska sovelluksemme backendin on koodiltaan kuitenkin suhteellisen yksinkertainen, päätämme testata sitä kokonaisuudessaan, siten että testeissä käytetään myös tietokantaa. Tämänkaltaisia, useita sovelluksen komponetteja yhtäaikaa käyttäviä testejä voi luonnehtia _integraatiotesteiksi_.

### test-ympäristö

Edellisen osan luvussa [Sovelluksen vieminen tuotantoon](osa3/##-Sovelluksen-vieminen tuotantoon) mainitsimme, että kun sovellusta suoritetaan Herokussa, on se _production_-moodissa.

Noden konventiona on määritellä projektin suoritusmoodi ympäristömuuttujan _NODE_ENV_ avulla. Lataammekin sovelluksen nykyisessä versiossa tiedostossa _.env_ määritellyt ympäristömuuttujat ainoastaan jos sovellus _ei ole_ production moodissa:

```js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
```

Yleinen käytäntö on määritellä sovelluksille omat moodinsa myös sovelluskehitykseen ja testaukseen.

Määrtellään nyt tiedostossa _package.js_, että testejä suorittaessa sovelluksen _NODE_ENV_ saa arvokseen _test_:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "watch": "node_modules/.bin/nodemon index.js",
    "test": "NODE_ENV=test node_modules/.bin/jest --verbose test"
  },
  // ...
}
```

Nyt voimme konfiguroida sovelluksen käyttäytymistä testien aikana, erityisesti voimme määritellä, että testejä suoritettaessa ohjelma käyttää erillistä, testejä varten luotua tietokantaa.

Sovelluksen testikanta voidaan luoda tuotantokäyttöön ja sovellukehitykseen tapaan _mlabiin_. Ratkaisu ei kuitenkaan ole optimaalinen, jos sovellusta on tekemässä yhtä aikaa usea henkilöitä. Testien suoritus nimittäin yleensä edellyttää, että samaa tietokantainstanssia ei ole yhtä aikaa käyttämässä useampia testiajoja.

Testaukseen kannattaakin käyttää verkossa olevaa jaettua tietokantaa mielummin esim. sovelluskehittäjän paikallisen koneen tietokantaa. Optimiratkaisu olisi tietysti se, jos jokaista testiajoa varten olisi käytettävissä oma tietokanta, sekin periaatteessa onnistuu suhteellisen helposti mm. [keskusmuistissa toimivan mongon](https://docs.mongodb.com/manual/core/inmemory/) ja [docker](https://www.docker.com)-kontaineriaation avulla. Etenemme kuitenkin nyt lyhyemmän kaavan mukaan ja käytetään testikantana normaalia mongokantaa.

Tehdään sovelluksen käynnistyspisteenä toimivaan tiedostoon _index.js_ muutama muutos:

```js
// ...
const http = require('http')
// muut requiret

const envIs = (which) => process.env.NODE_ENV === which 

if ( !envIs('production') ) {
  require('dotenv').config()
}

const url = envIs('test') ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

//...

const PORT = envIs('test') ? process.env.TEST_PORT : process.env.PORT 

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () =>{
  mongoose.connection.close()
})

module.exports = {
  app, server
}
```

Metodin _envIs_ avulla voidaan testata onko sovellus _test_- tai _production_-moodissa.

Koodi lataa ympäristömuuttujat tiedostosta _.env_ jos se _ei ole_ sovelluskehitysmoodissa.
Tiedostossa _.env_ on nyt määritelty erikseen sekä sovelluskehitysympäristön ja testausympäristön tietokannan osoite (esimerkissä molemmat ovat sovelluskehityskoneen lokaaleja mongo-kantoja) ja portti:

```bash
MONGODB_URI=mongodb://localhost/muistiinpanot
PORT=3001

TEST_PORT=3002
TEST_MONGODB_URI=mongodb://localhost/test
```

Eri porttien käyttö mahdollistaa sen, että sovellus voi olla käynnissä testien suorituksen aikana.

Tiedoston loppu on muuttunut hieman:

```js
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () =>{
  mongoose.connection.close()
})

module.exports = {
  app, server
}
```

Sovelluksen käynnistäminen tapahtuu nyt _server_-muuttujassa olevan olion kautta. Serverille määritellään tapahtumankäsitteljäfunktio tapahtumalle _close_ eli tilanteeseen, missä sovellus sammutetaan. Tapahtumankäsittelijä sulkee tietokantayhteyden.

Sekä sovellus _app_ että sitä suorittava _server_-olio määritellään eksportattavaksi tiedostosta. Tämä mahdollistaa sen, että testit voivat käynnistää ja sammuttaa backendin.


### supertest

Käytetään API:n testaamiseen avan apuna [supertest](https://github.com/visionmedia/supertest)-kirjastoa.

Kirjasto asennetaan kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev supertest
```

Luodaan heti ensimmäinen testi tiedostoon _test/note_api.test.js:_

```js
const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)

test('notes are returned as json', async () => {
  const res = await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(()=>{
  server.close()
})
```

Alussa testi käynnistää backendin ja käärii sen funktiolla _supertest_ ns. [superagent](https://github.com/visionmedia/superagent)-olioksi. Tämä olio sijoitataan muuttujaan _api_ ja sen kautta testit voivat tehdä HTTP-pyyntöjä backentdiin.

Testimetodi tekee HTTP GET -pyynnön osoitteeseen _api/notes_ ja varmistaa, että pyyntöön vastataan statuskoodilla 200 ja että data palautetaan oikeassa muodossa, eli että _Content-Type_:n arvo on _application/json_.

Testissä on muutama detalji joihin tutustumme vasta myöhemmin. Testikoodin määrittelevä nuolifunktio alkaa sanalla _async_ ja _api_-oliolle tehtyä metodikutsua edeltää sama _await_. Teemme ensin muutamia testejä ja tutustumme sen jälkeen async/await-magiaan. Tällä hetkellä niistä ei tarvitse välittää, kaikki toimii kun kirjoitat testimetodit esimerkin mukaan. Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat _asynkroonisia_ operaatioita. [Async/await-kikalla](https://facebook.github.io/jest/docs/en/asynchronous.html) saamme pyynnön näyttämään koodin tasolla synkroonisesti toimivalta. 

Kaikkien testien päätteeksi on vielä lopputoimenpiteenä pyydettävä backendia suorittava _server_-olio sammuttamaan itsensä. Tämä onnistuu helposti metodilla [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout):

```js
afterAll(()=>{
  server.close()
})
```

Tehdään pari testiä lisää:

```js
test('there are five notes', async () => {
  const res = await api
    .get('/api/notes')

  expect(res.body.length).toBe(5)
})

test('the first note is about HTTP methods', async () => {
  const res = await api
    .get('/api/notes')

  expect(res.body[0].content).toBe('HTTP-protokollan tärkeimmät metodit ovat GET ja POST')
})
```

Async/await-kikan hyödyt tulevat nyt selkeästi esiin. Normaalisti tarvitsisimme asynkronisten pyyntöjen vastauksiin käsillepääsemiseen promiseja ja takaisunkutsuja, mutta nyt kaikki menee mukavasti:

```js
  const res = await api
    .get('/api/notes')

  // tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
  // muuttujassa res on nyt HTTP-pyynnön tulos
  expect(res.body.length).toBe(5)
```

Testit menevät läpi. Testit ovat kuitenkin huonoja, niiden läpimeno riippu tietokannan tilasta. Jotta saisimme robustimmat testit, tulee tietokannan tila nollata ensin testien alussa ja sen jälkeen kantaan voidaan laittaa hallitusti testien tarvitsemaa dataa.

### Error: listen EADDRINUSE :::3002

Jos jotain patologista tapahtuu voi käydä niin, että testien suorittama palvelin jää päälle. Tällöin uusi testiajao aiheuttaa ongelmia

![]({{ "/assets/4/4.png" | absolute_url }})

Ratkaisu tilanteeseen on tappaa palvelinta suorittava prosessi. Portin 3002 varaava prosessi löytyy OSX:lla esim. komennolla <code>lsof -i :3002</code>

```bash
COMMAND  PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    8318 mluukkai   14u  IPv6 0x5428af4833b85e8b      0t0  TCP *:redwood-broker (LISTEN)
```

Komennon avulla selviää ikävyyksiä aiheuttavan prosesin PID eli prosessi id. Prosessin saa tapettua komennolla <code>KILL 8318</code> olettaen että PID on niin kuin kuvassa. Joskus prosessi on sitkeä eikä kuole ennen kuin se tapetaan komennolla <code>KILL -9 8318</code>.

En tiedä toimiiko _lsof_ samoin Linuxissa. Windowsissa se ei ei toimi ainakaan. Jos joku tietää, kertokoon asiasta Telegramissa. Tai lisätköön tähän pull requestilla.

## Tietokannan alustaminen ennen testejä

Testimme käyttää jo jestin metodia [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) sulkemaan backendin testien suoritusten jäleen. Jest tarjoaa joukon muitakin [funktioita](https://facebook.github.io/jest/docs/en/setup-teardown.html#content), joiden avulla voidaan suorittaa operaatioita ennen yhdenkään testin suorittamista tai ennen jokaisen testin suoritusta.

Päätetään alustaa tietokanta ennen kaikkien testin suoritusta, eli funktiossa [beforeAll](https://facebook.github.io/jest/docs/en/api.html#beforeallfn-timeout): 

```js
const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false,
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true
  }
]

beforeAll(async () => {
  await Note.remove({})

  initialNotes.forEach(async (note)=>{
    const noteObject = new Note(note)
    await noteObject.save()
  })
})
```

Tietokanta siis tyhjennetään aluksi ja sen jälkeen sinne lisätään kaksi muuttujaan _initialNotes_ talletettua muistinpanoa. Näin testien suoritus aloitetaan aina hallitusti samasta tilasta. Muutetaan kahta jälkimmäistä testiä vielä seuraavasti:

```js
test('all notes are returned', async () => {
  const res = await api
    .get('/api/notes')

  expect(res.body.length).toBe(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const res = await api
    .get('/api/notes')

  const contents = res.body.map(r=>r.content)

  expect(contents).toContain('HTTP-protokollan tärkeimmät metodit ovat GET ja POST')
})
```

Ennen kun teemme lisää testejä, tarkastellaan tarkemmin mitä async ja await tarkoittavat.

## async-await

Asyc- ja await ovat ES7:n mukannaan mukanaan tuoma uusi syntaksi, joka mahdollistaa asynkronisten funktioiden kutsumisen siten, että kirjoitettava koodi näyttää synkroniselta.

Olemme tähän asti käyttäneet promiseja asynkronisten operaatioiden suorittamisessa. 

Esim. muistiinpanojen hakeminen tietokannasta hoidetaan seuraavasti:

```js
  Note
    .find({})
    .then(notes => {
        console.log('operaatio palautti seuraavat muistiinpanot ', notes)
    })
```

Metodikutsu _Note.find()_ palauttaa promisen, ja saamme itse operaation tuloksen rekisteröimällä promiselle tapahtumankäsittelijän metodilla _then_.

Kaikki operaation suorituksen jälkeinen koodi kirjoitetaan tapahtumankäsittelijään. Jos haluisimme tehdä peräkkäin useita synkronisia funktiokutsuja, meneisi tilanne ikävämmäksi. Joutuisimme tekemään kutsut tapahtumankäisttelijästä. Näin synstyisi potentiaalisesti monimutkaista koodia, jopa niinsanottu [callback hell](http://callbackhell.com/).

[Ketjuttamalla promiseja](https://javascript.info/promise-chaining) tilanne pysyy jollain tavalla hanskassa, tällöinen callback-helvetin eli monien sisäkkäisten callbackein sijaan saadaan aikaan siistihkö _then_-kutsujen ketju. Olemmekin nähneet jo kurssin aikana muutaman sellaisen. Seuraavassa vielä erittäin keinotekoinen esimerkki, joka hakee ensin kaikki muistiinpanot ja sitten tuhoaa niistä ensimmäisen:

```js
  Note
    .find({})
    .then(notes => {
      return note[0].remove()  
    })
    .then(response=>{
      console.log('the first note is removed')
      // more code here
    })
```

Then-ketju on ok, mutta parempaankin pystytään. Jo ES6:ssa esitellyt [generaattorifunktiot](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) mahdollistivat [ovelan tavan](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) määritellä asynkronista koodia siten että se "näytti synkroniselta". Syntaksi ei kuitenkaan ollut paras mahdollinen ja sitä ei käytetty kovin yleisesti.

ES7:ssa Async ja Await tuvat generaattoreiden tarjoaman toiminnallisuuden ymmärrettävästi ja syntaktisesti koko javascript-kansan ulottuville.

Voisimme hakea tietokannasta kaikki muistiinpanot [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)-funktiota hyödyntäen seuraavasti:

```js
  const notes = await Note.find({})

  console.log('operaatio palautti seuraavat muistiinpanot ', notes)
```

Koodi siis näyttää täsmälleen synkroniselta koodilta, suoritettavan koodinpätkän suhteen tilanne on se, että suoritus pysähtyy komennon <code>const notes = await Note.find({})</code> ja jatkuu kyselyä vastaavan promisen _fulfillmentin_ eli onnistuneen suorituksen jälkeen seuraavalta riviltä. Promisea vastaavan operaation tulos palautetaan muuttujaan _notes_. 

Ylempänä oleva monimutkaisempi esimerkki suoritettaisiin awaitin avulla seuraavasti:

```js
  const notes = await Note.find({})
  const response = await notes[0].remove()

  console.log('the first note is removed')
```

Koodi siis yksinkertaistuu huomattavasti verrattuna suoraan promiseja käyttävään then-ketjuun. 

Awaitin käyttöön liittyy parikin tärkeeä seikkaa. Jotta asynkronisia operaatioita voi kutsua awaitin avulla, niiden täytyy olla promiseja.

Mistä tahansa kohtaa javascript-koodia ei kuitenkaan pysty awaitia käyttämään, se onnistuu ainoastaan jos ollaan  [async] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function-funktiossa.

Eli jotta, edelliset esimerkit toimisivat, olisi ne _käärittävä_ async-funktioiden sisälle:

```
const main = async () => {
  const notes = await Note.find({})
  console.log('operaatio palautti seuraavat muistiinpanot ', notes)

  const notes = await Note.find({})
  const response = await notes[0].remove()

  console.log('the first note is removed')
}

main()
```

Koodi määrittelee ensin asynkronisen funktion joka sijoitetaan muuttujaan _main_, sen jälkeen se kutsuu metodia _main()_

### virheiden käsittely ja async/await


## Mongoose
  - Monimutkaisemmat skeemat
  - Viittaukset kokoelmien välillä

## Web
  - Token-autentikaatio
  - JWT

## Muu
  - lint


## React
  - Lisää formeista: mm refs
  - Bootstrap (reactstrap) tai Semantic UI
  - Periaatteita: Virtual dom
  - Proptype
  - child https://reactjs.org/docs/composition-vs-inheritance.html

## Frontendin testauksen alkeet
  - Ava jsdom enzyme

## misc
  - Http-operaatioiden safety ja idempotency
  - Helmet.js https://www.npmjs.com/package/helmet
