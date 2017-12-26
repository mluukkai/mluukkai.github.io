---
layout: page
title: osa 4
permalink: /osa4/
---

<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>
</div>

## Osan 4 oppimistavoitteet

- Node.js / Express
  - Router
  - sovelluksen jakaminen osiin
- Node.js -sovellusten testaus
  - jest/supertest
- JS
  - async/await
- Mongoose
  - Monimutkaisemmat skeemat
  - Viittaukset kokoelmien välillä
  - populointi
- Web
  - Token-autentikaatio
  - JWT
- konfiguraatiot
  - ESlint

## Sovelluksen rakenteen parantelu

Muutetaan sovelluksen rakennetta siten, että projektin juuressa oleva _index.js_ lähinnä ainoastaan konfiguroi sovelluksen tietokannan ja middlewaret. Siirretään routejen määrittely omaan tiedostoonsa.

Routejen tapahtumankäsittelijöitä kutsutaan usein _kontrollereiksi_. Luodaankin hakemisto _controllers_ ja sinne tiedosto _notes.js_ johon tulemme siirtämään kaikki muistiinpanoihin liittyvien reittien määrittelyt.

Tiedoston sisältö on seuraava:

```js
const routerRouter = require('express').Router()
const Note = require('../models/note')

const formatNote = (note) => {
  return {
    id: note._id,
    content: note.content,
    date: note.date,
    important: note.important
  }
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

Kyseessä on käytännössä melkein suora copypaste tiedostosta _index.js_.

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

Ohjelman käynnistyspiste, eli määrittelyt tekevä _index.js_ ottaa määrittelemämme routerin käyttöön seuraavasti:

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

test('palindrom of a', () => {
  const result = palindrom('a')

  expect(result).toBe('a')
})

test('palindrom of react', () => {
  const result = palindrom('react')

  expect(result).toBe('tcaer')
})

test('palindrom of saippuakauppias', () => {
  const result = palindrom('saippuakauppias')

  expect(result).toBe('saippuakauppias')
})
```

Testi ottaa ensimmäisellä rivillä testattavan funktion sijoittaen sen muuttujaan _palindrom_.

Ysittäinen testitapaus määritellään funktion _test_ avulla. Ensimmäisenä parametrina on merkkijonomuotoinen testin kuvaus. Toisena parametrina on _funktio_, joka määrittelee testitapauksen toiminnallisuuden. Esim. testitapauksista toinen näyttää seuraavalta:

```js
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
test('palindrom of react', () => {
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

describe('average', () => {

  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is caclulated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
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
describe('average', () => {
  // testit
})
```

Describejen avulla yksittäisessä tiedostossa olevat testit voidaan jaoitella loogisiin kokonaisuuksiin. Testituloste hyödyntää myös describe-lohkon nimeä:

![]({{ "/assets/4/4.png" | absolute_url }})

Kuten myöhemmin tulemme näkemään, _describe_-lohkot ovat tarpeellisia siinä vaiheessa, jos haluamme osalle yksittäisen testitiedoston testitapauksista jotain yhteisiä alustustoimenpiteitä.

Toisena huomiona se, että kirjoitimme testit aavistuksen tiiviimmässä muodossa, ottamatta testattavan metodin tulosta erikseen apumuuttujaan:

```js
  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
```

## Tehtäviä

### tee testit ja toteuta metodit...

## api:n testaaminen

Joissain tilanteissa voisi olla mielekästä suorittaa ainakin osa backendin testauksesta siten, että oikea tietokanta eristettäisiin testeistä ja korvattaisiin "valekomponentilla" eli mockilla, eräs tähän sopiva ratkaisu olisi [mongo-mock](https://github.com/williamkapke/mongo-mock)

Koska sovelluksemme backend on koodiltaan kuitenkin suhteellisen yksinkertainen, päätämme testata sitä kokonaisuudessaan, siten että testeissä käytetään myös tietokantaa. Tämänkaltaisia, useita sovelluksen komponetteja yhtäaikaa käyttäviä testejä voi luonnehtia _integraatiotesteiksi_.

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

Alussa testi käynnistää backendin ja käärii sen funktiolla _supertest_ ns. [superagent](https://github.com/visionmedia/superagent)-olioksi. Tämä olio sijoitataan muuttujaan _api_ ja sen kautta testit voivat tehdä HTTP-pyyntöjä backendiin.

Testimetodi tekee HTTP GET -pyynnön osoitteeseen _api/notes_ ja varmistaa, että pyyntöön vastataan statuskoodilla 200 ja että data palautetaan oikeassa muodossa, eli että _Content-Type_:n arvo on _application/json_.

Testissä on muutama detalji joihin tutustumme vasta myöhemmin. Testikoodin määrittelevä nuolifunktio alkaa sanalla _async_ ja _api_-oliolle tehtyä metodikutsua edeltää sama _await_. Teemme ensin muutamia testejä ja tutustumme sen jälkeen async/await-magiaan. Tällä hetkellä niistä ei tarvitse välittää, kaikki toimii kun kirjoitat testimetodit esimerkin mukaan. Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat _asynkroonisia_ operaatioita. [Async/await-kikalla](https://facebook.github.io/jest/docs/en/asynchronous.html) saamme pyynnön näyttämään koodin tasolla synkroonisesti toimivalta.

Kaikkien testien päätteeksi on vielä lopputoimenpiteenä pyydettävä backendia suorittava _server_-olio sammuttamaan itsensä. Tämä onnistuu helposti metodilla [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout):

```js
afterAll(() => {
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

Async/await-kikan hyödyt tulevat nyt selkeästi esiin. Normaalisti tarvitsisimme asynkronisten pyyntöjen vastauksiin käsillepääsemiseen promiseja ja takaisinkutsuja, mutta nyt kaikki menee mukavasti:

```js
  const res = await api
    .get('/api/notes')

  // tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
  // muuttujassa res on nyt HTTP-pyynnön tulos
  expect(res.body.length).toBe(5)
```

Testit menevät läpi. Testit ovat kuitenkin huonoja, niiden läpimeno riippu tietokannan tilasta. Jotta saisimme robustimmat testit, tulee tietokannan tila nollata ensin testien alussa ja sen jälkeen kantaan voidaan laittaa hallitusti testien tarvitsemaa dataa.

### Error: listen EADDRINUSE :::3002

Jos jotain patologista tapahtuu voi käydä niin, että testien suorittama palvelin jää päälle. Tällöin uusi testiajao aiheuttaa ongelmia, ja seurauksena on virheilmoitus

<pre>
Error: listen EADDRINUSE :::3002
</pre>

Ratkaisu tilanteeseen on tappaa palvelinta suorittava prosessi. Portin 3002 varaava prosessi löytyy OSX:lla esim. komennolla <code>lsof -i :3002</code>

```bash
COMMAND  PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    8318 mluukkai   14u  IPv6 0x5428af4833b85e8b      0t0  TCP *:redwood-broker (LISTEN)
```

Komennon avulla selviää ikävyyksiä aiheuttavan prosesin PID eli prosessi id. Prosessin saa tapettua komennolla <code>KILL 8318</code> olettaen että PID on niin kuin kuvassa. Joskus prosessi on sitkeä eikä kuole ennen kuin se tapetaan komennolla <code>KILL -9 8318</code>.

En tiedä toimiiko _lsof_ samoin Linuxissa. Windowsissa se ei ei toimi ainakaan. Jos joku tietää, kertokoon asiasta Telegramissa. Tai lisätköön tähän pull requestilla.

## Tietokannan alustaminen ennen testejä

Testimme käyttää jo jestin metodia [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) sulkemaan backendin testien suoritusten jälkeen. Jest tarjoaa joukon muitakin [funktioita](https://facebook.github.io/jest/docs/en/setup-teardown.html#content), joiden avulla voidaan suorittaa operaatioita ennen yhdenkään testin suorittamista tai ennen jokaisen testin suoritusta.

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

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
```

Tietokanta siis tyhjennetään aluksi ja sen jälkeen sinne lisätään kaksi taulukkoon _initialNotes_ talletettua muistiinpanoa. Näin testien suoritus aloitetaan aina hallitusti samasta tilasta.

Muutetaan kahta jälkimmäistä testiä vielä seuraavasti:

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

Ennen kun teemme lisää testejä, tarkastellaan tarkemmin mitä _async_ ja _await_ tarkoittavat.

## async-await

Async- ja await ovat ES7:n mukanaan tuoma uusi syntaksi, joka mahdollistaa _promisen palauttavien asynkronisten funktioiden_ kutsumisen siten, että kirjoitettava koodi näyttää synkroniselta.

Esim. muistiinpanojen hakeminen tietokannasta hoidetaan promisejen avulla seuraavasti:

```js
Note
  .find({})
  .then(notes => {
    console.log('operaatio palautti seuraavat muistiinpanot ', notes)
  })
```

Metodikutsu _Note.find()_ palauttaa promisen, ja saamme itse operaation tuloksen rekisteröimällä promiselle tapahtumankäsittelijän metodilla _then_.

Kaikki operaation suorituksen jälkeinen koodi kirjoitetaan tapahtumankäsittelijään. Jos haluisimme tehdä peräkkäin useita asynkronisia funktiokutsuja, menisi tilanne ikävämmäksi. Joutuisimme tekemään kutsut tapahtumankäsittelijästä. Näin syntyisi potentiaalisesti monimutkaista koodia, jopa niin sanottu [callback-helvetti](http://callbackhell.com/).

[Ketjuttamalla promiseja](https://javascript.info/promise-chaining) tilanne pysyy jollain tavalla hallinnassa, callback-helvetin eli monien sisäkkäisten callbackein sijaan saadaan aikaan siistihkö _then_-kutsujen ketju. Olemmekin nähneet jo kurssin aikana muutaman sellaisen. Seuraavassa vielä erittäin keinotekoinen esimerkki, joka hakee ensin kaikki muistiinpanot ja sitten tuhoaa niistä ensimmäisen:

```js
Note
  .find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

Then-ketju on ok, mutta parempaankin pystytään. Jo ES6:ssa esitellyt [generaattorifunktiot](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) mahdollistivat [ovelan tavan](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) määritellä asynkronista koodia siten että se "näyttää synkroniselta". Syntaksi ei kuitenkaan ole täysin luonteva ja sitä ei käytetä kovin yleisesti.

ES7:ssa async ja await tuovat generaattoreiden tarjoaman toiminnallisuuden ymmärrettävästi ja syntaktin puolesta selkeällä tavalla koko javascript-kansan ulottuville.

Voisimme hakea tietokannasta kaikki muistiinpanot [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)-funktiota hyödyntäen seuraavasti:

```js
const notes = await Note.find({})

console.log('operaatio palautti seuraavat muistiinpanot ', notes)
```

Koodi siis näyttää täsmälleen synkroniselta koodilta, suoritettavan koodinpätkän suhteen tilanne on se, että suoritus pysähtyy komentoon <code>const notes = await Note.find({})</code> ja jatkuu kyselyä vastaavan promisen _fulfillmentin_ eli onnistuneen suorituksen jälkeen seuraavalta riviltä. Promisea vastaavan operaation tulos on sijoitettu muuttujaan _notes_.

Ylempänä oleva monimutkaisempi esimerkki suoritettaisiin awaitin avulla seuraavasti:

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

Koodi siis yksinkertaistuu huomattavasti verrattuna suoraan promiseja käyttävään then-ketjuun.

Awaitin käyttöön liittyy parikin tärkeeä seikkaa. Jotta asynkronisia operaatioita voi kutsua awaitin avulla, niiden täytyy olla promiseja mikä ei sinänsä ole ongelma, sillä myös "normaaleja" callbackeja käyttävä asynkroninen koodi on helppo kääriä promiseksi.

Mistä tahansa kohtaa javascript-koodia ei kuitenkaan pysty awaitia käyttämään. Awaitin käyttö onnistuu ainoastaan jos ollaan [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_functio)-funktiossa.

Eli jotta, edelliset esimerkit toimisivat, on ne suoritettava async-funktioiden sisällä:

```js
const main = async () => {
  const notes = await Note.find({})
  console.log('operaatio palautti seuraavat muistiinpanot', notes)

  const notes = await Note.find({})
  const response = await notes[0].remove()

  console.log('the first note is removed')
}

main()
```

Koodi määrittelee ensin asynkronisen funktion, joka sijoitetaan muuttujaan _main_, sen jälkeen koodi kutsuu metodia _main()_

### testin beforeAll-metodin optimointi

Palataan takaisin testien pariin, ja tarkastellaan määrittelemäämme testit alustavaa funktiota _beforeAll_:

```js
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

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
```

Funktio tallettaa tietokantaan taulukon nollannen ja ensimmäisen alkion, kummankin erikseen taulukon alkioita indeksöidä. Ratkaisu on ok, mutta jos haluaisimme tallettaa alustuksen yhteydessä kantaan useapia alkioita, olisi toisto parempi ratkaisu:

```js
beforeAll(async () => {
  await Note.remove({})
  console.log('clearead')

  initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

Talletamme siis taulukossa _initialNotes_ määritellyt muistiinpanot tietokantaan _forEach_-loopissa. Testeissä kuitenkin ilmenee jotain häikkää, ja sitä varten koodin sisään on lisätty aputulosteita.

Konsoliin tulostuu

<pre>
cleared
done
entered test
saved
saved
</pre>

Yllättäen ratkaisu ei async/awaitista huolimatta toimi niinkuin oletamme, testin suoritus aloitetaan ennen kun tietokannan tila on saatu alustettua!

Ongelma on siinä, että jokainen forEach-loopin läpikäynti generoi oman asynkronisen operaation ja _beforeAll_ ei odota näiden suoritusta. Eli forEach:in sisällä olevat _await_-komennot eivät ole funktiossa _beforeEach_ vaan erillisissä asynkronisesti suoritettavissa funktioissa.

Koska testien suoritus alkaa heti _beforeAll_ metodin suorituksen jälkeen. Testien suoritus ehdittäisiin jo aloittaa, ennen kuin tietokanta on alustettu toivottuun alkutilaan.

Toimiva ratkaisu olisi odottaa asynkronisten talletusoperaatioiden valmistumista _beforeAll_-funktiossa, esim. metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla:

```js
beforeAll(async () => {
  await Note.remove({})

  const noteObjects = initialNotes.map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

```

Ratkaisu on varmasti aloittelijalle tiiviydestään huolimatta hieman haastava. Taulukkoon _noteObjects_ talletetaan taulukkoon _initialNotes_ talletettuja javascript-oliota vastaavat _Note_-konstruktorifunktiolla generoidut Mongoose-oliot. Seuraavalla rivillä luodaan uusi taulukko, joka muodostuu promiseista, jotka saadaan kun jokaiselle _noteObjects_ taulukon alkiolle kutsutaan metodia _save_, eli ne talletetaan kantaan.

Viimeinen rivi, _await Promise.all(promiseArray)_ odottaa, että kaikki tietokantaan talletusta vastaavat promiset ovat valmiina, eli alkiot on talletettu tietokantaan.

Javascriptin asynkrooninen suoritusmalli aiheuttaakin siis helposti yllätyksiä ja myös async/await-syntaksin kanssa saa olla koko ajan tarkkana. Vaikka async/await peittää monia promisejen käsittelyyn liittyviä seikkoja, promisejen toiminta on tuntea mahdollisimman hyvin!

### async/await backendissä

Muutentaan nyt backend käyttämään asyncia ja awaitia. Koska kaikki asynkrooniset operaatiot tehdään joka tapauksessa funktioiden sisällä awaitin käyttämiseen riittää, että muutamme routejen käsittelijät async-funktioiksi

Kaikkien muistiinpanojen hakemisesta vastaava route muuttuu seuraavasti:

```js
routerRouter.get('/', async (request, response) => {
  const notes = await Note.find({}, '-__v')
  response.json(notes.map(formatNote))
})
```

Voimme varmistaa refaktoroinnin onnistumisen selaimella, mutta suorittamalla juuri määrittelemämme testit.

### testejä ja backendin refaktorinita

Koodia refaktoroidessa vaanii aina [regression](https://en.wikipedia.org/wiki/Regression_testing) vaara, eli on olemassa riski, että jo toimineen ominaisuudet hajoavat. Tehdäänkin refaktorointi siten, että ennen koodin muutosta tehdään jokaiselle API:n routelle ensin toimminnallisuuden varmistavat testit.

Aloitetaan lisäysoperaatiosta. Tehdään testi, joka lisää uuden muistiinpanon ja tarkistaa, että rajapinnan palauttamien mustiinpanojen määrä kasvaa, ja että lisätty muistiinpano on palautettujen joukossa:

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await yksinkertaistaa asynkroonisten funktioiden kutsua',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const res = await api
    .get('/api/notes')

  const contents = res.body.map(r => r.content)

  expect(res.body.length).toBe(initialNotes.length+1)
  expect(contents).toContain('async/await yksinkertaistaa asynkroonisten funktioiden kutsua')
})
```

Tehdään myös testi, joka varmistaa, että muistiinpanoa, jolle ei ole asetettu sisältöä ei talleteta

```js
test('note without content is not be added ', async () => {
  const newNote = {
    important: true
  }

  const intialNotes = await api
    .get('/api/notes')

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const res = await api
    .get('/api/notes')

  const contents = res.body.map(r => r.content)

  expect(res.body.length).toBe(intialNotes.body.length)
})
```

Testi ei mene läpi. Käy ilmi, että operaation suoritus postman:illa johtaa myös virhetilanteeseen, eli koodissa on bugi.

Konsoli paljastaa, että kyseessä on _Unhandled promise rejection_, eli koodi ei käsittele promisen virhetilannetta.

<pre>
Server running on port 3001
Method: POST
Path:   /api/notes/
Body:   { important: true }
---
(node:28657) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Can't set headers after they are sent.
(node:28657) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
</pre>

Kuten jo edellisessä osassa mainittiin, tämä ei ole hyvä idea. Kannattaakin aloittaa lisäämällä promise-ketjuun metodilla _catch_ virheenkäisttelijä, joka tulostaa konsoliin virheen syyn:

```js
routerRouter.post('/', (request, response) => {
  // ...

  note
    .save()
    .then(note => {
      return formatNote(note)
    })
    .then(formattedNote => {
      response.json(formattedNote)
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: 'something whent wrong...' })
    })
```

Konsoliin tulostuu seuraava virheilmoitus

<pre>
Error: Can't set headers after they are sent.
    at validateHeader (_http_outgoing.js:489:11)
    at ServerResponse.setHeader (_http_outgoing.js:496:3)
</pre>

Aloittelijalle virheilmoitus ei välttämättä kerro paljoa, mutta googlaamalla virheilmoituksella, pieni etsiminen tuottaisi jo tuloksen.

Kyse on siitä, että koodi kutsuu _response_-olion metodia _send_ kaksi kertaa, tai oikeastaan koodi kutsuu metodia _json_, joka kutsuu edelleen metodia _send_.

Kaksi kertaa tapahtuva _send_-kutsu johtuu siitä, että koodin alun _if_-lauseessa on ongelma:

```js
routerRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    response.status(400).json({ error: 'content missing' })
    // suoritus jatkuu!
  }

  //...
}
```

kun koodi kutsuu <code>response.status(400).json(...)</code> suoritus jatkaa koodin allaolevaa osaan ja se taas aiheuttaa uuden <code>response.json()</code>-kutsun.

Korjataan ongelma lisäämällä _if_-lauseeseen _return_:

```js
routerRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  //...
}
```

Promiseja käyttävä koodi toimii nyt ja testitkin menevät läpi. Olemme valmiit muuttamaan koodin käyttämään async/await-syntaksia.

Koodi muuttuu seuraavasti (huomaa, että käsittelijän alkuun on laitettava määre _async_):

```js
routerRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.content === undefined ? false : body.important,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(formatNote(note))
})
```

Koodiin jää kuitenkin pieni ongelma: virhetilanteita ei nyt käsitellä ollenkaan. Miten niiden suhteen tulisi toimia?

### virheiden käsittely ja async/await

Jos sovellus nyt kaatuu jonkinlaiseen ajoiaikaiseen virheeseen, syntyy jäälleen tuttu tilanne:

<pre>
(node:30644) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): TypeError: formattedNote.nonexistingMethod is not a function
</pre>

eli käsittelemätön promisen rejektoituminen. Pyyntöön ei vastata tilanteessa mitenkään.

Async/awaitia käyttäessä kannattaa käyttää vanhaa kunnon _try/catch_-mekanismia virheiden käsittelyyn:

```js
routerRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
      content: body.content,
      important: body.content === undefined ? false : body.important,
      date: new Date(),
    })

    const savedNote = await note.save()
    response.json(formatNote(note))
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'something whent wrong...' })
  }
})
```

Iso try/catch tuo koodiin hieman ikävän vivahteen, mutta mikään ei ole ilmaista.

Tehdään sitten testit yksittäisen muistiinpanon tietojen katsomiselle ja muistiinpanon poistolle:

```js
test('a specific note can be viewed', async () => {
  const resultAll = await api
    .get('/api/notes')

  const aNoteFromAll = resultAll.body[0]

  const resultNote = await api
    .get(`/api/notes/${aNoteFromAll.id}`)

  const noteObject = resultNote.body

  expect(noteObject).toEqual(aNoteFromAll)
})

test('a note can be deleted', async () => {
  const newNote = {
    content: 'HTTP DELETE poistaa resurssin',
    important: true
  }

  const addedNote = await api
    .post('/api/notes')
    .send(newNote)

  const notesAtBeginningOfOperation = await api
    .get('/api/notes')

  await api
    .delete(`/api/notes/${addedNote.body.id}`)

  const notesAfterDelete = await api
    .get('/api/notes')

  const contents = notesAfterDelete.body.map(r => r.content)

  expect(contents).not.toContain('HTTP DELETE poistaa resurssin')
  expect(notesAfterDelete.body.length).toBe(notesAtBeginningOfOperation.body.length-1)
})
```

Testit eivät tässä vaiheessa ole optimaaliset, parannetaan niitä kohta. Ensin kuitenkin refaktoroidaan backend käyttämään async/awaitia.

```js
routerRouter.get('/:id', async (request, response) => {
  try {
    const note = await Note.findById(request.params.id)

    if (note) {
      response.json(formatNote(note))
    } else {
      response.status(404).end()
    }

  } catch(exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

routerRouter.delete('/:id', async (request, response) => {
  try {
    await Note.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})
```

Async/await ehkä selkeyttää koodia jossain määrin, mutta saavutettava hyöty ei ole sovelluksessamme vielä niin iso mitä se tulee olemaan jos asnynkronisia kutsuja on tehtävä useampia.

Kaikki eivät kuitenkaan ole vakuuttuneita siitä, että async/await on hyvä lisä javascriptiin, lue esim. [ES7 async functions - a step in the wrong direction
](https://spion.github.io/posts/es7-async-await-step-in-the-wrong-direction.html)

## Testien refaktorointi

Testimme ova sisältävät tällä hetkellä jossain määrin toisteisia ja niiden rakenne ei ole optimaalinen. Testit ovat myös osittain epätäydelliset, esim. reittejä GET /api/notes/:id ja DELETE /api/notes/:id ei tällä hetkellä testata epävalidien id:iden osalta.

Parannellaan testejä hiukan.

Tehdään testejä varten muutama apufunktio moduuliin _test/test_helper.js_

```js
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

const format = (note) => {
  return {
    content: note.content,
    important: note.important,
    id: note._id
  }
}

const nonExistingId = async () => {
  const note = new Note()
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(format)
}

module.exports = {
  initialNotes, format, nonExistingId, notesInDb
}
```

Jossain määrin parannellut testit seuraavassa:

```js
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Note = require('../models/note')
const { format, initialNotes, nonExistingId, notesInDb } = require('./test_helper')

describe('when there is initially some notes saved', async () => {
  let notesInDatabaseAtStart = []

  beforeAll(async () => {
    await Note.remove({})

    const noteObjects = initialNotes.map(n=>new Note(n))
    await Promise.all(noteObjects.map(n=>n.save()))
    notesInDatabaseAtStart = noteObjects.map(n => format(n))
  })

  test('all notes are returned as json by GET /api/notes', async () => {
    const response = await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(initialNotes.length)

    const returnedContents = response.body.map(n=>n.content)
    notesInDatabaseAtStart.forEach(note=>{
      expect(returnedContents).toContain(note.content)
    })
  })

  test('individual notes are returned as json by GET /api/notes/:id', async () => {
    const aNote = notesInDatabaseAtStart[0]

    const response = await api
      .get(`/api/notes/${aNote.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.content).toBe(aNote.content)
  })

  test('404 returned by GET /api/notes/:id with nonexisting valid id', async () => {
    const validNonexistingId = await nonExistingId()

    const response = await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('400 returned by GET /api/notes/:id with invalid id', async () => {
    const invalidId = "5a3d5da59070081a82a3445"

    const response = await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })

  describe('addition of a new note', async () => {

    test('POST /api/notes succeeds with valid data', async () => {
      const notesAtBeginningOfOperation = await notesInDb()

      const newNote = {
        content: 'async/await yksinkertaistaa asynkroonisten funktioiden kutsua',
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const notesAfterOperation = await notesInDb()

      expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length + 1)

      const contents = notesAfterOperation.map(r => r.content)
      expect(contents).toContain('async/await yksinkertaistaa asynkroonisten funktioiden kutsua')
    })

    test('POST /api/notes fails with proper statuscode if content is missing', async () => {
      const newNote = {
        important: true
      }

      const notesAtBeginningOfOperation = await notesInDb()

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAfterOperation = await notesInDb()

      const contents = notesAfterOperation.map(r => r.content)

      expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length)
    })
  })

  describe('deletion of a note', async () => {
    let addedNote

    beforeAll(async () => {
      addedNote = new Note({
        content: 'poisto pyynnöllä HTTP DELETE',
        important: false
      })
      await addedNote.save()
    })

    test('DELETE /api/notes/:id succeeds with proper statuscode', async () => {
      const notesAtBeginningOfOperation = await notesInDb()

      await api
        .delete(`/api/notes/${addedNote._id}`)
        .expect(204)

      const notesAfterOperation = await notesInDb()

      const contents = notesAfterOperation.map(r => r.content)

      expect(contents).not.toContain(addedNote.content)
      expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length-1)
    })
  })

  afterAll(() => {
    server.close()
  })

})
```

Muutama huomio testeistä. Olemme määritelleet jaotelleet testejä [desribe](http://facebook.github.io/jest/docs/en/api.html#describename-fn)-lohkojen avulla ja muutamissa lohkoissa on oma [beforeAll](http://facebook.github.io/jest/docs/en/api.html#beforeallfn-timeout)-funktiolla suoritettava alustuskoodi. Sisäkkäisten describe-lohkojen tapauksessa kaikki aulustuskoodi tulee suoritetuksi, ensin ulompana olevat _beforet_ ja lopulta ne _beforet_, jotka on määritelty siinä describe-lohkossa, jossa suoritettavat testit sijaitsevat.

Testien raportointi tapahtuu _describe_-lohkojen ryhmittelyn mukaan

![]({{ "/assets/4/5.png" | absolute_url }})

Backendin tietokantaa muttavat testit, esim. uuden muistiinpanon lisäämistä testaava testi, on tehty siten, että ne ensin aluksi selvittävät tietokannan tilan apufunktiolla _notesInDb()_

```js
const notesAtBeginningOfOperation = await notesInDb()
```

suorittavat testattavan operaation:

```js
const newNote = {
  content: 'async/await yksinkertaistaa asynkroonisten funktioiden kutsua',
  important: true
}

await api
  .post('/api/notes')
  .send(newNote)
  .expect(200)
  .expect('Content-Type', /application\/json/)
```

selvittävät tietokannan tilan operaation jälkeen

```js
const notesAfterOperation = await notesInDb()
```

ja varmentavat, että operaation suoritus vaikutti tietokantaan halutulla tavalla

```js
expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length + 1)

const contents = notesAfterOperation.map(r => r.content)
expect(contents).toContain('async/await yksinkertaistaa asynkroonisten funktioiden kutsua')
```

Testeihin jää vielä paljon parannettavaa mutta on jo aika siirtä eteenpäin.

Käytetty tapa API:n testaamiseen, eli HTTP-pyyntöinä tehtävät operaatiot ja tietokannan tilan tarkastelu Mongoosen kautta ei ole suinkaa ainoa tai paras tapa tehdä API-tason integraatiotestausta. Universaalisti parasta tapaa tehdä testausta ei ole, kaikki on aina suhteessa käytettäviin resursseihin ja testattavaan ohjelmistoon.

## Käyttäjienhallinta ja monimutkaisempi tietokantarakenne

Haluamme toteuttaa sovellukseemme käyttäjienhallinnan. Käyttäjät tulee tallettaa tietokantaan ja jokaisesta muistiinpanosta tulee tietää sen luonut käyttäjä. Muistiinpanojen poisto ja editointi tulee olla sallittua ainoastaan muistiinpanot tehneelle käyttäjälle.

Aloitetaan lisäämällä tietokantaan tieto käyttäjistä. Käyttäjän (User) ja muistiinpanojen (Note) välillä on yhden suhde moneen -yhteys:

![](https://yuml.me/a187045b.png)

Relaatiotietokantoja käytettäessä ratkaisua ei tarvitisisi juuri miettiä. Molemmille olisi oma taulunsa ja muistiinpanoihin liitettäisiin sen luonutta käyttäjää vastaava id vierasavaimeksi (foreign key).

Dokumenttitietokantoja käytettäessä tilanne on kuitenkin toinen, erilaisia tapoja mallintaa tilanne on useita.

Olemassaoleva ratkaisumme tallentaa jokaisen luodun muistiinpanon tietokantaan _notes_-kokoelmaan eli _collectioniin_. Jos emme halua muuttaa tätä, lienee luontevinta tallettaa käyttäjät omaan kokoelmaansa, esim. nimeltään _users_.

Mongossa voidaan kaikkien dokumenttitietokantojen tapaan käyttää olioiden id:itä viittaamaan muissa kokoelmissa talletettaviin alkioihin, vastaavasti kuten viiteavaimia käytetään relaatiotietokannoissa.

Dokumenttitietokannat kuten mongo eivät kuitenkaan tue relaatioitietokantojen _liitoskyselyitä_ vastaavaa toiminnallisuutta, joka mahdollistaisi useaan kokoelmaan kohdistuvan tietokantahaun (tämä ei ole tarkalleen ottaen enää välttämättä pidä paikkaansa, versiosta 3.2. alkaen mongo on tukenut useampaan kokoelmaan kohdistuvia [lookup-aggregaattikyselyitä](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/), emme kuitenkaan niitä kurssillamme käsittele).

Jos haluamme tehdä liitoskyselyitä, tulee ne toteuttaa sovelluksen tasolla, eli käytännössä tekemällä tietokantaan useita kyselyitä. Tietyissä tilanteissa mongoose-kirjasto osaa hoitaa taustalla liitosten tekemisen, jolloin kysely näyttää mongoosen käyttäjälle toimivan liitoskyselyn tapaan, mutta mongoose tekee kuitekin taustalla useamman kyselyn.

### viitteet kokoelmien välillä

Relaatiotietokannoissa muistiinpano sisältää viiteavaimen sen tehneeseen käyttäjään. Dokumenttitietokannassa voidaan toimia samoin. Oletetaan että kokoelmassa _users_ on kaksi käyttäjää:

```js
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    content: 'hellas',
    _id: 141414
  }
```

Kokoelmassa _notes_ on kolme muistiinpanoa, molempien kenttä _user_id_ viittaa _users_-kentässä olevaan käyttäjään.

```js
  {
    content: 'HTML on helppoa',
    important: false,
    _id: 221212,
    user_id: 123456
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true,
    _id: 221255,
    user_id: 123456
  },
  {
    content: 'Java on kieli, jota käytetään siihen asti kunnes aurinko sammuu',
    important: false,
    _id: 221244,
    user_id: 141414
  }
```

Mikään ei kuitenkaan määrää dokumenttitietokannoissa, että viittet on talletettava muistiinpanoihin, ne voivat olla _myös_ (tai ainoastaan) käyttäjien yhteydessä:

```js
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [221212, 221255]
  },
  {
    content: 'hellas',
    _id: 141414,
    notes: [141414]
  }
```

Koska käyttäjiin liittyy potentiaalisesti useita muistiinpanoja, talletetaan niiden id:t käyttäjän yhteydessä olevaan taulukkoon.


Dokumenttitietokannat tarjoavat myös radikaalisti erilaisen tavan datan organisointiin, joissain tilanteissa saattaisi olla mielekästä tallettaa muistiinpanot käyttäjäolioiden kentäksi "embedattuna":

```js
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML on helppoa',
        important: false,
      },
      {
        content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
        important: true,
      }
    ]
  },
  {
    content: 'hellas',
    _id: 141414,
    notes: [
      {
        content: 'Java on kieli, jota käytetään siihen asti kunnes aurinko sammuu',
        important: false,
      }
    ]
  }
```

Muistiinpanot olisivat tässä skeemaratkaisussa siis yhteen käyttäjään alisteisia kenttiä, niillä ei olisi edes omaa identitettiä, eli id:tä tietokannan tasolla.

Dokumenttietietokantojen yhteydessä skeeman rakenne ei siis ole ollenkaan samalla tavalla ilmeinen kuin relaatiotietokannoissa, ja valittava ratkaisu kannattaa määritellä siten että se tukee parhaalla tavalla sovelluksen käyttötapauksia. Tämä ei luonnollisestikaan ole helppoa, sillä järjestelmän kaikki käyttötapaukset eivät yleensä ole selvillä siinä vaiheessa kun projektin alkuvaiheissa mietitään datan organisointitapoja.

Hieman paradoksaalisesti tietokannan tasolla skeematon Mongo edellyttääkin projektin alkuvaiheissa jopa radikaalimpia datan organisoimiseen liittyien ratkaisujen tekemistä kuin tietokannan tasolla skeemalliset relaatiotietokannat, jotka tarjoavat keskimäärin kaikkiin tilanteisiin melko hyvin sopivan tavan organisoida dataa.

### käyttäjien mongoose-skeema

Päätetään tallettaa käyttäjän yhteyteen myös tieto käyttäjän luomista muistiinpanoista, eli käytännössä muistiinpanojen id:t. Määritellään käyttäjää edustava model tiedostoon _models/user:_

```js
const mongoose = require('mongoose')

const User = mongoose.model('Note', {
  username: String,
  name: String,
  passwordHash: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
})

module.exports = User
```

Muistiinpanojen id:t on talletettu käyttäjien sisälle taulukkona mongo-id:itä. Määrittely on seuraava

```js
{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }
```

kentän tyyppi on _ObjectId_ joka viittaa _Note_-tyyppisiin dokumentteihin. Mongo ei itsessään tiedä mitään siitä, että kyse on kentästä joka viittaa nimenomaan muistiinpanoihin, kyseessä onkin puhtaasti mongoosen syntaksi.

Laajennetaan muistiinpanon skeemaa siten, että myös muistiinpanoissa on tieto ne luoneesta käyttäjästä


```js
const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})
```

Relaatiotietokannoista poiketen, viitteet on nyt talletettu molempiin dokumentteihin, muistiinpano viittaa sen luoneeseen käyttäjään ja käyttäjä sisältää taulukollisen viitteitä sen luomiin muistiinpanoihin.

### Käyttäjien luominen

Toteutetaan seuraavaksi route käyttäjien luomista varten. Käyttäjällä on siis _username_ jonka täytyy olla järjestelmässä yksikäsitteinen, nimi eli _name_ sekä _passwordHash_, eli salasanasta [yksisuuntaisen funktion](https://en.wikipedia.org/wiki/Cryptographic_hash_function) perusteella laskettu tunniste. Salasanojahan ei ole koskaan viisasta tallentaa tietokantaan selväsanaisena!

Asennetaan salasanojen hashaamiseen käyttämämme [bcrypt](https://github.com/kelektiv/node.bcrypt.js)-kirjasto:

```bash
install bcrypt --save
```

Käyttäjien luominen tapahtuu osassa 3 läpikäytyjä [RESTful](osa3/#rest)-periaatteita seuraten tekemällä HTTP POST -pyyntö polkuun _users_.

Määritellään käyttäjienhallintaa varten oma _router_ tiedostoon _controllers/users_, ja liitetään se _index.js_-tiedostossa huolehtimaan polulle _/api/users/_ tulevista pyynnöistä:

```js
const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)

const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)

// ...
```

Routerin alustava sisältö on seuraava:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const mongoose = require('mongoose')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something whent wrong...' })
  }
})

module.exports = usersRouter
```

Tietokantaan siis _ei_ talleteta pyynnön mukana tulevaa salasanaa, vaan funktion _bcrypt.hash_ avulla laskettu _hash_.

Materiaalin tilamäärä ei valitettavasti riitä käsittelemään sen tarkemmin salasanojen [tallennuksen perusteita](https://codahale.com/how-to-safely-store-a-password/), esim mitä maaginen luku 10 muuttujan [saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds) arvona tarkoittaa. Lue linkkien takaa lisää.

Koodissa ei tällä hetkellä ole mitään virheidenkäsittelyä ja validointeja, eli esim. käyttäjätunnuksen ja salasanan halutun muodon tarkastuksia.

Uutta ominaisuutta voidaan ja kannattaakin joskus testailla käsin esim. postmanilla. Käsin tapahtuva testailu muuttuu kuitenkin nopeasti työlääksi, eteenkin kun tulemme pian vaatimaan, että samaa käyttäjätunnusta ei saa tallettaa kantaan kahteen kertaan.

Pienellä vaivalla voimme tehdä automaattisesti suoritettavat testit, jotka helpottavat sovelluksen kehittämistä merkittävästi.

Alustava testi näyttää seuraavalta:

```js
describe.only('when there is initially no users at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ usernname: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/notes succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u=>u.username)
    expect(usernames).toContain(newUser.username)
  })
})
```

Koska testi on määritelty _describe.only_-lohkoksi, suorittaa _jest_ ainoastaan lohkon sisälle määritellyt testit. Tämä on alkuvaiheessa hyödyllistä, sillä ennen kuin uusia käyttäjiä lisäävä toiminnallisuus on valmis, kannattaa suorittaa testeistä ainoastaan kyseistä toiminnallisuutta tutkivat testitapaukset.

Testit käyttävät myös tiedostossa _tests/test_helper.js_ määsiteltyä apufunktiota _usersInDb()_ tarkastamaan lisäysoperaation jälkeisen tietokannan tilan.

Lohkon _beforeAll_ lisää kantaan käyttäjän, jonka username on _root_. Voimmekin tehdä uuden testi, jolla varmistetaan, että samalla käyttäjätunnuksella ei voi luoda uutta käyttäjää:

```js
  test('POST /api/notes fails with proper statuscode and message if username already taken', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'username must be unique'})

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })
```

Testi ei tietenkään mene läpi tässä vaiheessa. Toimimme nyt oleellisesti [TDD:n eli test driven developmentin](https://en.wikipedia.org/wiki/Test-driven_development) hengessä, uuden ominaisuuden testi on kirjoitettu ennen ominaisuuden ohjelmointia.

Koodi laajenee seuraavasti:

```js
usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({username: body.username})
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    //...

  }
})
```

Eli haetaan tietokannasta ne user-dokumentit, joten _username_-kentän arvo on sama kun pyynnössä oleva. Jos sellainen user-dokumentti löytyy, vastaataan pyyntöön statuskoodilla [400 bad request] ja kerrotaan syy ongelmaan.

Voisimme toteuttaa käyttäjien luomisen yhteyteen myös muita tarkistuksia, esim. onko käyttäjätunnus tarpeeksi pitkä, koostuuko se sallituista merkeistä ja onko salasana tarpeeksi hyvä. Jätämme ne kuitenkin harjoitustehtäväksi.

Ennen kuin menemme eteenpäin, lisätään alustava versio joka palauttaa kaikki käyttäjät palauttavasta käsittelijäfunktiosta:

```js
const formatUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    notes: user.notes
  }
}

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(formatUser))
})
```

### Muistiinpanon luominen

Muistiinpanot luovaa koodia on nyt mukautettava siten, että muistiinpanot tulee liitetyksi ne luoneeseen käyttäjään.

Laajennetaan ensin olemassaolevaa toteutusta siten, että tieto muistiinpanon luovan käyttäjän id:stä lähetetään pyynnön rungossa kentän _userId_ arvona:

```js
notesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const userId = body.userId

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const user = await User.findById(userId)

    const note = new Note({
      content: body.content,
      important: body.content === undefined ? false : body.important,
      date: new Date(),
      user: user._id
    })

    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(formatNote(note))
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'something whent wrong...' })
  }
})
```

Huomionarvoista on nyt se, että myös _user_-olio muuttuu, sen kenttään _notes_ talletetaan luodun muistiinpanon _id_:

```js
const user = User.findById(userId)

user.notes = user.notes.concat(savedNote._id)
await user.save()
```

Kokeillaan nyt lisätä uusi muistiinpano

![]({{ "/assets/4/6.png" | absolute_url }})

Operaatio vaikuttaa toimivan. Lisätään vielä yksi muistiinpano ja mennään kaikkien käyttäjien sivulle:

![]({{ "/assets/4/7.png" | absolute_url }})

Huomaamme siis, että käyttäjällä on kaksi muistiinpanoa.

Jos laajennamme muistiinpanojen JSON:in muotoileman koodin näyttämään muistiinpanoon liittyvän käyttäjän

```js
const formatNote = (note) => {
  return {
    id: note._id,
    content: note.content,
    date: note.date,
    important: note.important,
    user: note.user
  }
}
```

On tulee muistiinpanon luoneen käyttäjän id näkyviin muistiinpanon yhteyteen.

![]({{ "/assets/4/8.png" | absolute_url }})

### populate

Haluaisimme API:n toimivan siten, että haettavissa esim. käyttäjien tiedot polulle _/api/users_ tehtävällä HTTP GET -pyynnöllä haluaisimme nähdä käyttäjien tekemien muistiinpanojen id:iden lisäksi niiden sisällön. Relaatiotietokanoilla toiminnallisuus toteutettaisiin liitoskyselyn avulla.

Kuten aiemmin mainittiin, eivät dokumenttitietokannat tue (kunnolla) eri kokoelmien välisiä liitoskyselyitä. Mongoose-kirjasto osaa kuitenkin tehdä liitoksen puolestamme. Mongoose toteuttaa liitoksen tekemällä useampia tietokantakyselyitä, joten siinä mielessä kyseessä on täysin erilainen tapa kuin relaatiotietokantojen liitoskyselyt, jotka ovat _transaktionaalisia_, eli liitoskyselyä tehdessä tietokannan tila ei muutu. Mongoosella tehtävä liitos taas on sellainen, että mikään ei takaa sitä, että liitettävien kokoelmien tila on koko liitoksen ajan konsistentti, ts. jos tehdään users- ja documents-kokoelmat liittävä kysely, kokoelmien tila saattaa muuttua kesken mongoosen liitos-operaation.

Liitoksen tekeminen suoritetaan mongoosen komennolla [populate](http://mongoosejs.com/docs/populate.html). Päivitetään ensin kaikkien käyttäjien tietdot palauttava route:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('notes')

  response.json(users.map(formatUser))
})
```

Funktion [populate](http://mongoosejs.com/docs/populate.html) kutsu siis ketjutetaan kyselyä vastaavan metodikutsun (tässä tapauksessa _find_) perään. Populaten parametri määrittelee, että _user_-dokumenttien _notes_-kentässä olevat _note_-olioihin viittaavat _id_:t korvataan dokumenttejä vastaavilla id:illä.

Lopputulos on jo melkein haluamamme kaltainen:

![]({{ "/assets/4/9.png" | absolute_url }})

Populaten yhteydessä on myös mahdollista rajata mitä kenttiä _embedattavista_ olioista otetaan mukaan. Rajaus tapahtuu mongon [syntaksin](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only) tapaan:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('notes', { content: 1, date: 1 } )

  response.json(users.map(formatUser))
})
```

Määrittelyjen jälkeen tulos on seuraava:

![]({{ "/assets/4/10.png" | absolute_url }})

Lisätään sopiva populointi, myös muistiinpanojen yhteyteen

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 } )

  response.json(notes.map(formatNote))
})
```

Nyt käyttäjän tiedot tulevat muistiinpanon kenttään _user_.

![]({{ "/assets/4/11.png" | absolute_url }})

Korostetaan vielä, että tietokannan tasolla ei siis ole mitään määrittelyä siitä, että esim. muistiinpanojen kenttään _user_ talletetut id:t viittaavat käyttäjä-kokoelman dokumentteihin.

Mongoosen _populate_-funktion toiminnallisuus perustuu siihen, että olemme määritelleet viitteiden "tyypit" olioiden mongoose-skeemaan _ref_-kentän avulla:

```js
const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})
```

## Kirjautuminen

Käyttäjien tulee pystyä kirjautumaan sovellukseemme ja muistiinpanot pitää automaattisesti liittää kirjautuneen käyttäjän tekemiksi. 

Toteutamme nyt backendiin tuen [token-perustaiselle](https://scotch.io/tutorials/the-ins-and-outs-of-token-based-authentication#toc-how-token-based-works)
  autentikoinnille. 

Token-autentikaation periaatetta kuvaa seuraava sekvenssikaatio:

![]({{ "/assets/4/12.png" | absolute_url }})

- Alussa käyttäjä kirjaantuu Reactilla toteutettua lomaketta käyttäen
- Tämän seurauksena selaimen React-koodi lähettää käyttäjätunnuksen ja salasanan HTTP POST -pyynnöllä palveimen osoitteeseen _/api/login_
- Jos käyttäjätunnus ja salasana ovat oikein, generoi palvelin _Tokenin_, jonka jollain tavalla yksilöi kirjautumisen tehneen käyttäjän
  - token on kryptattu, joten sen väärentäminen on (kryptografisesti)mahdotonta 
- backend vastaa selaimelle onnistumisesta kertovalla statuskoodilla ja palauttaa Tokenin pyynnön mukana
- Selain tallentaa tokenin esimerkiksi React-sovelluksen tilaan
- Kun käyttäjä luo uuden muistiinpanon (tai tekee jonkin operaation, joka eellyttää tunnistautumista), lähettää React-koodi Tokenin pyynnön mukana palvelimelle
- Palvelin tunnistaa pyynnön tekijän tokenin perusteella

Tehdään ensin kirjautumistoimito. Asennetaan [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)-kirjasto, jonka avulla koodimme pystyy generoimaan [Javascript web token](https://jwt.io/) -muotoisia tokeneja.

```bash
npm install jsonwebtoken --save
```

Tehdään kirjautumisesta vastaava koodi tiedostoon _controllers/login.js_

```js
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user===null ? false : 
    await bcrypt.compare(body.password, user.passwordHash)

  if ( !(user && passwordCorrect) ) {
    return response.status(401).send({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token })
})
  
module.exports = loginRouter
```

Koodi aloittaa etsimällä pyynnön mukana olevaa _username_:a vastaavan käyttäjän tietokannasta. Seuraavaksi katsotaan onko pyynnön mukana oleva _password_ oikea. Koska tietokantaan ei ole talletettu salasanaa, vaan salasanasta laskettu _hash_, tehdään vertailu metodilla _bcrypt.compare_:

```js
await bcrypt.compare(body.password, user.passwordHash)
```

Jos käyttäjää ei ole olemassa tai salasana on väärä, vastataan kyselyyn statuskoodilla [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) ja kerrotaan syy vastauksen bodyssä.

Jos salasana on oikein, luodaan metodiln _jwt.sign_ avulla token, joka sisältää kryptatussa muodossa käyttäjätunnuksen ja käyttäjän id:

```js
  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
```

Token on digitaalisesti allekirjoitettu käyttämällä _salaisuutena_ ympäristömuuttujassa _SECRET_ olevaa merkkijonoa. Digitaalinen allekirjoitus varmistaa sen, että ainoastaan salaisuuden tuntevilla on mahdollisuus generoida validi token.

Onnistuneeseen pyyntöön vastataan statuskoodilla _200 ok_ ja generoitu token lähetetään vastauksen bodyssä pyynnön tekijälle.

Kirjautumisesta huolehtiva koodi on vielä liitettävä sovellukseen lisäämällä tiedostoon _index.js_ muiden routejen käyttöönoton yhteyteen

```js
const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)
```

### muistiinpanojen luominen vain kirjautuneille

Muutetaan vielä muistiinpanojen luomista, siten että luominen onnistuu ainoastaan jos luomista vastaavan pyynnön mukana on validi token. Muistiinpano talletetaan tokenin identifioiman käyttäjän tekemien muistiinpanojen listaan.

Tapoja tokenin välittämiseen selaimesta backendiin on useita. Käytämme ratkaisussamme [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)-headeria. Tokenin lisäksi headerin avulla kerrotaan mistä [autentikointiskeemasta](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) on kyse. Tämä voi olla tarpeen, jos palvein tarjoaa useita eri tapoja autentikointiin. Skeeman ilmaiseminen kertoo näissä tapauksissa palvelimelle, miten mukana olevat kredentiaalit tulee tulkita.
Meidän käyttöömme sopii _Bearer_-skeema. 

Käytännössä tämä tarkoittaa, että jos token one sim merkkijono _eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW_, laitetaan pyynnöissä headerin Authorization arvoksi merkkijono
<pre>
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</pre>

Modifioitu muisiinpanojen luomisesta  huolehtiva koodi seuraavassa:

```js
const getTokenFrom = (request) =>{
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id ) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const user = await User.findById(decodedToken.id)

    const note = new Note({
      content: body.content,
      important: body.content === undefined ? false : body.important,
      date: new Date(),
      user: user._id 
    })

    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(formatNote(note))
  } catch(exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something whent wrong...' })
    }
  }
})
```

Apufunktio _getTokenFrom_ eristää tokenin headerista _authorization_. Tokenin oikeellisuus varmistetaan metodilla _jwt.verify_. Metodi myös dekoodaa tokenin, eli palauttaa olion, jonka  perusteella token on laadittu. Tokenista dekoodatun olion sisällä on kentät _username_ ja _id_ eli se kertoo palvelimelle kuka pynnön on tehnyt. Kun pyynnön tekijän identiteetti on selvillä, jatkuu suoritus entiseen tapaan.

Jos tokenia ei ole tai tokenista dekoodattu olio ei sisällä käyttäjän identitettiä, palautetaan virheenstä kertova statuskoodi [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) ja kerrotaan syy vastauksen bodyssä.

Tokenin verifiointi voi myös aiheuttaa poikkeuksen _JsonWebTokenError_. Syynä tälle voi olla viallinen, väärennetty tai eliniältään vanhentunut token. Poikkeus poikkeusten käsittelyssä haaraudutaan virheen tyypin perusteella ja vastataan 401 jos poikkeus johtuu tokenista, ja muuten vastataan [500 internal server error](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.1).

### loppuhuomioita

Koodissa on tapahtunut paljon muutoksia ja matkan varrella on tapahtunut tyypillinen kiivaasti etenevät ohjelmistoprojektin ilmiö: suuri osa testeistä on hajonnut. Koska kurssin tämä osa on jo muutenkin täyteen ladattu uutta asiaa, jätämme testien korjailun harjoitustehtäväksi.

Käyttäjätunnuksia, salasanoja ja tokenautentikaatiota hyädyntäviä sovelluksia tulee aina käyttää salatun [HTTPS](https://en.wikipedia.org/wiki/HTTPS)-yhteyden yli. Voimme käyttää sovelluksissamme Noden [HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html)-serverin sijaan [HTTPS](https://nodejs.org/api/https.html)-serveriä. Toisaalta koska sovelluksemme tuotantoversio on Herokussa, sovelluksemme pysyy käyttäjien kannalta turvallisena sen ansiosta, että Heroku reitittää kaiken liikenteen selaimen ja Herokun palvelimien välillä HTTPS:n yli.

Toteutamme kirjautumisen fronendin puolelle kurssin [seuraavassa osassa](osa5)

## Lint

Ennen osan lopetusta katsomme vielä nopeasti paitsioon jäänyttä tärkeää työkalua [lintiä](https://en.wikipedia.org/wiki/Lint_(software)). Wikipedian sanoin 

> Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.

Staattisesti tyypitetyissä kielissä kuten Javassa ohjelmointiympäristöt, kuten NetBeans osaavat huomautella monista koodiin liittyvistä asioista, sellasisistakin, jotka eivät ole välttämättä käännösvirheitä. Erilaisten [staattisen analyysin](https://en.wikipedia.org/wiki/Static_program_analysis) lisätyökalujen, kuten [checkstylen](http://checkstyle.sourceforge.net/) avulla voidaan vielä laajentaa huomautettavien asioiden määrää koskemaan koodin tyylillisiä seikkoja, esim. sisentämistä.

Javascript-maailmassa tämän hetken johtava työkalu staattiseen analyysiin, eli "linntaukseen" on [ESlint](https://eslint.org/).

Asennetaan Eslint kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install eslint --save-dev
```

Tämän jälkeen voidaan muodostaa alustava ESlint-konfiguraatio komennolla

```bash
node_modules/.bin/eslint --init
```

Vastaillaan kysymyksiin

![]({{ "/assets/3/15.png" | absolute_url }})

Konfiguraatiot tallentuvat tiedostoon _.eslintrc.js_:

```json
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
```

Esim tiedoston _index.js_ tarkastus tapahtuu komennolla

```bash
node_modules/.bin/eslint index.js
```

Kannattaa ehkä tehdä linttaustakin varten _npm-skrpiti_:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js",
    "watch": "node_modules/.bin/nodemon index.js",
    "test": "NODE_ENV=test node_modules/.bin/jest --verbose test",
    "lint": "node_modules/.bin/eslint ."
  },
  // ...
}
```

Nyt komenot _npm run lint_ suorittaa tarkastukset koko projektille.

Paras vaihtoehto on kuitenkin konfiguroida editorille lint-plugin joka suorittaa linttausta koko ajan. Näin pääset korjaamaan pienet virheet välittömästi. Tietoja esim. Visual Studion ESlint-pluginsta [täällä](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).


Valmiit konfit mm airbnb ks
https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb

https://github.com/airbnb/javascript


<!---
note left of kayttaja
  käyttäjä täyttää kirjautumislomakkeelle
  käyttäjätunnuksen ja salasanan
end note
kayttaja -> selain: painetaan login-nappia

selain -> backend: HTTP POST /api/login {username, password}
note left of backend
  backend generoi käyttäjän identifioivan TOKE:in 
end note
backend -> selain: TOKEN palautetaan vastauksen bodyssä
note left of selain
  selain tallettaa TOKENin
end note
note left of kayttaja
  käyttäjä luo uden muistiinpanon
end note
kayttaja -> selain: painetaan create note -nappia 
selain -> backend: HTTP POST /api/notes {content} headereissa TOKEN
note left of backend
  backend tunnistaa TOKENin perusteella kuka käyttää kyseessä
end note

backend -> selain: 201 created

kayttaja -> kayttaja: 
-->