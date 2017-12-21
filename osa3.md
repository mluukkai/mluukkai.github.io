---
layout: page
title: osa 3
permalink: /osa3/
---

<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>
</div>

## Osan 3 oppimistavoitteet

- Web-sovellusten toiminnan perusteet
  - RESTful routing
- node.js
  - ...
- Javascript
  - async/await
- muu
  - npm

## Node.js

Siirrämme tässä osassa fokuksen backendiin, eli palvelimella olevaan toiminnallisuuteen.

Backendin toiminnallisuuteen hyödynnämme [Node.js](https://nodejs.org/en/):ää, joka on melkein missä vaan, erityisesti palvelimilla ja omallakin koneellasi toimiva, Googlen [chrome V8](https://developers.google.com/v8/)-javascriptmoottoriin perustuva javascriptsuoritusympäristö.

Kurssimateriaalia tehdessä on ollut käytössä Node.js:n versio _v8.6.0_. Huolehdi että omasi on vähintää yhtä tuore (ks. komentoriviltä _node -v_).

Kuten [osassa 1](osa1#Javascriptiä) todettiin, selaimet eivät vielä osaa uusimpia javascriptin ominaisuuksia ja siksi selainpuolen koodi täytyy kääntää eli _transpiloida_ esim [babel](https://babeljs.io/):illa. Backendissa tilanne on kuitenkin toinen, uusin node hallitsee riittävissä määrin myös javascriptin uusia versioita (muutamia vielä standardoimattomia ominaisuuksia lukuunottamatta), joten suoritamme nodella suoraan kirjoittamaamme koodia ilman transpilointivaihetta.

Tavoitteenamme on tehdä nodella [osan 2](/osa2) muistiinpano-sovellukseen sopiva backend. Aloitetaan kuitenkin ensin perusteiden läpikäyminen toteuttamalla perinteinen "hello world"-sovellus.

Osassa 2 oli jo puhe [npm](osa2#npm):stä, eli javascript-projektien hallintaan liittyvästä, alunperin node-ekosysteeminstä kotoisin olevasta työkalusta. Mennään sopivaan hakemistoon ja luodaan projektimme runko komennolla _npm init_. Vastaillaan kysymyksiin sopivasti ja tuloksena on hakemiston juureen sijoitettu projektin tietoja kuvaava tiedosto _package.json_

```json
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

Pyyntöön vastataan statuskoodilla 200, asettamalla _Content-Type_-headerille arvo ja laittamalla sivun sisällöksi merkkijono _Hello World_.

Viimeiset rivit sitovat muuttujaan _app_ sijoitetun http-palvelimen kuuntelemaan porttiin 3001 tulevia HTTP-pyyntöjä:

```js
const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
```

Koska tällä kurssilla palvelimen rooli on pääasiassa tarjota frondille JSON-muotoista "raakadataa", muutetaan heti palvelinta siten, että se palauttaa kovakoodatun JSON-muotoisia muistiinpanoja:

```js
let notes = [
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

Voimme jo melkein ruveta käyttämään uutta backendiämme osan 2 muistiinpano-frontendin kanssa. Mutta vasta melkein, jos käynnistämme frontendin, tulee konsoliin virheilmoitus

![]({{ "/assets/3/3.png" | absolute_url }})

Syy virheelle selviää pian, parantelemme kuitenkin ensin koodia muista osin.

## Express

Palvelimen koodin tekeminen suoraan noden sisäänrakennetun web-palvelimen [http](https://nodejs.org/docs/latest-v8.x/api/http.html):n päälle on mahdollista, mutta hieman työlästä.

Nodella tapahtuvaa web-sovellusten ohjelmointia helpottamaan onkin kehitelty useita _http_:tä miellyttävämmän ohjelmoitirajapinnan tarjoamia kirjastoja. Näistä ehdoton [express](http://expressjs.com).

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

Riippuvuuden koodi asentuu kaikkien projektin riippuvuuksien tapaan projektin juuressa olevaan hakemistoon _node_modules_. Hakemistosta löytyy expressin lisäksi suuri määrä muutakin

<img src="/assets/3/4.png" height="200">

Kyseessä ovat expressin riippuvuudet ja niiden riippuvuudet ym... eli projektimme [transitiiviset riippuvuudet](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/).

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
  res.send('Hello World!')
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
  response.send('Hello World!')
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

Seuraava interaktiivisessa [node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html):issä suoritettu kokeilu havainnollistaa asiaa:

<img src="/assets/3/5.png" height="200">

Saat käynnistettyä interaktiivisen node-repl:in kirjoittamalla komentoriville _node_. Esim. joidenkin komentojen toimivuuttaa on koodatessa kätevä tarkastaa konsolissa, suosittelen!

## nodemon

Jos muutamme sovelluksen koodia, joudumme sammuttamaan (konsolista ctrl+c) uudelleenkäynnistääksemme sen, jotta muutokset tulevat voimaan. Verrattuna Reactin mukavaan workflowhun missä selain päivittyi automaattisesti koodin muuttuessa tuntuu uudelleenkäynnistely kömpelöltä.

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

Sovelluksen koodin muutokset aiheuttavat nyt automaattisen palvelimen uudelleenkäynnistyksen. Kannattaa huomata, että vaikka palvelin käynnistyy automaattisesti, selain täytyy kuitenkin refreshata, sillä toisin kuin Reactin yhteydessä, meillä ei nyt ole eikä tässä skenaariossa (missä palautamme JSON-muotoista dataa) edes voisikaan olla selainta päivittävää [hot reload](https://gaearon.github.io/react-hot-loader/getstarted/) -toiminnallisuutta.

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

## Lisää routeja

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


Tämänkaltaista tapaa tulkita REST:iä on nimitetty kolmiportaisella asteikolla [kypsyystason 2](https://martinfowler.com/articles/richardsonMaturityModel.html) REST:iksi.  Restin kehittäjän Roy Fieldingin mukaan tällöin kyseessä ei vielä ole ollenkaan asia, jota tulisi kutsua [REST-apiksi](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven). Maailman "REST"-apeista valtaosa ei täytäkään puhdasverisen Fieldingiläisen apin määritelmää.

Jotkut yhteyksissä (ks. esim [Richardsom, Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) edellä esitellyn kaltaista suoraviivaisehkoa resurssien [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)-tyylisen manipuloinnin mahdollistavaa API:a nimitetään REST:in sijaan [resurssipohjaiseksi](https://en.wikipedia.org/wiki/Resource-oriented_architecture) arkkitehtuurityyliksi.

### Yksittäisen resurssin haku

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

Nyt _app.get('/notes/:id', ...)_ käsittelee kaikki HTTP GET -pyynnöt, jotka ovat muotoa _note/<jotain>_, missä _<jotain>_ on mielivaltainen merkkijono.


Polun parametrin _id_ arvoon päästään käsiksi olion _request_ kautta:

```js
const id = request.params.id
```

Jo tutuksi tulleella taulukon _find_-metodilla haetaan taulukosta parametria vastaava muistiinpano ja palautetaan se pyynnön tekijälle.

Kun nyt sovellusta testataan selaimella menemällä osoitteeseen <http://localhost:3001/notes/1>, havaitaan että se ei toimi. Tämä on tietenkin softadevaajan arkipäivää, ja on ruvettava debuggaamaan. Vanha keino on alkaa lisäillä koodiin _console.log_-komentoja:

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

Päätetään tulostella konsoliin myös _find_-komennon sisällä olevasta vertailijafunktiosta, joka onnistuu helposti kun tiiviissä muodossa oleva funktio <code>note => note.id === id</code> kirjoitetaan eksplisiittisen returnin sisältävässä muodossa:

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
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

ja nyt yksittäisen resurssin hakeminen toimii

<img src="/assets/3/6.png" height="200">

toiminnallisuuteen jää kuitenkin pieni ongelma.

Jos haemme muistiinpanoa sellaisella indeksillä, mitä vastaavaa muistiinpanoa ei ole olemassa, vastaa palvelin seuraavasti

<img src="/assets/3/7.png" height="200">

HTTP-statuskoodi on onnistumisesta kertova 200. Vastaukseen ei liity dataa, sillä headerin _content-length_ arvo on 0, ja samaa todistaa selain: mitään ei näy.

Syynä tälle käyttäytymiselle on se, että muuttujan _note_ arvoksi tulee _undefined_ jos muistiinpanoa ei löydy. Tilanne tulisi käsitellä palvelimella järkevämmin, eli statuskoodin 200 sijaan tulee vastata [statuskoodilla](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) _404 not found_. Tehdään muutos

```js
app.get('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if ( note ) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

Koska vastaukseen ei nyt liity mitään dataa käytetään statuskoodin asettavan metodin [status](http://expressjs.com/en/4x/api.html#res.status) lisäksi metodia [end](http://expressjs.com/en/4x/api.html#res.end) ilmoittamaan siitä, että pyyntöön voidaan vastata ilman dataa.

Koodin haaratumisessa hyväksikäytetään sitä, että mikä tahansa Javascript-olio on [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), eli katsotaan todeksi vertailuoperaatiossa. undefined taas on [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) eli epätosi.

Nyt sovellus toimii, eli palauttaa oikean virhekoodin. Sovellus ei kuitenkaan palauta mitään käyttäjälle näytettävää kuten web-sovellukset yleensä tekevät jos mennään osoitteeseen jota ei ole olemassa. Emme kuitenkaan tarvitse nyt mitään näytettävää, sillä REST API:t ovat ohjelmalliseen käyttöön tarkoitettuja rajapintoja ja pyyntöön liitetty virheestä kertova statuskoodi on riittävä.

### Resurssin poisto

Toteutetaan seuraavaksi resurssin poistava route. Poisto tapahtuu tekemällä HTTP DELETE -pyyntö resurssin urliin:


```js
app.delete('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

Jos poisto onnistuu, eli poistettava muistiinpano on olemassa, vastataan statuskoodilla [204 no content](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5) sillä mukaan ei lähetetä mitään dataa.

Ei ole täyttä yksimielisyyttä siitä mikä statuskoodi DELETE-pyynnöstä pitäisi palauttaa jos poistettavaa resurssia ei ole olemassa. Vaihtoehtoja ovat lähinnä 204 ja 404. Yksinkertaisuuden vuoksi sovellus palauttaa nyt molemmissa tilanteissa statuskoodin 204.

### Postman

Herää kysymys miten voimme testata operaatiota? HTTP GET -pyyntöjä on helppo testata selaimessa. Voisimme toki kirjoittaa javascript-koodin, joka testaa uutta deletointia, mutta jokaiseen mahdolliseen tilanteeseen tesikoodinkaan tekeminen ei ole aina paras ratkaisu.

On olemassa useita backendin testaamista helpottavia työkaluja, eräs näistä on edellisessä osassa nopeasti mainittu komentorivityökalu [curl](https://curl.haxx.se).

Käytetään nyt kuitenkin [postman](https://www.getpostman.com/)-nimistä työkalua. Asennetaan postman ja kokeillaan

<img src="/assets/3/8.png" height="200">

Postmanin käyttö on tässä tilanteessa suhteellisen ykinkertaista, riittää määritellä url ja valita oikea pyyntötyyppi.

Palvelin näyttää vastaavan oiken. Tekemällä HTTP GET osoitteeseen _http://localhost:3001/notes_ selviää että poisto-operaatio oli onnistunut, muistiinpanoa, jonka id on 2 ei ole enää listalla.

Koska muistiinpanot on talletettu palvelimen muistiin, uudelleenkäynnistys palauttaa tilanteen ennalleen.

### Datan vastaanottaminen

Toteutetaan seuraavana uusien muistiinpanojen lisäys, joka siis tapahtuu tekemällä HTTP POST -pyyntö osoitteeseen _http://localhost:3001/notes_ ja liittämällä pyynnön mukaan eli [bodyyn]https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7) luotavan muistiinpanon tiedot JSON-muodossa.

Jotta pääsisimme pyynnön mukana lähetettyyn dataan helposti käsiksi tarvitsemme [body-parser](https://github.com/expressjs/body-parser) -kirjaston apua. Määritellään kirjasto projektin riippuvuudeksi

```bash
npm install body-parser --save
```

Otetaan sitten body-parser käyttöön ja luodaan alustava määrittely HTTP POST -operaation käsittelyyn

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

//...

app.post('/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
```

Reitin tapahtumankäsittelijäfunktio pääsee dataan käsiksi viitaamalla _request.body_.

Ilman body-parser-kirjaston määrittelyä pyynnön kentässä _body_ olisi ollut määrittelemätön. body-parserin toimintaperiaatteena onkin se, että se ottaa pyynnön mukana olevan JSON-muotoisen datan, muuttaa sen Javascript-olioksi ja sijoittaa  _request_-olion kenttään ennen kuin routen käsittelijää kutsutaan.

Toistaiseksi sovellus ei vielä tee vastaanotetulle datalle, mitään muuta kuin tulostaa sen konsoliin ja palauttaa sen pyynnön vastauksessa.

Ennen toimintalogiikan viimeistelyä varmistetaan ensin postmanilla että, lähetetty tieto menee varmasti perille. Pyyntötyypin ja urlin lisäksi on määriteltävä myös pyynnön mukana menevä data eli _body_:

<img src="/assets/3/9.png" height="200">

Näyttää kuitenkin siltä, että mitään ei mene perille, palvelin vastaanottaa ainoastaan tyhjän olion. Missä on vika? Olemme unohtaneet määritellä headerille _Content-Type_ oikean arvon:

<img src="/assets/3/10.png" height="200">

Nyt kaikki toimii! Ilman oikeaa headerin arvoa palvelin ei osaa parsia dataa oikeaan muotoon. Se ei edes yritä arvella mitä data on, sillä potentiaalisia datan lähetysmuotoja eli _Content-Typejä_ on olemassa [suuri määrä](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types).

Välillä debugatessa tulee vastaan tilanteita, joissa backendissä on tarve selvittää mitä headereja HTTP-pyynnöille on asetettu. Eräs menetelmä tähän on _request_-olion melko kehonosti nimetty metodin [get](http://expressjs.com/en/4x/api.html#req.get), jonka avulla voi selvittää yksittäisen headerin arvon. _request_-oliolla on myös kenttä _headers_, jonka arvona ovat kaikki pyyntöön liittyvät headerit.

Saamme nyt sovelluslogiikan viimeisteltyä helposti:

```js
app.post('/notes', (request, response) => {
  const note = request.body
  const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
  note.id = maxId + 1

  notes = notes.concat(note)

  response.json(note)
})
```

uuden muistiinpanon id:ksi asetetaan yhtä suurempi olemassaolevien id:iden maksimi.

Tämän hetkisessä versiossa on vielä se ongelma, että voimme lisätä mitä tahansa kenttiä sisältäviä olioita. Parannellaan sovellusta siten, että kenttä _content_ vaaditaan. Kentille _important_ ja _date_ asetetaan oletusarvot. Kaikki muut kentät hylätään: 

```js
const generateId = () => {
  const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
  return maxId + 1
}

app.post('/notes', (request, response) => {
  const body = request.body

  if (body.content===undefined){
    response.status(400).json({error: 'content missing'}) 
  }

  const note = {
    content: body.content,
    important: body.content===undefined ? 'false' : body.important,
    date: body.date || new Date(),
    id: generateId()
  }

  notes = notes.concat(note)

  response.json(note)
})
```

Tunnisteena toimivan id-kentän arvon generointilogiikka on eriytetty funktioon _generateId_. 

Jos kenttä _content_ puuttuu, vastataan statuskoodilla [400 bad request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1). Muussa tapauksessa luodaan muistiinpanio syötteen perusteella. Jos kenttä _important_ tai _date_ puuttuvat, generoidaan niille oletusarvo.

## Middlewaret

Äsken käyttöönottamamme [body-parser](https://github.com/expressjs/body-parser) on niin sanottu expressin terminologiassa niin sanottu [middleware](http://expressjs.com/en/guide/using-middleware.html).

Middlewaret ovat funktioita joiden avulla voidaan käsitellä _request_- ja _response_-olioita. 

Esim. body-parser ottaa pyynnön mukana tulevan raakadatan _request_-oliosta, parsii sen Javascript-olioksi ja sijoittaa olion _request_:in kenttään _body_

Middlewareja voi olla käytössä useita jolloin ne suoritetaan peräkkäin siinä järjestyksessä kun ne on määritelty.

Toteutetaan itse yksinkertainen middleware, tulostaa konsoliin palvelimelle tulevien pyyntöjen perustietoja. 

Middleware on funktota, joka saa kolme parametria:

```js
const logger = (request, response, next) => {
  console.log('Method:',request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```

Middlewaren kutsuu lopussa parametrina olevaa funktiota _next_ jolla se siirtää kontrollin seuraavalle middlewarelle.

Middleware otetaan käyttöön seuraavasti:

```js
app.use(logger)
```

Middlewaret suoritetaan siinä järjestyksessä jossa ne on määritelty. Middlewaret tulee myös määritellä ennen routeja _jos_ ne halutaan suorittaa ennen niitä. On myös middlewareja jotka halutaan suorittaa routejen jälkeen. 

Lisätään routejen jälkeen seuraava middleware, jonka ansiosta saadaan routejen käsittelemättömistä virhetilanteista JSON-muotoinen virheilmoitus:

```js
const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)
```

## Yhteys fronendiin

Palataan yritykseemme käyttää nyt tehtyä backendiä [osassa 2](/osa2) tehdyllä React-frontendillä. Aiempi yritys lopahti seuraavaan virheilmoitukseen

![]({{ "/assets/3/3.png" | absolute_url }})

Fronendin tekemä GET-pyyntö osoitteeseen <http://localhost:3001/notes> ei jostain syystä toimi. Mistä on kyse? Backend toimii kuitenkin selaimesta ja postmanista käytettäessä ilman ongelmaa.

### Same origin policy ja CORS

Kyse on asiasta nimeltään CORS eli Cross-origin resource sharing. [Wikipedian](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) sanon

> Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.

Lyhyesti sanottuna meidän kontekstissa kyse on seuraavasta: sivulla oleva javascript-koodi saa oletusarvoisesti kommunikoida vaan samassa [originissa](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) olevaan palvelimeen. Koska palvelin on localhostin portissa 3001 ja fronend localhostin portissa 3000 tulkitaan niiden origin ei ole sama. 

Korostetaan vielä, että [same origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) ja CORS eivät ole mitenkään React- tai node-spesifisiä asioita, vaan yleismaailmallisia periaatteita Web-sovellusten toiminnasta.

Voimme sallia muista _origineista_ tulevat käyttämällä noden [cors](https://github.com/expressjs/cors)-middlewarea.

Asennetaan _cors_ komennolla

´´´bash
npm install npm install cors --save
´´´

Otetaan middleware käyttöön ja sallitaan kaikki muista origineista tulevat pyynnöt:

´´´js
const cors = require('cors')

app.use(cors())
´´´

Nyt fronend toimii! Tosin muistiinpanojen tärkeäksi muuttavaa toiminnallisuutta backendissa ei vielä ole.

CORS:ista voi lukea tarkemmin esim. [Mozillan sivuilta](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Sovellus internettiin

Kun koko stacki on saatu vihdoin kunton, siirretään sovellus internettiin. Viime aikoina on tullut uusia mielenkiintoisa sovellusten hostausmahdollisuuksia, esim [Zeit](https://zeit.co). Käytetään seuraavassa vanhaa kunnon [Herokua](https://www.heroku.com)

Lisätään projektin juureen tiedosto _Procfile_, joka kertoo herokulle, miten sovellus käynnistetään

´´´bash
web: node index.js
´´´

Muutetaan tiedoston _index.js_ lopussa olevaa sovelluksen käyttämän portin määrittelyä seuraavasti:

´´´js
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
´´´

Nyt käyttöön tulee [ympäristämuuttujassa](https://en.wikipedia.org/wiki/Environment_variable) _PORT_ määritelty portti tai 3001 jos ympäristömuuttuja _PORT_ ei ole määritelty. Heroku konfiguroi sovelluksen portin ympöristömuuttujan avulla.

Tehdään projektihakemistosta git-repositorio, lisätään _.gitignore_ jolla seuraava sisältö

´´´bash
node_modules
´´´

Luodaan heroku-sovellus komennolla _heroku create_ ja deployataan sovellus komennolla _git push heroku master_.

Jos kaikki meni hyvin, sovellus toimii. Jos ei, vikaa voi selvittää herokun lokeja lukemalla, eli komennolla _heroku logs_.

Esim. tätä materiaalia tehdessä törmättiin ongelmaan joka aiheutti seuraavan tulostuksen lokeihin

<img src="/assets/3/11.png" height="200">

Syynä ongelmalle oli se, että middlewarea _cors_ asennettaessa oli unohtunut antaa optio __--save__, joka tallentaa tiedon riippuvuudesta tiedostoon _package.json_. Koska näin kävi, ei Heroku ollut asentanut corsia sovelluksen käyttöön.

Myös fronend toimii herokussa olevan backendin avulla. 

Seuraavaksi herää kysymys miten saamme myös fronendin internettiin? Vaihtoehtoja on muutamia. 

### Frontendin tuotantoversio

Olemme toistaiseksi suorittaneet React-koodia _sovelluskehitysmoodissa_, missä sovellus on konfiguroitu anatamaan havainnollisia virheilmoituksia, päivittämään koodiin tehdyt muutokset automaattisesti selaimeen ym.

Kun sovellus viedään tuotantoon, täytyy siitä tehdä [production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)
eli tuotantoa varten optimoitu versio. 

create-react-app:in avulla tehdyistä sovelluksista saadaan muodostettua tuotantoversio komennolla [npm run build](https://github.com/facebookincubator/create-react-app#npm-run-build-or-yarn-build)

Komennon seurauksena syntyy hakemistoon _build_ (joka sisältää jo sovelluksen ainoan html-tiedoston _index.html_) sisään hakemisto _static_, minkä alle generoituu sovelluksen javascript-koodin [minifioitu](https://en.wikipedia.org/wiki/Minification_(programming))  versio. Vaikka sovelluksen koodi on kirjoitettu useaan kirjastoon, tulee kaikki javascript yhteen tiedostoon, samaan tiedostoon tulee itseasiassa myös kaikkien sovelluksen koodin tarvitsemien riippuvuuksien koodi.

Minifioitu koodi ei ole miellyttävää luettavaa. Koodin alku näyttää seuraavalta:

```js
!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=12)}([function(e,t,n){"use strict";function r(e){return"[object Array]"===E.call(e)}function o(e){return"[object ArrayBuffer]"===E.call(e)}function a(e){return"undefined"!==typeof FormData&&e instanceof FormData}function i(e){return"undefined"!==typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function u(e){return"string"===typeof e}function l(e){return"number"===typeof e}function s(e){return"undefined"===typeof e}function c(e){return null!==e&&"object"===typeof
```

### Statattisten tiedostojen tarjoaminen backendistä

Eräs mahdollisuus frontendin tuotantoonviemiseen on kopioida tuotantokoodi, eli hakemisto _build_ backendin hakemiston sisään ja määritellä backend näyttämään pääsivunaan fronendin _pääsivu_, eli tiedosto _build/index.html_.

Jotta saamme expressin näyttämään _staattista sisältöä_ eli sivun _index.html_ ja sen lataaman javascriptin ym tarvitsemme expressiin sisäänrakennettua midlewarea [static](http://expressjs.com/en/starter/static-files.html) 

Kun lisäämme muiden middlewarejen määrittelyn yhteyteen seuraavan

```js
app.use(express.static('build'))
```

tarkastaa express pyyntöjen yhteydessä ensin löytyykö pyynnön polkua vastaavan nimistä tiedostoa hakemistosta _build_, jos löytyy palauttaa express tiedoston.

Nyt HTTP GET -pyyntö osoitteeseen _www.palvelimenosoite.com/index.html_ tai _www.palvelimenosoite.com_ näyttää Reactilla tehdyn fronendin. GET-pyynnön esim. osoitteeseen _www.palvelimenosoite.com/notes_ hoitaa backendin koodi.

Koska tässä tapauksessa sekä frontend että backend toimivat samassa osoitteessa, voidaan React-sovelluksessa tapahtuva backendin _baseUrl_ määritellä [suhtellisena](https://www.w3.org/TR/WD-html40-970917/htmlweb.html#h-5.1.2) URL:ina, eli ilman palvelinta yksilöivää osaa: 

```js
import axios from 'axios'
const baseUrl = '/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

Muutoksen jälkeen on luotava uusi production build ja kopioitava se backendin repositorioin juureen.

Kun sovellus pushataan uudelleen herokuun, [se](https://radiant-plateau-25399.herokuapp.com) toimii moitteettomasti lukuunottamatta vielä backendiin toteuttamatonta muistiinpanon tärkeyden muuttamista. 

Sovelluksemme tallettama tieto ei ole ikuisesti pysyvää, sillä sovellus tallettaa muistiinpanot muuttujaan. Jos sovellus kaatuu tai se uudelleenkäynnistetään, kaikki tiedot katoavat. 

Tarvitsemme sovelluksellemme tietokannan. Ennen tietokannan käyttöönottoa katsotaan kuitenkin vielä muutamaa asiaa.

### Backendin urlit

Backendin tarjoama muistiinpanojen käsittelyn rajapinta on nyt suoraan sovelluksen URL:in <https://radiant-plateau-25399.herokuapp.com> alla. Eli <https://radiant-plateau-25399.herokuapp.com/notes> on kaikkien mustiinpanojen joukko ym. Koska backendin roolina on tarjota fronendille koneluettava rajapinta, eli API, olisi ehkä parempi eroittaa API:n tarjoama osoitteisto selkeämmin, esim. aloittamalla kaikki sanalla _api_. 

Tehdään muutos ensin muuttamalla käsin kaikki backendin routet:

```js
//...
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
//...
```

Frontendin koodiin riittää seuraava muutos

```js
import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

Joskus API:n ulissa ilmaistaan myös API:n versio. Eri versioita saatetaan tarvita, jos aikojen kuluessa API:n tehdään laajennuksia jotka ilman versiointia hajoittaisivat olemassaolevia osia ohjelmista. Versioinnin avulla voidaan tuoda vanhojen rinnalle uusia, hieman eritavalla voimivia versioita API:sta. 

API:n version ilmaiseminen URL:issa ei kuitenkaan ole välttämättä, ainakaan kaikkien mielstä järkevää vaikka tapaa paljon käytetäänkin. Oikeasta tavasta API:n versiointiin [kiistellään ympäri internettiä](https://stackoverflow.com/questions/389169/best-practices-for-api-versioning).

### Proxy

Fronendiin tehtyjen muutosten seurauksena on nyt se, että kun suoritamme sovelluskehitysmoodissa, eli käynnistämällä sen komennolla _npm start_, yhteys backendiin ei toimi. 

Koska backendin osoite on määritelty suhteellisena:

```js
const baseUrl = '/api/notes'
```

ja sovellus toimii osoitteessa _localhost:3000_, menevät bakendiin tehtävät pyynnöt väärään osoitteeseen _localhost:3000/api/notes_. Backend toimii kuitenkin osoitteessa _localhost:3001/_

create-react-app:illa luoduissa projekteissa ongelma on helppo ratkaista. Riittää, että tiedostoon _package.json_ lisätään seuraava määritelmä:

```js
{
  // ...
  "proxy": "http://localhost:3001"
}
```

Nyt Reactin sovelluskehitysympäristö toimii [proxynä](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development) ja jos React-koodi tekee HTTP-pyynnön, osoitteen _http://localhost:3000_ alle mutta pyyntö ei ole React-sovelluksen vastuulla (eli kyse ei ole esim. sovelluksen javascript-koodista tai CSS:stä), lähetetään pyyntö edelleen osoitteessa _http://localhost:3001_ olevalle palvelimelle.

Nyt myös fronend on kunnossa, se toimii sekä sovelluskehitysmoodissa että tuotannossa yhdessä palvelimen kanssa.

Eräs negatiivinen puoli käyttämässämme lähestymistavassa on se, että sovelluksen uuden version tuotantoonvieminen edellyttää ikävän manuaalisen askeleen: fronendin koodin kopioimisen backendin repositorioon. Tämä taas hankaloittaa automatisoidun [deployment pipelinen](https://martinfowler.com/bliki/DeploymentPipeline.html) toteuttamista, eli koodin automatisoidun ja hallitun sovelluskehittäjän koneelta testien kautta tuotantoympäristöön vientiä.

Tähänkin on useita erilaisia ratkaisuja (esim. sekä frontendin että backendin [sijoittaminen samaan reporitorioon](https://github.com/mars/heroku-cra-node)), emme kuitenkaan nyt mene niihin. Joihinkin teemoihin palataan myöhemmin kurssilla.

Myös fronendin koodin deployaaminen omana sovelluksenaan voi joissain tilanteissa olla järkevää. create-react-app:in avulla luotujen sovellusten osalta se on [suoraviivaista](https://github.com/mars/create-react-app-buildpack).

## Node-sovellusten debuggaaminen

## Mongo

Jotta saisimme talletettua muistiinpanot pysyvästi, tarvitsemme tietokannan. Useimmilla laitoksen kursseilla on käytetty relaatiotietokantoja. Tällä kurssilla käytämme [MongoDB](https://www.mongodb.com/):tä, joka on ns. [dokumenttitietokanta](https://en.wikipedia.org/wiki/Document-oriented_database).

Dokumenttitietokannat poikkeavat jossain määrin relaatiotietokannoista niin datan organisointitapansa kuin kyselykielensäkin suhteen. Dokumenttitietokantojen ajatellaan kuuluvan sateenvarjotermin [NoSQL](https://en.wikipedia.org/wiki/NoSQL) alle. Lisää dokumenttititokannoista ja NoSQL:stä Tietokantojen perusteiden [viikon 7 materiaalista](https://materiaalit.github.io/tikape-s17/part7/).

**Lue nyt Tietokantojen perusteiden dokumenttitietokantoja kuvaava osuus.** Jatkossa oletetaan, että hallitset käsitteet _dokumentti_ ja _kokoelma_ (collection).


MongoDB:n voi luonnollisesti asentaa omalle koneelle. Internetistä löytyy kuitenin myös palveluna toimivia Mongoja (esim [mlab](https://mlab.com/) ja [MongoDbCloud](https://www.mongodb.com/cloud/atlas)), ja koska Herokussa oleville sovelluksille on suhteellisen suoraviivaista konfiguroida Mongo-tietokanta, seuraavissa esimerkeissä käytetään Herokun kautta käyttöönotettavaa Mongoa.

Käyttöönotto tapahtuu sovelluksen repositorissa komennolla

```bash
heroku addons:create mongolab:sandbox
```

Kuten komennon tuloste kertoo, kysessä on [mlab](https://mlab.com/):n tarjoama Mongo:

<img src="/assets/3/12.png" height="200">

Pääset Herokusta sovelluksesi sivulta mlabin mongo-konsoliin. Tietokannan _mongodb_url_ selviää komentoriviltä komennolla _heroku config_.

Mongon käyttäminen javascript-koodista suoraan [MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/) -kirjaston avulla on varsin työlästä. Käytämmekin [mongoose](http://mongoosejs.com/index.html)-kirjastoa. 

Mongoosesta voisi käyttää luonnehdintaa _object document mapper_ (ODM), ja sen avulla javascript-olioiden tallettaminen mongon dokumenteiksi on suoraviivaista.

```bash
npm install mongoose --save
```

Ei lisätä mongoa koodia heti backendin koodiin, vaan tehdään erillinen kokeilusovellus tiedostoon _mongo.js_:

```js
const mongoose = require('mongoose')

const url = 'mongodb://...'

mongoose.connect(url, { useMongoClient: true });
mongoose.Promise = global.Promise;

const Note = mongoose.model('Note', { 
  content: String,
  date: Date,
  important: Boolean 
})

const note = new Note({
  content: 'HTML on helppoa',
  date: new Date(),
  important: true
})

note
.save()
.then(resp=>{
  console.log('note saved!')
  mongoose.connection.close()
})
```

Kun koodi suoritetaan komennolla _node mongo.js_ lisää mongoose tietokantaaan uuden dokumentin.

Mlab:in hallintanäkymä (minne pääsee sovelluksen heroku-sivun kautta) näyttää lisäämämme datan:

<img src="/assets/3/13.png" height="200">

Kuten näkymä kertoo, on muistiinpanoa vastaava _dokumentti_ lisätty kokoelmaan nimeltään _notes_.

Koodi sisältää muutamia mielenkiintoisia asioita. Aluksi avataan yhteys ja määritellään, että mongoose käyttää _promiseja_, eikä oldschool-tarkaisunkutsufunktioita. Valitettavasti mongosen dokumentaatiossa käytetään joka paikassa takaisinkutsufunktioita, joten sieltä ei kannata suoraan copypasteta koodia, sillä promisejen ja vanhanaikaisten callbackien sotkeminen samaan koodiin ei ole kovin järkevää.

### skeema

Yhteyden avaamisen jälkeen määritellään mustiinpanoa vastaava [model](http://mongoosejs.com/docs/models.html):

```js
const Note = mongoose.model('Note', { 
  content: String,
  date: Date,
  important: Boolean 
})
```

Modelin parametrina määritellään _muistiinpanoa_ vastaava vastaava [skeema](http://mongoosejs.com/docs/guide.html), joka keroo mongooselle, miten muitiinpano-oliot tulee tallettaa tietokantaan. 

Ensimmäisenä parametrina oleva _Note_ määrittelee sen, että mongoose tallettaa muistiinpanoa vastaavat oliot kokoelmaan nimeltään _notes_. 

Dokumentaatiossa skeema ja sitä vastaava model määritellään kumpikin erikseen:

```js
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema);
```

Koska meillä ei ole skeema-oliolle muuta käyttöä kuin modelin parametrina, käytämme hyväksemme sitä, että skeema voidaan määritellä modeleille suoraan antamalla toisena parametrina skeeman määrittelevä olio.

Dokumenttikannat, kuten Mongo ovat skeemattomia, eli tietokanta itsessään ei välitä mitään sinne talletettavan tiedon muodosta. Samaan kokoelmaankin voi tallettaa olioita joilla on täysin eri kentät.

Mongoosea käytettäessä periaatteena on kuitenkin se, että tietokantaan talletettavalle tiedolle määritellään sovelluksen koodin tasolla skeema joka määrittelee minkä muotoisia olioita kannan eri kokoelmiin talletetaan.  

### olioiden luominen ja tallettaminen

Seuraavaksi sovellus luo muistiinpanoa vastaavan [model](http://mongoosejs.com/docs/models.html):in avulla muistiinpano-olion:

```js
const note = new Note({
  content: 'Selain pystyy suorittamaan vain javascriptiä',
  date: new Date(),
  important: false
})
```

Modelit ovat ns. konstruktorifunktioita, jotka luovat parametrien perusteella javascript-olioita. Koska oliot on luotu modelien konstruktirifunktiolla, nillä on kaikki modelien ominaisuudet, eli joukko metodeja, joiden avulla olioita voidaan mm. tallettaa tietokantaan.

Tallettaminen tapahtuu metodilla _save_. Metodi palauttaa _promisen_ jolle voidaan rekisteröidä _then_-metodin avulla tapahtumankäsittelijä:

```js
note
  .save()
  .then(result=>{
    console.log('note saved!')
    mongoose.connection.close()
  })
```

eli kun olio on tallennettu kantaan, kutsutaan _then_:in parametrina olevaa funktiota, joka sulkee tietokantayhteyden _mongoose.connection.close()_. Ilman yhteyden sulkemista ohjelman suoritus ei pääty.

Tallennusoperaation tulos on takaisinkutsun parametrissa _result_. Yhtä olioa tallentaessamme tulos ei ole kovin mielenkiintoinen, olion sisällön voi esim. tulostaa konsoliin jos haluaa tutkia sitä tarkemmin.

Talletetaan kantaan myös pari muuta muistiinpanoa muokkaamalla dataa koodista ja suorittamalla ohjelma uudelleen.

### olioiden hakeminen tietokannasta

Kommentoidaan koodista uusia muistiinpanoja generoiva osa, ja korvataan se seuraavalla:

```js
Note
  .find({})
  .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
```

Kun koodi suoritetaan, kantaan talletetut muistiinpanot tulostuvat. 

Oliot haetaan kannasta _Note_-modelin metodilla [find](http://mongoosejs.com/docs/api.html#model_Model.find). Metodin parametdina on hakuehto. Koska hakuehtona oli tyhjä olio <code>{}</code>, saimme kannasta kaikki _notes_-kokoelmaan talletetut oliot.

Hakuehdot noudattavat mongon [syntaksia](https://docs.mongodb.com/manual/reference/operator/).

Voisimme hakea esim. ainoastaan tärkeät muistiinpanot seuraavasti:

```js
Note
  .find({ important:true })
  .then(result => {
    // ...
  })
```

## tietokantaa käyttävä backend

Nyt meillä on periaatteessa hallussamme riittävä tietämys ottaa mongo käyttöön sovelluksessamme. 

Aloitetaan nopean kaavan mukaan, copypastetaan tiedostoon _inded.js_ mongoosen määrittelyt, eli

```js
const mongoose = require('mongoose')

const url = 'mongodb://...'

mongoose.connect(url, { useMongoClient: true })
mongoose.Promise = global.Promise

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})
```

ja muutetaan kaikien muistiinpanojen hakemisesta vastaava käsittelijä seuraavaan muotoon  

```js
app.get('/api/notes', (request, response) => {
  Note
    .find({})
    .then(notes => {
      response.json(notes)
    })
})
```

Voimme todeta selaimella, että backend toimii kaikkien dokumenttien näyttämisen osalta:

<img src="/assets/3/14.png" height="200">

Toiminnallisuus on muuten kunnossa, mutta fronend olettaa, että olioiden yksikäsitteinen tunniste on kentässä _id_. Emme myöskään halua näyttää fronendille mongon versiontiin käyttämää kenttää <em>\_\_v</em>. Tehdään pieni apufunktio, jonka avulla yksittäinen muistiinpano saadaan muutettua mongon sisäisestä esitysmuodosta haluamaamme muotoon:

```js
const formatNote = (note) => {
  return {
    content: note.content,
    date: note.date,
    important: note.important,
    id: note._id
  }
}
```

ja käytetään palautetaan HTTP-pyynnön vastauksena funktion avulla mutoiltuja oliota:

```js
app.get('/api/notes', (request, response) => {
  Note
    .find({})
    .then(notes => {
      response.json(notes.map(formatNote))
    })
})
```

Nyt siis muuttujassa _notes_ on taulukollinen mongon palauttamia olioita. Kun suoritamme operaation <code>notes.map(format)</code> seurauksena on uusi taulukko, missä on jokaista alkuperäisen taulukon alkiota vastaava funktion _formatNote_ avulla muodostettu alkio.

Jos kannasta haettavilla olioilla olisi suuri määrä kenttiä, apufunktio _formatNote_ kannattaisi mutoilla hieman geneerisemmässä muodossa, esim:

```js
const formatNote = (note) => {
  const formattedNote = { ...note._doc, id: note._id }
  delete formattedNote._id
  delete formattedNote.__v

  return formattedNote
}
```

Ensimmäinen rivi luo uuden olion, mihin kopioituu kaikki vanhan olion kentät. Uuteen olioon lisätään myös kenttä _id_: 

```js
const formattedNote = { ...note._doc, id: note._id }
```

Ennen olion palauttamista turhat kentät poistetaan.

Jos ohjelma käyttäisi muunkin tyyppisiä olioita kuin _muisiinpanoja_ sopisi sama funktio niidenkin muotoiluun. 

On myös mahdollista estää mongoosea palauttasta tiettyjen kenttien arvoa. Saamme estettyä <em>\_\_v</em>:n seuraavasti: 

```js
app.get('/api/notes', (request, response) => {
  Note
    .find({}, '-__v')
    .then(notes => {
      response.json(notes.map(formatNote))
    })
})
```

### tietokantamäärittelyjen eriyttäminen omaksi moduuliksi

Ennen kun täydennämme backendin muutkin osat käyttämään tietokantaa, eriytetään mongoose-spesifinen koodi omaan moduuliin. 

Tehdään moduulia varten hakemisto _models_ ja sinne tiedosto _note.js_:

```js
const mongoose = require('mongoose')

const url = 'mongodb://...'

mongoose.connect(url, { useMongoClient: true })
mongoose.Promise = global.Promise

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

module.exports = Note
```

Noden [moduulien](https://nodejs.org/docs/latest-v8.x/api/modules.html) määrittely poikkeaa hiukan osassa 2 määrittelemistäme fronendin käyttämistä [ES6-moduuleista](osa3/#refaktorointia---moduulit)

Mouduulin ulos näkyvä osa määritellään asettamalla arvo muuttujalle _module.exports_. Asetamme arvoksi määsitellyn modelin _Note_. Muut moduulin sisällä määritellyt asiat, esim. muuttujat _mongoose_ ja _url_ eivät näy moduulin käyttäjälle.

Moduulin käyttöönotto tapahtuu lisäämällä tiedostoon _index.js_ seuraava rivi

```js
const Note = require('./models/note')
```

Näin muuttuja _Note_ saa arvokseen saman olion, jonka moduuli määrittelee.

### muut operaatiot

Muutetaan nyt kaikki operaatiot tietokantaa käyttävään muotoon. 

Uuden muistiinpanon luominen tapahtuu seuraavasti:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content===undefined){
    response.status(400).json({error: 'content missing'}) 
  }

  const note = new Note({
    content: body.content,
    important: body.important,
    date: new Date(),
  })

  note
    .save()
    .then(savedNote => {
      response.json(formatNote(savedNote))
    })

})
```

Muistiinpano-oliot siis luodaan _Note_-konstruktorifunktiolla. Pyyntöön vastataan _save_-operaation konstruktorifunktion sisällä. Näin varmistutaan, että operaatio vastaus tapahtuu vain jos operaatio on onnistunut. Palaamme virheiden käsittelyyn myöhemmin.

Takaisinkutsufunktion parametrina _savedNote_ on talletettu muistiinpano. HTTP-pyyntöön palautetaan kuitenkin siitä funktiolla _formatNote_ formatoitu muoto:

```js
response.json(formatNote(savedNote))
```

Kun backendia laajennetaa, kannattaa sitä testailla aluksi ehdottomasti selaimella ja postmanilla. Vasta kun kaikki on todettu toimivaksi, kannattaa siirtyä testailemaan että muutosten jälkeinen backend toimii yhdessä myös frontendin kanssa. Kaikkien kokeilujen tekeminen ainoastaan fronendin kautta on todennäköisesti varsin tehotonta.

Kun kuvioissa on mukana tietokanta, on myös tietokannan tilan tarkastelu mlabin hallintanäkymästä varsin hyödyllistä.

Ykisttäisen muistiinpanon tarkastelu muuttuu muotoon

```js
app.get('/api/notes/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      response.json(formatNote(note))
    })
})
```

### virheen käsittely

Jos yritämme mennä selaimella sellaisen yksittäise muistiinpanon sivulle mitä ei ole olemassa, eli esim. urliin <http://localhost:3001/api/notes/5a3b80015b6ec6f1bdf68d> missä _5a3b80015b6ec6f1bdf68d_ ei ole minkään tietokannassa olevan muistiinpanon tunniste, jää selain "jumiin" sillä palvelin ei vastaa pyyntöön koskaan.

Palvelimen konsolissa näkyykin virheilmoitus:

<img src="/assets/3/15.png" height="200">

Kysely on epäonnistunut ja kyselyä vastaava promise mennyt tilaan _rejected_. Koska emme käsittele promisen epäonnistumista, ei pyyntöön vastata koskaan. Osassa 2 tutstuimme jo
[promisejen virhetilanteidenkäsittelyyn](osa2/#promise-ja-virheet). 

Lisätään tilanteeseen yksinkertainen virheidenkäsittelijä:

```js
app.get('/api/notes/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      response.json(formatNote(note))
    })
    .catch(error=>{
      console.log(error)
      response.status(404).end()
    })
})
```

Kaikissa virheeseen päättyvissä tilanteissa HTTP-pyyntöön vastataan statuskoodilla 404 not found. Konsoliin tulostetaan tarkempi tieto virhestä.

Tapauksessamme on itseasiassa olemassa kaksi erityyppistä virhetilannetta. Toinen vastaa sitä, että yritetään hakea muistiinpanoa virheellisen muotoisella _id_:llä, eli sellasiella mikä ei vastaa mongon id:iden muotoa.

Jos teemme noin tulostuu konsoliin:

<pre>
Method: GET
Path:   /api/notes/5a3b7c3c31d61cb9f8a0343
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "5a3b7c3c31d61cb9f8a0343" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
</pre>

Toinen virhetilanne taas vastaa tilannetta, missä haettavan muistiinpanon id on periaatteessa oikeassa formaatissa, mutta tietokannasta ei löydy indeksillä mitään:

<pre>
Method: GET
Path:   /api/notes/5a3b7c3c31d61cbd9f8a0343
Body:   {}
---
TypeError: Cannot read property '_doc' of null
    at formatNote (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/index.js:46:33)
    at Note.findById.then.note (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/index.js:65:21)
</pre>

Nämä tilanteen on syytä erottaa toisistaan, ja itseasiassa jälkimmäinen poikkeus on oman koodimme aiheuttama.

Muutetaan koodia seuraavasti:

```js
app.get('/api/notes/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(formatNote(note))
      } else {
        response.status(404).end()
      }  
    })
    .catch(error=>{
      console.log(error) 
      response.status(400).send({ error: 'malformatted id' })
    })
})
```

Jos kannasta ei löydy haettua olioa, muuttujan _note_ arvo on _undefined_ ja koodi ajautuu _else_-haaraan. Siellä vastataan kyselyyn _404 not found_.

Jos id ei ole hyväksyttämässä muodossa ajaudutaan _catch_:in avulla määriteltyyn virheidenkäsittelijään. Parempi statauskoodi on [400 bad request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1) koska kyse on juuri siitä

> The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.

Vastaukseen on lisätty myös hieman dataa kertomaan virheen syystä.

Promisejen yhteydessä kannattaa melkeinpä aina lisätä koodiin myös virhetilainteiden käsittely, muuten seurauksena on usein hämmentäviä vikoja.

Ei ole koskaan huno idea tulostaa poikkeuksen aiheuttanutta olioa konsoliin virheenkäsittelijässä:

```js
.catch(error=>{
  console.log(error) 
  response.status(400).send({ error: 'malformatted id' })
})
```

Virheenkäsittelijään joutumisen syy voi olla joku ihan muu mitä on tullu alunperin ajatelleeksi. Jos virheen tulostaa konsoliin, voi säästyä pitkiltä ja turhauttavilta väärää asiaa debuggaavista sessioilta.

### loput operaatiot

Toteutetaan vielä jäljellä olevat operaatiot, eli yksittäisen muistiinpanon poisto ja muokkaus.

Poisto onnistuu helpointen metodilla [findByIdAndRemove](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove):

```js
app.delete('/api/notes/:id', (request, response) => {
  Note
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})
```

Vastauksena on statauskoodi _204 no content_ molemmissa "onnistuneissa" tapauksissa, eli jos olio poistettiin tai olioa ei ollut mutta _id_ oli periaatteessa oikea. Takaisunkutsun parametrin _result_ peruteella olisi mahdollisuus haarautua ja palauttaa tilanteissa eri statuskoodi jos sille on tarvetta.

Muistiinpanon tärkeyden muuttamisen mahdollistava olemassaolevan muistiinpanon päivitys onnistuu helposti metodilla [findOneAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate)

```js
app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note
    .findByIdAndUpdate(request.params.id, note, { new: true } )
    .then(updatedNote => {
      response.json(formatNote(updatedNote))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})
```

Operaatio mahdollistaa myös muistiinpanon sisällön editoinnin. Päivämäärän muuttaminen ei ole mahdollista. 

Huomaa, että metodin _findOneAndUpdate_ parametrina tulee antaa normaali javascript-olio, eikä uuden olion luomisessa käytettävä _Note_-konstruktorifunktiolla luotu olio.

Pieni, mutta tärkeä detalji liittyen operaatioon _findOneAndUpdate_. Oletusarvoisesti tapahtumankäsittelijä saa parametrikseen _response_ mikä oli olion tila [ennen muutosta](http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate). Lisäsimme operaatioon parametrin <code>{ new: true }</code> jotta saamme muuttuneen olion palautetuksi kutsujalle.

Backend vaikuttaa nyt toimivan postmanista tehtyjen kokeilujen perusteella, muistiinpanojen tärkeyden muuttaminen fronedissa kuitenkin sotkee muistiinpanojen järjestyksen. Syynä on se, että _id_-kentät eivät ole enää numeroja  vaan stringejä ja joudummekin muuttamaan järjestämisessä käytettävän metodissa _render_ olevan funktion esim. seuraavaan muotoon:

```js
  const byId = (note1, note2) => 
    note1.id < note2.id ? -1 : 1
```

Koska javascriptissa merkkijonojen leksikaalista aakkosjärjestystä on mahdollista vertailla <-operaattorilla, teemme vertailun ja palautamme vertailun tulokseen perustuen joko -1 tai 1.

## refaktorointia - promisejen ketjutus

Useat routejen tapahtumankäsittelijöistä muuttivat palautettavan datan oikeaan formaattiin kutsumalla metodia _formatNote_:

```js
const formatNote = (note) => {
  const formattedNote = { ...note._doc, id: note._id }
  delete formattedNote._id
  delete formattedNote.__v

  return formattedNote
}
```

esim uuden muitiinpanon luomisessa metodia kutsutaan _then_:in parametrina palauttama olio parametrina:

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(savedNote => {
      response.json(formatNote(savedNote))
    })

})
```

Voisimme tehdä saman myös hieman tyylikkäämmin seuraavaan tapaan:

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(savedNote => {
      return formatNote(savedNote)
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })

})
```

Eli ensimmäisen _then_:in takaisinkutsussa otamme mongoosen palauttaman olion ja formatoimme sen. Operaation tulos palautetaan returnilla. Kuten osassa 2 [todettiin](osa2/#palvelimen-kanssa-tapahtuvan-kommunikoinnin-eristäminen-omaan-moduuliin), jos promisen then-metodi palauttaa myös promisen. Eli kun palautamme _formatNote(note)_:n takaisinkutsufunktiosta, syntyy promise, jonka arvona on formatoitu muistiinpano. Saamme sen _then_-kutsun parmetrina.

Itseasiassa selviämme vieläkin tiiviimmällä muodossaa:

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(formatNote)
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })

})
```

sillä oleellisesti koska _formatNote_ on viite funktioon, on oleellisesti ottaen kyse samasta kuin kirjoittaisimme: 

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(savedNote => {
      const formattedNote = { ...savedNote._doc, id: savedNote._id }
      delete formattedNote._id
      delete formattedNote.__v

      return formattedNote
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })

})
```

## sovelluksen vieminen tuotantoon

Sovelluksen pitäisi toimia tuotannossa, eli herokussa sellaisenaan. Fronendin muutosten takia on tehtävä siitä uusi tuotantoversio ja kopioitava se backendiin. 

Sovellusta voi käyttää sekä fronendin kautta
>https://radiant-plateau-25399.herokuapp.com/>, mutta myös API:n <https://radiant-plateau-25399.herokuapp.com/api/notes> suora käyttö selaimella ja postmanilla onnistuu.

Sovelluksessamme on tällä hetkellä eräs ikävä piirre. Tietokannan osoite on kovakoodattu backendiin ja samaa tietokantaa käytetään sekä tuotannossa, että sovellusta kehitettäessä.

Tarvitsemme oman kannan sovelluskehitystä varten. Eräs vaihtoehto on luoda käyttäjätunnus [mlab](https://www.mlab.com):iin ja luoda sinne uusi tietokanta. 

Huomaa, että kun luot mlab:issa tietokannan, tarkoitetaan käyttäjätunnuksella ja salasanalla tietokannalle määriteltyä tietoja, ei niitä millä kirjaudut mlabiin_

<img src="/assets/3/16.png" height="200">

Tietokannan osoitetta ei kannata kirjoittaa koodiin. Eräs hyvä tapa tietokannan osoitteen määrittelemiseen on [ympäristömuuttujien](https://en.wikipedia.org/wiki/Environment_variable) käyttö. Itseasiassa Herokussa solvelluksemme tietokannan osoite on talletettuna ympäristömuuttujaan _MONGODB_URI_, tämän kertoo myös komentoriviltä annettava komento _heroku config_

Ympäristömuuttujiin pääsee Node-sovelluksesta käsiksi seuraavasti:

```js
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

// ...

module.exports = Note
```

tämän muutoksen jäkeen sovellus ei toimi paikallisesti, koska ympäristömuuttujalla _MONGODB_URI_ ei ole mitään arvoa. Tapoja määritellä ympäristömuuttujalle arvo on monia, käytetään nyt [dotenv](https://www.npmjs.com/package/dotenv)-kirjastoa.

Asennetaan kirjasto komennolla

```bash
https://www.npmjs.com/package/dotenv
```

Sovelluksen juurihakemistoon tehdään sitten tiedosto nimeltään _.env_, minne tarvittavien ympäristömuuttujien arvot asetetaan

```bash
MONGODB_URI=mongodb://....
```

Tiedosto **tulee heti gitignorata** sillä emme halua dotenvin tietoja verkkoon.

dotenvissä määritellyt ympäristömuuttujat otetaan koodissa käyttöön komenolla

```js
require('dotenv').config()
```

ja niihin viitataan Nodessa kuiten "normaaleihin" ympäristömuututjiin syntaksilla _process.env.MONGODB_URI_

Otetaan dotenv käyttöön seuraavasti:

```js
const mongoose = require('mongoose')

if ( process.env.NODE_ENV!=='production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

// ...

module.exports = Note
```

Nyt dotenvissä olevat ympäristömuuttujat otetaan käyttöön ainoastaan silloin kun sovellus ei ole _production_- eli tuotantomoodssa (kuten esim. Herokussa). 

Uudelleenkäynnistyksen jälkeen sovellus toimii taas paikallisesti.

Node-sovellusten konfigirointiin on olemassa ympäristömuuttujien ja dotenvin lisäksi lukuisia vaihtoehtoja, mm. [node-conf](https://github.com/lorenwest/node-config). Ympäristömuuttujien käyttö riittää meille nyt, joten emme rupea overengineeraamaan. Palaamme aiheeseen kenties myöhemmin.
