---
layout: page
title: osa 7
permalink: /osa7/
---

<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>

  <p>Osan on tavoitteena valmistua keskiviikkona 10.1.</p>
</div>


## Osan 7 oppimistavoitteet

- Webpack
  - Babel: transpailaus, polyfillit
  - Suoritusympäristöt (test/dev/prod)
- React
  - Reactin roolista sovelluksissa
  - Isompien sovellusten komponenttien organisointi
  - Virtual DOM
- react+redux+node
  - Reactin roolista sovelluksissa
  - sovelluksen rakenne jos frontti ja backend kaikki samassa repossa  
- react/node-sovellusten tietoturva
  - Helmet.js
- Testaus
  - Headless browser testing
  - Snapshot testing
- Tyypitys
  - ProcTypes revisited
  - Flow
  - typescrit
- Librarydropping
  - immutable.js
  - websocket.js
- Tulevaisuuden trendit
  - Isomorfinen koodi: react backendissa
  - Progessive web aps
  - Cloud native apps

## Webpack

React on ollut jossainmäärin kuuluisa siitä, että sovelluskehityksen edellyttämien työkalujen konfigurointi on ollut hyvin hankalaa. Kiitos [create-react-app](https://github.com/facebookincubator/create-react-app):in, sovelluskehitys Reactilla on kuitenkin nykyään tuskatonta, parempaa työskentelyflowta on tuskin ollut koskaan Javascriptillä tehtävässä selainpuolen sovelluskehityksessä.

Emme voi kuitenkaan turvautua ikuisesti create-react-app:in magiaan ja nyt onkin aika selvittää mitä kaikkea taustalla on. Avainasemassa React-sovelluksen toimintakuntoon saattamisessa on [webpack](https://webpack.js.org/)-niminen työkalu.

### bundlaus

Olemme toteuttaneet sovelluksia jakamalla koodin moduuleihin joita koodia tarvitsevat moduulit ovat _importanneet_. Vaikka ES6-moduulit ovatkin Javascript-standardissa märiteltyjä, ei mikään selain vielä osaa käsitellä moduuleihin jaettua koodia. 

Selainta varten moduuleissa oleva koodi _bundlataan_, eli siitä muodostetaan yksittäinen, kaiken koodin sisältävä tiedosto. Kun veimme Reactilla toeutetun frontendin tuotantoon osan 3 luvussa [Frontendin tuotantoversio](osa3/#Frontendin-tuotantoversio) suoritimme bundlauksen komennolla _npm run build_. Kyseinen npm-skripti suorittaa bundlauksen Webpackia hyväksikäyttäen. Tuloksena on joukko hakemistoon _build_ sijoitettavia _staattisia tiedostoja_:  

<pre>
├── asset-manifest.json
├── favicon.ico
├── index.html
├── manifest.json
├── service-worker.js
└── static
    ├── css
    │   ├── main.1b1453df.css
    │   └── main.1b1453df.css.map
    └── js
        ├── main.54f11b10.js
        └── main.54f11b10.js.map
</pre>

Hakemiston juuressa oleva sovelluksen "päätiedosto" _index.html_ lataa mm. bundlatun Javascript-tiedoston:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="manifest" href="/manifest.json">
  <link rel="shortcut icon" href="/favicon.ico">
  <title>React App</title>
  <link href="/static/css/main.1b1453df.css"rel="stylesheet">
</head>
<body><noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script type="text/javascript" src="/static/js/main.54f11b10.js"></script>
  </body>
</html>
```

Kuten esimerkistä näemme, create-react-app:illa tehdyssä sovelluksessa bundlataan Javascriptin lisäksi sovellusen CSS-märittelyt.

Käytännössä bundlaus tapahtuu siten, että sovelluksen Javascriptille määritellään alkupiste, usein tiedosto _index.js_, ja bundlauksen yhteydessä Webpack ottaa mukaan kaiken koodin mitä alkupiste importtaa, sekä importattujen koodien importtaamat koodit.

Koska osa importeista on kirjastoja, kuten React, Redux ja Axios, bundlattuun javascripttiedostoon tulee kaikkien näiden sisältö.

> Vanha tapa jakaa sovelluksen koodi moneen tiedostoon perustui siihen, että _index.html_ latasi kaikki sovelluksen tarvitsemat erilliset Javascript-tiedostot script-tagien avulla. Tämä on kuitenkin tehotonta, sillä jokaisen tiedoston lataaminen aiheuttaa pienen overheadin ja nykyään pääosin suositaankin koodin bundlaamista.  

Tehdään nyt React-projektille sopiva Webpack-konfiguraatio kokonaan käsin.

Luodaan sopivaan hakemistoon seuraavat hakemistot (build ja src) sekä tiedostot:

<pre>
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
</pre>

Tiedoston _package.json_ sisältö voi olla esim. seuraava:

```json
{
  "name": "webpack-osa7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {
  },
  "license": "MIT"
}
```

Asennetaan webpack komennolla

```bash
npm install --save webpack
```

Webpackin toiminta konfiguroidaan tiedostoon _webpack.config.js_, laitetaan sen sisällöksi seuraava

```bash
let path = require('path')

let config = {
  entry: './src/index.js',               
  output: {                     
    path: path.resolve(__dirname, 'build'),        
    filename: 'bundle.js'    
  }
}
module.exports = config
```

Määritellään sitten _npm skripti_ jonka avulla bundlaus suoritetaan

```bash
  // ...
  "scripts": {
    "build": "node_modules/.bin/webpack"
  },
  // ...
```

Lisätään hieman koodia tiedostoon _src/index.js_:

```js
const hello = (name) => {
  console.log(`hello ${name}`)
}
```

Kun nyt suoritamme komennon _npm run build_ suorittaa webpack bundlauksen. Tuloksena on tiedosto _bundle.js_ hakemistossa build:

![]({{ "/assets/7/1.png" | absolute_url }})

Tiedostossa on paljon erikoisen näköistä tavaraa. Lopussa on mukana myös kirjoittamamme koodi.

Lisätään hakemistoon _src_ tiedosto _App.js_ ja sille sisältö 

```js
const App = () => {
  return null
}

export default App
```

Importataan ja käytetään _App:_ia tiedostossa _index.js_

```js
import App from './App'

const hello = (name) => {
  console.log(`hello ${name}`)
}

App()
```

Kun nyt suoritamme bundlauksen komennolla _npm run build_ huomaamme webpackin havainneen molemmat tiedostot:

![]({{ "/assets/7/2.png" | absolute_url }})

Kirjoittamamme koodi on bundlen lopussa:

```js
const hello = (name) => {
  console.log(`hello ${name}`)
}

Object(__WEBPACK_IMPORTED_MODULE_0__App__["a" /* default */])()

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const App = () => {
  return null
}

/* harmony default export */ __webpack_exports__["a"] = (App);
```

### Konfiguraatiotiedosto

Katsotaan nyt tarkemmin konfiguraation tämänhetkistä sisältöä:

```bash
let path = require('path')

let config = {
  entry: './src/index.js',               
  output: {                     
    path: path.resolve(__dirname, 'build'),        
    filename: 'bundle.js'    
  }
}
module.exports = config
```

Konfiguraatio on Javascriptia ja tapahtuu exporttaamalla määrittelyt sisältävä olion Noden monduulisyntakissa.

Tämän hetkinen, minimaalinen määrittely on aika ilmeninen, avain [entry](https://webpack.js.org/concepts/#entry) kertoo sen tiedoston, mistä bundlaus aloitetaan.

Kenttä [output](https://webpack.js.org/concepts/#output) taas kertoo minne muodostettu bundle sijoitetaan. Kohdehakemisto täytyy määritellä absoluuttisena polkuna, se taas onnistuu helposti [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths)-metodilla. [__dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) on Noden globaali muuttuja, joka viittaa nykyiseen hakemistoon

### Reactin bundlaaminen

Muutetaan sitten sovellus minimalistiseksi React-sovellukseksi. Asennetaan tarvittavat kirjastot

```bash
npm install --save react react-dom
```

Liitetään tavanomaiset loitsut tiedostoon _index.js_

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

ja muutetaan _App.js_ muotoon

```react
import React from 'react'

const App = () => (
  <div>hello webpack</div>
)

export default App
```

Tarvitsemme sovellukselle myös "pääsivuna" toimivan tiedoston _build/index.html_

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="text/javascript" src="./bundle.js"></script>
</body>
</html>
```

Kun bundlaamme sovelluksen, törmäämme kuitenkin ongelmaan

![]({{ "/assets/7/3.png" | absolute_url }})

### loaderit

Webpack mainitsee että saatamme tarvita _loaderin_ tiedoston _App.js_ käsittelyyn. Webpack ymmärtää itse vain Javascriptia ja vaikka se saattaa meiltä matkan varrella olla unohtunutkin, käytämme Reactia ohjelmoidessamme [JSX](https://facebook.github.io/jsx/):ää näkymien renderöintiin, eli esim. seuraava

```react
const App = () => (
  <div>hello webpack</div>
)
```

ei ole "normalia" Javascriptia, vaan JSX:n tarjoama syntaktinen oikotie määritellä _div_-tagi.

[Loaderien](https://webpack.js.org/concepts/loaders/) avulla on mahdollista kertoa Webpackille miten tiedostot tulee käsitellä ennen niiden bundlausta. 

Määritellään projektiimme Reactin käyttämän JSX:n normaaliksi Javascriptiksi muuntava loaderi:

```js
let config = {
  entry: './src/index.js',               
  output: {                     
    path: path.resolve(__dirname, 'build'),        
    filename: 'bundle.js'    
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      }
    ]
  }  
}
```

Loaderin määritellään kentän _module_ alle sijoitettavaan taulukkoon _loaders_. 

Yksittäisen loaderin määrittely on kolmioisainen:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['react']
  }
}
```

Kenttä _test_ määrittelee että käsitellään _.js_-päätteisiä tiedostoja, _loader_ kertoo että käsittelu tapahtuu [babel-loader](https://github.com/babel/babel-loader):illa. Kenttä _query_ taas antaa loaderille sen toimintaa ohjaavia parametreja.

Asennetaan loader ja sen tarvitsemat kirjastot _kehitysaikaiseksi riippuvuudeksi_:

```js
npm install --save-dev babel-core babel-loader babel-preset-react 
```

Nyt bundlaus onnistuu. 

Huomaamme, että Reactin bundlaaminen koodin mukaan on kasvattanut tiedostoa _build/bundle.js_ melkoisesti, kokoa on noin 7500 rivia. Lopussa on sovelluksemme  loaderin käsittelyn jälkeinen koodi. Komponentin _App_ määrittely on muuttunut muotoon

```js
const App = () => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  'hello webpack'
);
```

Eli JSX-syntaksin sijaan komponentit luodaan pelkällä Javascritpilla käyttäen Reactin  funktiota [createElement](https://reactjs.org/docs/react-without-jsx.html).

Sovellusta voi nyt kokeilla avaamalla tiedoston _build/index.html_ selaimen _open file_ -toiminnolla:

![]({{ "/assets/7/1.png" | absolute_url }})

Tässä on jo melkein kaikki mitä tarvitsisimme React-sovelluskehitykseen.

### transpilaus

Prosessista, joka muuttaa Javascriptia muodosta toiseen käytetään englanninkielistä termiä [transpiling](https://en.wiktionary.org/wiki/transpile), joka taas on termi, joka viittaa koodin kääntämiseen (compile) sitä muuntamalla (transpile). Suomenkielisen termin puuttuessa käytämme prosessista tällä kurssilla nimitystä _transpilaus_.

Edellisen luvun konfiguraation avulla siis _transpailaamme_ JSX:ää sisältävän Javascriptin normaaliksi Javascripiksi tämän hetken johtavan työkalun [babelin](https://babeljs.io/) aulla.

Kuten osassa 1 jo mainittiin läheskään kaikki selaimet eivät vielä osaa Javascriptin uusimpien versioiden ES6:n ja ES7:n ominaisuuksia ja tämän takia koodi yleensä transpiloidaan käyttämään vanhempaa Javascript-syntaksia ES5:ttä.

Babelin suorittama transpilointiprosessi määritellään _pluginien_ avulla. Käytännössä useimmiten käytetään valmiita [presetejä](https://babeljs.io/docs/plugins/), eli useamman sopivan pluginin joukkoa. 

Tällä hetkellä sovelluksemme tarnspiloinnissa käytetään presetiä [react](https://babeljs.io/docs/plugins/preset-react/):

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['react']
  }
}
```

Otetaan käyttään preset [env](https://babeljs.io/docs/plugins/preset-env/), joka sisältää kaiken hyödyllisen, minkä avulla uudsimman standardin mukainen koodi saadaan transpiloitua ES5-standardin mukaiseksi koodiksi:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['env', 'react']
  }
}
```

Preset asennetaan komennolla

```js
npm install babel-preset-env --save-dev
```

Kun nyt transpiloimme koodin, muuttuu se vanhan koulukunnan Javascriptiksi. Komponentin _App_ määrittely näyttää seuraavalta:

```js
var App = function App() {
  return _react2.default.createElement(
    'div',
    null,
    'hello webpack'
  );
};
```

Muuttujan määrittely tapahtuu avainsanan _var_ avulla, sillä ES5 ei tunne avainsanaa _let_. Myöskään nuolifunktiot eivät ole käytössä, joten funktiomäärittely käyttää avainsanaa _function_.

### CSS

Lisätään sovellukseemme hieman CSS:ää. Tehdään tiedosto _src/index.css_

```css
.container {
  margin: 10;
  background-color: #dee8e4
}
```

Määritellään tyyli käytettäväksi komponentissa _App_

```js
const App = () => (
  <div className='container'>
    hello webpack
  </div>
)
```

ja importataan se tiedostossa _index.js_

```js
import './index.css'
```

Transpilointi hajoaa, ja CSS:ää varten onkin otettava käyttöön [css](https://webpack.js.org/loaders/css-loader/)- ja [style](https://webpack.js.org/loaders/style-loader/)-loaderit:
 
```js
{
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['env', 'react']
      }
    },
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader']
    }
  ]
}
```

css](https://webpack.js.org/loaders/css-loader/)-loaderin tehtävänä on ladata _CSS_-tiedostot, ja [style](https://webpack.js.org/loaders/style-loader/)-loader generoi koodiin CSS:t sisältävän _style_-elementin.

Näin määriteltynä CSS-määrittelyt sisällytetään sovelluksen Javascriptin sisältävään tiedostoon _bundle.js_. Sovelluksen päätiedostossa _index.html_ ei siis ole tarvetta erikseen ladata CSS:ää. 

CSS voidaan myös generoida omaan tiedostoonsa esim. [extract-text](https://github.com/webpack-contrib/extract-text-webpack-plugin)-pluginin avulla.

Kun loaderit asennetaan

```js
npm install style-loader css-loader --save-dev
```

bundlaus toimii taas ja sovellus saa uudet tyylit.

### watch ja webpack-dev-server

Sovelluskehitys onnistuu jo, mutta development workflow on suorastaan hirveä (alkaa jo muistuttaa Javalla tapahtuvaa sovelluskehitystä...), muutosten jälkeen koodin on bundlattava ja selain uudelleenladattava jos haluamme testata koodia.

Tilanne paranee jo oleellisesti jos webpackia suoritetaan [watch](https://webpack.js.org/guides/development/#using-watch-mode)-moodissa. Määritellään tätä varten npm-skripti:

```bash
{
  // ...
  "scripts": {
    "build": "node_modules/.bin/webpack",
    "watch": "webpack --watch"
  },
  // ...
}  
```

Nyt bundlaus tapahtuu automaattisesti koodin editoinnin yhteydessä.

Vielä paremman ratkaisun tarjoaa [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server). Asennetaan se komennolla

```bash
npm install --save-dev webpack-dev-server
```

### hot reload

### sourcemappaus

### uglify

### envs

### polyfill