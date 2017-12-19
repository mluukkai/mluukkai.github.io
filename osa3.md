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

const app = http.createServer( (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(notes))
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

json
```
{
  // ...
  "dependencies": {
    "express": "^4.16.2"
  }
}
```

npm:n yhteydessä käytetään ns. [semanttista versiointia](https://docs.npmjs.com/getting-started/semantic-versioning).