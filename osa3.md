---
layout: page
title: osa 3
permalink: /osa3/
---

<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>
</div>

## osan 2 oppimistavoitteet

- Web-sovellusten toiminnan perusteet
  - RESTful routing
- node.js
  - ...
- Javascript
  - aync/await
- muu
  - npm  

## Node.js

Siirrämme tässä osassa fokuksen backendiin, eli palvelimella olevaan toiminnallisuuteen. 

Backendin toiminnallisuuteen hyödynnämme [Node.js](https://nodejs.org/en/):ää, jokaon melkein missä vaan, erityisesti palvelimilla ja omallakin koneellasi toimiva, Googlen [chrome V8](https://developers.google.com/v8/)-javascriptmoottoriin perustuva javascriptsuoritusympäristö. 

Kurssimateriaalia tehdessä on ollut käytössä Node.js:n versio _v8.6.0_. Huolehdi että omasi on vähintää yhtä tuore (ks. komentoriviltä _node -v_). 

Kuten [osassa 1](osa1#Javascriptiä) todettiin, selaimet eivät vielä osaa uusimpia javasriptin ominaisuuksia ja siksi selainpuolen koodi täytyy kääntää eli _transpiloida_ esim  [babel](https://babeljs.io/):illa. Backendissa tilanne on kuitenkin toinen, uusin node hallitsee riittävissä määrin myös javascriptin uusia versioita (muutamia vielä standardoimattomia ominaisuuksia lukuunottamatta), joten suoritamme nodella suoraan kirjoittamaamme koodia ilman transpilointivaihetta.

Tavoitteenamme on tehdä nodella [osan 2](/osa2) muistiinpano-sovellukseen sopiva backend. Aloitetaan kuitenkin ensin perusteiden läpikäyminen toteuttamalla perinteinen "hello world"-sovellus.

Osassa 2 oli jo puhe [npm](osa2#npm):stä, eli javascript-projektien hallintaan liittyvästä, alunperin node-ekosysteeminstä kotoisin olevasta työkalusta. Mennään sopivaan hakemistoon ja luodaan projektimme runko komennolla _npm init_. Vastaillaan kysymyksiin sopivasti ja tuloksena on hakemiston juureen sijoitettu projektin tietoja kuvaava tiedosto _package.json_

```js
{
  "name": "muistiinpanot-backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```

Tiedosto määrittelee mm. että ohjelmamme käynnistyspiste on tiedosto _index.js_. 

Tehdään avaimen _scripts_ alle pieni lisäys:

```js
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

Luodaan sitten sovelluksen ensimmäinen versio, eli projektin juureen sijoitettava tiedosto _index.js_ ja sille seuraava sisältä:

```js
console.log('hello word')
```

Voimme suorittaa ohjelman joko "suoraan" nodella, komentorivillä

```bash
node index.js
```

tai [npm scriptinä](https://docs.npmjs.com/misc/scripts)

```bash
npm start
```

npm-scripti _start_ toimii koska määrittelimme sen tiedostoon _package.json_

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

Vaikka esim. projektin suorittaminen onnistuukin suoraan käyttämällä komentoa _node_, on npm-projekteille suoritettavat operaatiot yleensä tapana määritellä nimenomaan npm-scripteinä. Oletusarvoinen _package.json_ määrittelee valmiiksi myös toisen yleisesti käytetyn npm-scriptin eli _npm test_. Koska projektissamme ei ole vielä testikirjastoa, ei _npm test_ kuitenkaan tee vielä muuta kun suorittaa komennon

```bash
echo "Error: no test specified" && exit 1
```

Muutetaan sovellus web-palvelimeksi:

```js
const http = require('http')

const app = http.createServer( (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World')
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
```

Konsoliin tulostuu 

```bash
Server running on port 3001
```

Ja voimme avata selaimella osoitteeseen <http://localhost:3001> olevan vaatimattoman sovelluksemme:

![]({{ "/assets/3/1.png" | absolute_url }})

Palvelin toimii itseasiassa täsmälleen samalla tavalla riippumatta urlin loppuosasta, eli myös sivun <http://localhost:3001/foo/bar> sisältö on sama.

Tarkastallaan koodia hiukan. Ensimmäinen rivi

```js
const http = require('http')
```

ottaa käyttöön noden sisäänrakennetun [web-palvelimen](https://nodejs.org/docs/latest-v8.x/api/http.html) määrittelevän moduulin. Kyse on käytännössä samasta asiasta, mihin olemme selainpuolen koodissa tottuneet hieman syntaksiltaan erilaisessa muodossa:

```js
import http from 'http'
```

Selaimen puolella käytetään (nykyään) ES6:n moduuleita, eli moduulit määritellään [exportilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) ja otetaan käyttöön [importilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

Node.js kuitenkin käyttää oletusarvoisesti ns. [CommonJS](https://en.wikipedia.org/wiki/CommonJS)-moduuleja. Syy tälle on siinä, että node-ekosysteemillä oli tarve moduuleihin jo pitkä aika ennen kuin Javascript tuki kielen tasolla moduuleja. Node ei toistaiseksi tue ES-moduuleja, mutta tuki on todennäköisesti jossain vaiheessa [tulossa](https://nodejs.org/api/esm.html).

CommonJS-moduulit toimivat kohtuullisessa määrin samaan tapaan kuin ES6-moduulit, ainakin tämän kurssin tarpeiden puitteissa. 

Koodi jatkuu seuraavasti:

```js
const app = http.createServer( (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World')
})
```

koodi luo [http](https://nodejs.org/docs/latest-v8.x/api/http.html)-palvelimen metodilla _createServer_ web-palvelimen, jolle se rekisteröi tapahtumankäsittelijän, joka suoritetaan _jokaisen_ osoitteen <http:/localhost:3000/> alle tulevan HTTP-pyynnön yhteydessä.

Pyyntään vastataan statuskoodilla 200, asettamalla _Content-Type_-headerille arvo ja laittamalla sivun sisällöksi merkkijono _Hello World_.

Viimeiset rivit sitovat muuttujaan _app_ sijoitetun http-palvelimen kuuntelemaan porttiin 3001 tulevia HTTP-pyyntöjä: 

```js
const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
```

Koska tällä kurssilla palvelimen rooli on pääasiassa tarjota frondille JSON-muotoista "raakadataa", muutetaan heti palvelinta siten, että se palauttaa kovakoodatun JSON-muotoisia muistiinpanoja:

```js
const notes = [
  {
    id: 1,
    content: 'HTML on helppoa',
    date: '2017-12-10T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Selain pystyy suorittamaan vain javascriptiä',
    date: '2017-12-10T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: '2017-12-10T19:20:14.298Z',
    important: true
  }
]

const app = http.createServer( (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
```

Headerin _'Content-Type'_ kerrotaan että kyse on JSON-muotoisesta datasta. Taulukko muutetaan jsoniksi metodilla <code>JSON.stringify(notes)</code>.


Kun avaamme selaimen, on tulostusasu sama kuin [osassa 3](osa2/#datan-haku-palvelimelta) käytetyn [json-serverin](https://github.com/typicode/json-server) käytettäessä:

![]({{ "/assets/3/2.png" | absolute_url }})

Voimme jo melkein ruveta käyttämään uutta backendiämme osan 2 muistiinpano-fronendin kanssa. Mutta vasta melkein, jos käynnistämme fronendin, tulee konsoliin virheilmoitus

![]({{ "/assets/3/3.png" | absolute_url }})

Syy virheelle selviää pian, parantelemme kuitenkin ensin koodia muista osin.

## express

Palvelimen koodin tekeminen suoraan noden sisäänrakennetun web-palvelimen [http](https://nodejs.org/docs/latest-v8.x/api/http.html):n päälle on mahdollista, mutta hieman työlästä. 

Nodella tapahtuvaa web-sovellusten ohjelmointia helpottamaan onkin kehitelty useita  _http_:tä miellyttävämmän ohjelmoitirajapinnan tarjoamia kirjastoja. Näistä ehdoton [express](http://expressjs.com).

Otetaan express käyttöön määrittelemällä se projektimme riippuvuudeksi komennolla 

```bash
npm install express --save 
```

Riippuvuus tulee nyt määritellyksi tiedostoon _package.json_:

```json
{
  // ...
  "dependencies": {
    "express": "^4.16.2"
  }
}
```

Riippuvuuen koodi asentuu kaikkien projektin riippuvuuksien tapaan projektin juuressa olevaan hakemistoon _node_modules_. Hakemistosta löytyy expressin lisäksi suuri määrä muutakin

<img src="/assets/3/4.png" height="200">

Kyseessä ovat expressin riippuvuudet ja niiden riippuvuudet ym... eli projektimme [transittiiviset riippuvuudet](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/).

Projektiin asentui expressin versio 4.16.2. Mitä tarkoittaa _package.json:issa_ versiomerkinnän edessä oleva väkänen, eli miksi muoto on

```json
  "express": "^4.16.2"
```

npm:n yhteydessä käytetään ns. [semanttista versiointia](https://docs.npmjs.com/getting-started/semantic-versioning). 

Merkintä _^4.16.2_ tarkoittaa, että jos/kun projektin riippuvuudet päivitetään, asennetaan expressistä versio, joka on vähintään _4.16.2_, mutta asennetuksi voi tulla versio, jonka _patch_ eli viimeinen numero tai _minor_ voi olla suurempi. Pääversio eli _major_ täytyy kuitenkin olla edelleen sama.

Voimme päivittää projektin riippuvuudet komennolla

```bash
  npm update
```

Vastaavasti jos aloitamme projektin koodaamisen toisella koneella, saamme haettua ajantasaiset, _package.json_:in määrittelyn mukaiset riippuvuudet haettua komennolla

```bash
  npm install
```

Palataan taas sovelluksen ääreen ja muutetaan se muotoon:

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send("Hello World!")
})

app.get('/notes', (req, res) => {
  res.json(notes)
})

const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

Sovellus ei muutu paljoa. Heti alussa otetaan käyttöön _express_ joka on tällä kertaa _funktio_, jota kutsumalla luodaan express-sovellusta vastaava olio:

```js
const express = require('express')
const app = express()
```

Seuraavaksi määritellään sovellukselle kaksi _routea_. Näistä ensimmäinen näistä määrittelee tapahtumankäsittelijän joka hoitaa sovelluksen juureen eli polkuun _/_ tulevia HTTP GET -pyyntöjä:

```js
app.get('/', (request, response) => {
  response.send("Hello World!")
})
```

Tapahtumankäsittelijäfunktiolla on kaksi parametria, [request](http://expressjs.com/en/4x/api.html#req) joka sisältää kaikki HTTP-pyynnön tiedot ja [response](http://expressjs.com/en/4x/api.html#res) jonka avulla määritellään, miten pyyntöön vastataan.

Pyyntöön vastataan käyttäen _request_-olion metodia [send](http://expressjs.com/en/4x/api.html#res.send), joka aiheuttaa sen, että parametrina palvelin vastaa HTTP-pyyntöön lähettämällä vastaukseksi parametrina olevan merkkijonon. Koska parametri on merkkijono, metodi asettaa vastauksen _content-type_-headerille arvoksi _text/html_, statuskoodiksi tulee oletusarvoisesti 200.

Routeista toinen määrittelee tapahtumankäsittelijän joka hoitaa sovelluksen polkuun _notes_ tulevia HTTP GET -pyyntöjä:

```js
app.get('/notes', (request, response) => {
  response.json(notes)
})
```

Pyyntöön vastataan metodilla [json](http://expressjs.com/en/4x/api.html#res.json), joka lähettää HTTP-pyynnön vastaukseksi parametrina olevaa javascript-olioa (eli taulukko _notes_) vastaavan JSON-merkkijonon. Content-type-headerin arvoksi tulee _application/json_. 

Pieni huomio JSON-muodossa palautettavasta datasta.

Aiemmassa, pelkkää nodea käyttämässämme versiossa, jouduimme muuttamaan palautettavan datan json-muotoon metodilla _JSON.stringify_:

```js
  response.end(JSON.stringify(notes))
```

Expressiä käyttässä tämä ei ole tarpeen, sillä muunnos tapahtuu automaattisesti.

Kannattaa huomata, että [JSON](https://en.wikipedia.org/wiki/JSON) on merkkijono, eikä javascript-olio kuten muuttuja _notes_. 

Seuraava interaktiivsessa [node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html):issä suoritettu kokeilu havainnollistaa asiaa:

<img src="/assets/3/5.png" height="200">

Saat käynnistettyä interaktiivisen node-repl:in kirjoittamalla komentoriville _node_. Esim. joidenkin komentojen toimivuuttaa on koodatessa kätevä tarkastaa konsolissa, suosittelen!

## nodemon

Jos muutamme sovelluksen koodia, joudumme sammuttamaan (konsolista ctrl+c) uudelleenkäynnistämään sen, jotta muutokset tulevat voimaan. Verrattuna Reactin mukavaan workflowhun missä selain päivittyi automaattisesti koodin muuttuessa tuntuu uudelleenkäynnistely kömpelöltä.

Onneksi ongelmaan löytyy ratkaisu [nodemon](https://github.com/remy/nodemon):

> nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

Asennetaan nodemon määrittelemällä se _kehitysaikaiseksi riippuvuudeksi_ (development dependency) komennolla:

```bash
npm install --save-dev nodemon
```

Tiedoston _package.json_ sisältö muuttuu seuraavasti:

```json
{ 
  //...
  "dependencies": {
    "express": "^4.16.2"
  },
  "devDependencies": {
    "nodemon": "^1.13.3"
  }
}
```

Kehitysaikaisilla riippuvuuksilla tarkoitetaan työkaluja, joita tarvitaan ainoastan sovellusta kehitettäessä, esim. testaukseen tai sovelluksen automaattiseen uudelleenkäynnistykseen _nodemon_.

Kun sovellusta suoritetaan tuotantomoodissa, eli samoin kun sitä tullaan suorittamaan tuotantopalvelimella (esim. Herokussa, mihin tulemme kohta siirtämään sovelluksemme), ei kehitysaikaisia riippuvuuksia tarvita.

Voimme nyt käynnistää ohjelman _nodemon_:illa seuraavasti:

```bash
node_modules/.bin/nodemon index.js
```

Sovelluksen koodin muutokset aiheuttavat nyt automaattisen palvelimen uudelleenkäynnistyksen. Kannattaa huomata, että vaikka palvelin käynnistyy automaattisesti, selain täytyy kuitenin refreshata, sillä toisin kuin Reactin yhteydessä, meillä ei nyt ole eikä tässä skenaariossa (missä palautamme JSON-muotoista dataa) edes voisi kaan olla selainta päivittävää [hot reload](https://gaearon.github.io/react-hot-loader/getstarted/) -toiminnallisuutta.

Komento on ikävä, joten määritellään sitä varten _npm-skripti_ tiedostoon _package.json_:

```json
{
  // ..
  "scripts": {
    "start": "node index.js",
    "watch": "node_modules/.bin/nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

Voimme nyt käynnistää palvelimen sovelluskehitysmoodissa komennolla

```bash
npm run watch
```

Toisin kuin skriptejä _start_ tai _test_ suoritettaessa, joudumme sanomaan myös _run_.

## lisää routeja

Laajennetaan sovellusta siten, että se toteuttaa samanlaisen [RESTful]()-periaatteeseen nojaavan HTTP-rajapinnan kun [json-server](https://github.com/typicode/json-server#routes)

### REST

Representational State Transfer eli REST on Roy Fieldingin vuonna 2000 ilmestyneessä [väitöskirjassa](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) määritelty skaalautuvien web-sovellusten rakentamiseksi tarkoitettu arkkitehtuurityyli. 

Emme nyt rupea määrittelemään REST:iä Fieldingiläisittäin tai rupea väittämään mitä REST on tai mitä se ei ole vaan otamme hieman [kapeamman näkökulman](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_Web_services) miten REST tai RESTful API:t yleensä tulkitaan Web-sovelluksissa. Alkuperäinen REST-periaate ei edes rajoitu sinänsä Web-sovelluksiin.

Mainitsimme jo [edellisestä osassa](osa3/#REST-API:n-käyttö), että yksttäisiä asioita, meidän tapauksessamme muistiinpanoja kutsutaan RESTful-ajattelussa _resursseiksi_. Jokaisella resurssilla on sen yksilöivä osoite. 

Erittäin yleinen konventio on muodostaa resurssien yksilöivät urlit liittäen resurssityypin nimi ja resurssin yksilöivä tunniste. 

Oletetaan että palvelumme juuriosoite on _www.example.com/api_

Jos nimitämme muistiinpanoja _note_-resursseiksi, yksilöidään yksittäinen muistiinpano, jonka tunniste on 10 urlilla _www.example.com/api/notes/10_. 

Kaikkia muistiinpanoja edustavan kokoelmaresurssin url taas on _www.example.com/api/notes_

Resursseille voi suorittaa erilaisia operaatiota. Suoritettavan operaation määrittelee HTTP-operaation tyyppi jota kutsutaan usein myös _verbiksi_:

| URL | verbi           |  toiminnallisuus |
|------- | --- | --- |
| notes/10 &nbsp;&nbsp;  | GET | hakee yksittäisen resurssin |
| notes    | GET         | hakee kokoelman kaikki resurssit |
| notes    | POST        | luo uuden resurssin pyynnön mukana olevasta datasta |
| notes/10 | DELETE &nbsp;&nbsp;    | poistaa yksilöidyn resurssin |
| notes/10 | PUT         | korvaa yksilöidyn resurssin pyynnön mukana olevalla datalla |
| notes/10 | PATCH       | korvaa yksilöidyn resurssin osan pyynnön mukana olevalla datalla |
|          |  |  | 

Näin määrittyy suurin piirtein asia, mitä REST kutsuu nimellä [uniform interface](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints), eli jossian määrin yhtenäinen tapa määritellä rajapintoja, jotka mahdollistavat (tietyin tarkennuksin) järjestelmien yhteiskäytön.

Tämänkaltaista tapaa tulkita REST:iä on nimitetty kolmiportaisella asteikolla [kypsyystason 2] (https://martinfowler.com/articles/richardsonMaturityModel.html) REST:iksi. Restin kehittäjän Roy Fieldingin mukaan tällöin kyseessä ei vielä ole ollenkaan asia, jota tulisi kutsua [REST-apiksi](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven). Maailman "REST"-apeista valta osa ei täytäkään puhdasverisen Fieldingiläisen apin määritelmää. 

Jotkut asiantuntijat (**VIITE**) nimittävätkin edellä esitellyn kaltaista suoraviivaisehkoa resurssien [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)-tyylisen manipuloinnin mahdollistavaa API:a REST:in sijaan resurssipohjaiseksi apiksi.

### lisää routeja: yksittäisen resurssin haku

Laajennetan nyt sovellusta siten, että se tarjoaa muistiinpanojen operointiin REST-rajapinnan. Tehdään ensi route yksittäisen resurssin katsomista varten.

Yksittäisen muistiinpanon identifioi url, joka on muotoa _notes/10_, missä lopussa oleva numero vastaa resurssin muistiinpanon id:tä.

Voimme määritellä expressin routejen poluille [parametreja](http://expressjs.com/en/guide/routing.html) käyttämällä kaksoispistesyntaksia:

```js
app.get('/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id )
  response.json(note)
})
```

Nyt _app.get('/notes/:id', ...)_ käsittelee kaikki HTTP GET -pyynnötä, jotka ovat muotoa _note/<jotain>_, missä _<jotain>_ on mielivaltainen merkkijono.  

Polun parametrin _id_ arvoon päästään käsisiksi olion _request_ kautta:

```js
const id = request.params.id
```

Jo tutuksi tulleella taulukon _find_-metodilla haetaan taulukosta parametria vastaava muistiinpano ja palautetaan se pyynnön tekijälle.

Kun nyt sovellusta testataa selaimella menemällä osoitteeseen <http://localhost:3001/notes/1>, havaitaan että se ei toimi. Tämä on tietenkin softadevaajan arkipäivää, ja on ruvettava debuggaamaan. Vanha keino on alkaa lisäillä koodiin _console.log_-komentoja:

```js
app.get('/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.lod(note)
  response.json(note)
})
```

Konsoliin tulostuu

<pre>
1
undefined
</pre>

eli halutun muistiinpanon id välittyy sovellukseen aivan oikein, mutta _find_ komento ei löydä mitään.

Päätetään tulostella konsoliin myös _find_-komennon sisällä olevasta vertailijafunktiosta, joka onnistuu helposti kun tiiviissä muodossa oleva funktio <code>note => note.id === id)</code> kirjoitetaan eksplisiittisen returnin sisältävässä muodossa:

```js
app.get('/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
```

Jokaisesta vertailufunktion kutsusta tulostetaan nyt monta asiaa. Konsoliin tulostus on seuraava:

<pre>
1 'number' '1' 'string' false
2 'number' '1' 'string' false
3 'number' '1' 'string' false
</pre>

eli vika selviää, muuttujassa _id_ on talletettu merkkijono '1' kun taas muistiinpanojen id:t ovat numeroita. Javascriptissä === vertailu katsoo kaikki eri tyyppiset arvot oletusarvoisesti erisuuriksi, joten 1 ei ole '1'. 

Korjataan ongelma, muuttamalla parametrina oleva id numeroksi:

```js
app.get('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id
  )
  response.json(note)
}) 
```

ja nyt yksittäisen resurssin hakeminen toimii

<img src="/assets/3/5.png" height="200">

toiminnallisuuteen jää kuitenkin pari ongelmaa.

väärä indeksi

nollaindeksi

### delli yms


npm install body-parser --save


## postman

## middlewaret

- konsepti
- oma: logger
- static
- cors

## frontti

## heroku

## debug

## mongo

## async/await

## mongoose



## testaus

- ava/supertest







