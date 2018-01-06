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
  - PropTypes revisited
  - Flow
  - typescript
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
const path = require('path')

const config = {
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
const path = require('path')

const config = {
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
const config = {
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

![]({{ "/assets/7/4.png" | absolute_url }})

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

Muuttujan määrittely tapahtuu avainsanan _var_ avulla, sillä ES5 ei tunne avainsanaa _const_. Myöskään nuolifunktiot eivät ole käytössä, joten funktiomäärittely käyttää avainsanaa _function_.

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


Määritellään dev-serverin käynnistävä npm-skripti:

```bash
{
  // ...
  "scripts": {
    "build": "node_modules/.bin/webpack",
    "watch": "webpack --watch",
    "start": "webpack-dev-server"
  },
  // ...
}
```

Lisätään tiedostoon _webpack.config.js_ kenttä _devServer_

```bash
const config = {
  entry: './src/index.js',               
  output: {                     
    path: path.resolve(__dirname, 'build'),        
    filename: 'bundle.js'    
  },
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    compress: true,
    port: 3000
  },
  // ...
}
```

Komento _npm server_ käynnistää nyt dev-serverin porttiin, eli sovelluskehitys tapahtuu avaamalla tuttuun tapaan selain osoitteeseen <http://localhos:3000>. Kun teemme koodiin muutoksia, reloadaa selain automaattisesti itsensä.

Päivitysprosessi on nopea, dev-serveriä käytettäessä webpack ei bundlaa koodia normaaliin tapaan tiedostoksi _bundle.js_, bundlauksen tuotos on olemassa ainoastaan keskusmuistissa.

Laajennetaan koodia muuttamalla komponentin _App_ määrittelyä seuraavasti: 

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0
    }
  }

  render() {
    return (
      <div className='container'>
        <p>hello webpack {this.state.counter} clicks</p>
        <button onClick={()=>this.setState({counter: this.state.counter+1})}>click</button>
      </div>
    )
  }
} 
```

Kannattaa huomata, että virheviestit eivät renderöidy selaimeen kuten create-react-app:illa tehdyissä sovelluksissa, eli on seurattava tarkasti konsolia:

![]({{ "/assets/7/5.png" | absolute_url }})

Sovellus toimii hyvin ja kehitys on melko sujuvaa. 

### sourcemappaus

Erotetaan napin klikkauksenkäsittelijä omaksi funktioksi:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0
    }
  }

  onClick() {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
      <div className='container'>
        <p>hello webpack {this.state.counter} clicks</p>
        <button onClick={this.onClick}>click</button>
      </div>
    )
  }
} 
```

Sovellus ei enää toimi, ja konsoli kertoo virheen

![]({{ "/assets/7/6.png" | absolute_url }})

Tiedämme tietenkin nyt että virhe on metodissa onClick, mutta jos olisi kyse suuremmasta sovelluksesta, on virheilmoitus sikäli hyvin ikävä, että se kertoo virheen sijainnin bundlatussa koodissa:

<pre>
bundle.js:16732 Uncaught TypeError: Cannot read property 'setState' of undefined
</pre>

mutta ei sitä missä kohtaa alkuperäistä koodia virhe sijaitsee.

Korjaus on onneksi hyvin helppo, pyydetään webpackia generoimaan bundlelle ns.  [source map](https://webpack.js.org/configuration/devtool/), jonka avulla bundlea suoritettaessa tapahtuva virhe on mahdollista _mäpätä_ alkuperäisen koodin vastaavaan kohtaan.

Source map saadaan generoitua lisäämällä konfiguraatioon avain _devtool_ aja sen arvoksi 'source-map':

```bash
const config = {
  entry: './src/index.js',               
  output: {                     
    // ...
  },
  devServer: {
    // ...
  },
  devtool: 'source-map',
  // ..
}
```

Nyt virheilmoitus on hyvä

![]({{ "/assets/7/7.png" | absolute_url }})

Source mapin käyttö mahdollistaa myös chromen debuggerin luontevan käytön

![]({{ "/assets/7/8.png" | absolute_url }})

Kyseinen virhe on siis jo [osasta 1](osa1/#Metodien-käyttö-ja-this) tuttu this:in kadottaminen. Korjataan ongelma määrittelemällä metodi uudelleen meille jo kovin tutulla syntaksilla:

```js
onClick = () => {
  this.setState({ counter: this.state.counter + 1 })
}
```  

Tästä aiheutuu kuitenkin virheilmoitus

![]({{ "/assets/7/9.png" | absolute_url }})

Virhe johtuu siitä, että käyttämämme syntaksi ei ole vielä mukana Javascriptin uusimmassa standardissa ES7. Saamme syntaksin käyttöön asentamalla [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/)-pluginin komennolla

```bash
npm install --save-dev 
```

ja kehottamalla _babel-loader_ käyttämään pluginia:

```bash
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['env', 'react'],
    plugins: [require('babel-plugin-transform-class-properties')]
  }
}
```

### Koodin minifiointi

Kun sovellus viedään tuotantoon, on siis käytössä tiedostoon _bundle.js_ bundlattu koodi. Vaikka sovelluksemme sisältää omaa koodia vain muutaman rivin, on tiedoston _bundle.js_ koko 702917 tavua sillä se sisältää myös kaiken React-kirjaston koodin.  Tiedoston koollahan on sikäli väliä, että selain joutuu lataamaan tiedoston kun sovellusta aletaan käyttämään. Nopeilla internetyhteyksillä 702917 tavua ei sinänsä ole ongelma, mutta jos mukaan sisällytetään enemmän kirjastoja, alkaa sovelluksen lataaminen ikkuhiljaa hidastua etenkin mobiilikäytössä.

Jos tiedoston sisältöä tarkastelee, huomaa että sitä voisi optimoida huomattavasti koon suhteen esim. poistamalla kommentit. Tiedostoa ei kuitenkaan kannata lähteä optimoimaan käsin, sillä tarkoitusta varten on olemassa monia työkaluja. 

Javascript-tiedostojen optimonintiprosessista käytetään nimitystä _minifiointi_. Alan johtava työkalu tällä hetkellä lienee [UglifyJS](http://lisperator.net/uglifyjs/).

Otetaan Uglify käyttöön asentamalla Webpackin [uglifyjs-webpack-plugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/) komennolla:

```bash
npm install --save-dev uglifyjs-webpack-plugin
```

[Pluginin](https://webpack.js.org/concepts/#plugins) konfigurointi tapahtuu seuraavasti:

```bash
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
  // ...
  module: {
    // ...
  },
  plugins: [
    new UglifyJsPlugin()
  ]  
}
```

Kun sovellus bundlataan uudelleen, pienenee tuloksena oleva _bundle.js_ mukavasti

```bash
-rw-r--r--  1 mluukkai  984178727   288651 Jan  6 15:46 bundle.js
```

Minifioinnin lopputulos on kuin vanhan liiton c-koodia, kommentit ja jopa turhat välilyönnit ja rivinvaihtot on poistettu ja muuttujanimet ovat yksikirjaimisia:

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### envs

Lisätään sovellukselle backend. Käytetän jo tutuksi käynyttä muistiinpanoja tarjoavaa palvelua. Talletetaan seuraava sisältö tiedostoon _db.json_

```json
{
  "notes":[
    {
      "important": true,
      "content": "HTML on helppoa",
      "id": "5a3b8481bb01f9cb00ccb4a9"
    },
    {
      "important": false,
      "content": "Mongo osaa tallettaa oliot",
      "id": "5a3b920a61e8c8d3f484bdd0"
    }
  ]
}
```

Tarkoituksena on konfiguroida sovellus webpackin avulla siten, että paikallisesti sovellusta kehitettäessä käytetään backendina portissa 3001 toimivaa json-serveriä. 

Bundlattu tiedosto laitetaan sitten käyttämään todellista, osoitteessa <https://radiant-plateau-25399.herokuapp.com/api/notes> olevaa backendia.

Asennetaan _axios_, käynnistetään json-server ja muokataan komponenttia _App_ seuraavasti:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0,
      noteCount: 0
    }
  }

  componentWillMount() {
    axios.get('http://localhost:3001/notes').then(result=>{
      this.setState({noteCount: result.data.length})
    })
  }

  onClick = () => {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
      <div className='container'>
        <p>hello webpack {this.state.counter} clicks</p>
        <button onClick={this.onClick}>click</button>
        <p>{this.state.noteCount} notes in server </p>
      </div>
    )
  }
} 
```

Koodissa on nyt kovakoodattuna sovelluskehityksessä käytettävän palvelimen osoite. Miten saamme osoitteen hallitusti muutettua internetissä olevan backendin bundlatessamme koodin?

Lisätään webpackia käyttäviin npm-skripteihin [ympäristömuuttujien](https://webpack.js.org/guides/environment-variables/) avulla tapahtuva määrittely siitä onko kyse sovelluskehitysmoodista _development_ vai tuotantomodista _production_:

```bash
{
  // ...
  "scripts": {
    "build": "node_modules/.bin/webpack --env production",
    "start": "webpack-dev-server --env development"
  },
  // ...
}
```

Muutetaan sitten _webpack.config.js_ oliosta [funktioksi](https://webpack.js.org/configuration/configuration-types/#exporting-a-function):

```bash
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = (env) => {
  
  return {
    entry: './src/index.js',               
    output: {       
      // ...                       
    },
    devServer: {
      // ...      
    },
    devtool: 'source-map',
    module: {
      // ...      
    },
    plugins: [
      // ...
    ]  
  }
}

module.exports = config
```

Määrittely on muuten täysin sama, mutta aiemmin exportattu olio on nyt määritellyn funktion paluuarvo. Funktio saa parametrin _env_ joka saa npm-skriptissä aseteutn arvon. Tämän ansiosta on mahdollista muodostaa erilainen konfiguraatio development- ja production-moodeisssa.

Webpackin [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) voimme määritellä globaaleja _vakioarvoja_, joita on mahdollista käyttää bundlattavassa koodissa. Määritellän nyt vakio _BACKEND_URL_, joka saa eri arvon riippuen siitä ollaanko kehitysympärisössä vai tehdäänkö tuotantoon sopivaa bundlea:

```bash
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const config = (env) => {
  const backend_url = env==='production'  
    ? 'https://radiant-plateau-25399.herokuapp.com/api/notes'
    : 'http://localhost:3001/notes'

  return {
    // ...
    plugins: [
      new UglifyJsPlugin(),
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]  
  }
}
```

Määriteltyä vakioa käytetään koodissa seuraavasti:

```js
componentWillMount() {
  axios.get(BACKEND_URL).then(result=>{
    this.setState({noteCount: result.data.length})
  })
}
```

Jos kehiytys- ja tuotantokonfiguraatio eriytyvät paljon, saattaa olla hyvä idea [eriyttää konfiguraatiot](https://webpack.js.org/guides/production/) omiin tiedostoihinsa.

### production build

[React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) huomauttaa että sovelluksen bundlessa on vielä pieni ongelma

![]({{ "/assets/7/10.png" | absolute_url }})

Ongelma on helppo korjata [tätä](https://reactjs.org/docs/optimizing-performance.html) ohjetta soveltaen:

```bash
const config = (env) => {
  const backend_url = env==='production'  
    ? 'https://radiant-plateau-25399.herokuapp.com/api/notes'
    : 'http://localhost:3001/notes'

  return {
    // ...
    plugins: [
      new UglifyJsPlugin(),
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url),
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    ]  
  }
}
```

Konsoli varmistaa että bundle on nyt oiken muodostettu

![]({{ "/assets/7/11.png" | absolute_url }})

Konfiguraatio on edellen oikea myös sovelluskehitysmoodissa:

![]({{ "/assets/7/12.png" | absolute_url }})

### polyfill

Sovelluksemme on valmis ja toimii muiden selaimien kohtuullisen uusilla versiolla,mutta Internet Explorerilla sovellus ei toimi. Syynä tähän on se, että _axiosin_ ansiosta koodissa käytetään [Promiseja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), mikään IE:n versio ei kuitenkaan niitä tue:

![]({{ "/assets/7/13.png" | absolute_url }})

On paljon muutakin standardissa määriteltuä koodia, mitä IE ei tue, esim. niinkin harmiton komento kuin taulukoiden [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) ylittää ie:n kyvyt:

![]({{ "/assets/7/14.png" | absolute_url }})

Tälläisessä tilanteessa normaali koodin transpilointi ei auta, sillä tanspiloinnissa koodia käännetään uudemmasta javascriptsyntaksista vanhempaan, selaimien paremin tukemaan syntaksiin. Promiset ovat syntaktillisesti täysin IE:n ymmärrettäsissä, IE:ltä vaan puuttuu toteutus promisesta, samoin on tilanne taulukoiden suhteen, IE:llä taulukoiden _find_ on arvoltaan _undefined_.

Jos haluamme sovelluksen IE-yhteensopivaksi, tarvitsemme [polyfilliä](https://remysharp.com/2010/10/08/what-is-a-polyfill), eli koodia, joka lisää puuttuvan toiminnallisuuden vanhempiin selaimiin.

Polyfillaus on mahdollista hoitaa [Webpackin ja Babelin avulla](https://babeljs.io/docs/usage/polyfill/) tai asentamalla yksi monista tarjolla olevista polyfill-kirjastoista.

Esim .kirjaston [promse-polyfill](https://www.npmjs.com/package/promise-polyfill) tajoaman polyfillin käyttö on todella helppoa, koodiin lisätään seuraava:

```js
import PromisePolyfill from 'promise-polyfill'
 
if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```

Jos globaalia _Promise_ ei ole olemassa, eli selain ei tue promiseja, sijoittaan polyfillattu promise globaaliin muuttujaan. Jos polyfillattu promise on hyvin toteutettu, muun koodin pitäisi toimia ilman ongelmia.

Kattavahko lista olemassaolevista polyfilleistä löytyy [täältä](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills).

Selaimien yhteensopivuus käytettävien API:en suhteen kannattaakin tarkistaa esim.  [https://caniuse.com](https://caniuse.com)-sivustolta tai  [Mozzillan sivuilta](https://developer.mozilla.org/en-US/).

### eject

Create-react-app käyttää taustalla webpackia. Jos peruskonfiguraatio ei riitä, on projektit mahdollista [ejektoida](https://github.com/facebookincubator/create-react-app#converting-to-a-custom-setup), jolloin kaikki konepellin alla oleva magia häviää, ja konfiguraatiot tallettuvat hakemistoon _config_ ja muokattuun _package.json_-tiedostoon.

Jos create-react-app:illa tehdyn sovelluksen ejektoi, paluuta ei ole, sen jälkeen kaikesta konfiguroinnista on huolehdittava itse. Konfiguraatiot eivät ole triaaleimmasta päästä ja create-react-appin ja ejektoinnin sijaan parempi vaihtoehto saattaa joskus olla tehdä itse koko webpack-konfiguraatio.

Ejektoidun sovelluksen konfiguraatioiden lukeminen on suositeltavaa ja sangen opettavaista!

## Lisää tyyleistä

Osissa 2 ja 6 on jo katsottu muutamaa tapaa tyylien lisäämiseen eli vanhan koulukunnan [yksittäistä CSS](osa2/#Tyylien-lisääminen)-tiedostoa, [inline-tyylejä](osa6/#Inline-tyylit) ja [UI-frameworkien](osa6/#Valmiit-käyttöliittymätyylikirjastot) kuten Bootstrapin käyttöä. 

Tapoja on [monia muitakin](https://survivejs.com/react/advanced-techniques/styling-react/), katsotaan vielä lyhyestä kahta tapaa.

### css-moduulit

Yksi CSS:n keskeisistä ongelmista on se, että CSS-määrittelyt ovat _globaaleja_. Suurissa tai jo keskikokoisissakin sovelluksissa tämä aiheuttaa ongelmia, sillä tiettyihin komponentteihin vaikuttavat monissa paikoissa määritellyt tyylit ja lopputulos voi olla vaikeasti ennakoitavissa.

Laitoksen [kurssilistasivun](https://www.cs.helsinki.fi/courses) alaosassa on itseasiassa eräs ilmentymä tälläisestä ikävästä bugista

![]({{ "/assets/7/15.png" | absolute_url }})

Sivulla on monessa paikassa määriteltyjä tyylejä, osa määrittelyistä tulee Drupal-sisällönhallintajärjestelmästä, osa on laitoskohtaisia, osa taas tulee sivun yläosan olemassaolevaa opetustarjontaa näyttävistä komponenteista. Vika on niin hankala korjata, ettei kukaan ole viitsinyt sitä tehdä.

Demonstroidaan vastaavankaltaista ongelmatilannetta esimerkkisovelluksessamme.

Muutetan esimerkkitietostoamme siten, että komponentista _App_ irrotetaan osa toiminnallisuudesta komponentteihin _Hello_ ja _NoteCount_:

```react
import './Hello.css'

const Hello = ({ counter }) => <p className='content'>hello webpack {counter} clicks!</p> 

export default Hello
```

```react
import './NoteCount.css'

const NoteCount = ({ noteCount }) => <p className='content'> {noteCount} notes in server</p>

export default NoteCount
```

Molemmat näistä määrittelevät oman tyylistiedostonsa.

_Hello.css_

```CSS
.content {
  background-color: yellow
}
```

_NoteCount.css_:

```CSS
.content {
  background-color: blue
}
```


Koska molemmat komponentit käyttävät samaa CSS-luokan nimeä _content_, käykin niin että myöhemmin määritelty ylikirjoittaa aiemmin määritellyn, ja molempien tyyli on sama:

![]({{ "/assets/7/16.png" | absolute_url }})

Perinteinen tapa kierää ongelma on ollut käyttää monimutkaisempia CSS-luokan nimiä, esim. _Hello_container_ ja _NoteCount_container_, tämä muuttuu kuitenkin jossain vaiheessa varsin hankalaksi.

[CSS-moduulit](https://github.com/css-modules/css-modules) tarjoaa tähän erään ratkaisun. 

Lyhyesti ilmaisten periaatteena on tehdä CSS-määrittelyistä lähtökohtaisesti lokaaleja, vain yhden komponentin kontekstissa voimassa olevia, joka taas mahdollistaa luontevien CSS-luokkanimien käytön. Käytännössä tämä lokaalius toteutetaan generoimalla konepellin alla CSS-luokille uniikit luokkanimet.


CSS-moduulit voidaan toteuttaa suoraan Webpackin css-loaderin avulla seuraten [sivun](https://www.triplet.fi/blog/practical-guide-to-react-and-css-modules/) ohjetta.

Muutetaan tyylejä käyttäviä komponentteja hiukan:

```react
import styles from './Hello.css'

const Hello = ({ counter }) => (
  <p className={styles.content}>
    hello webpack {counter} clicks!
  </p> 
)

export default Hello
```

Erona siis edelliseen on se, että tyyliit "sijoitetaan muuttujaan" _styles_

```js
import styles from './Hello.css'
```

Nyt tyylitiedoston määrittelelyihin voi viitata muuttujan _styles_ kautta, ja CSS-luokan liittäminen tapahtuu seuraavasti

```react
<p className={styles.content}>
```

Vastaava muutos tehdään komponentille _NoteCount_.

Muutetaan sitten Webpackin konfiguraatiossa olevaa _css-loaderin_ määrittelyä siten että se enabloi [CSS-modulit](https://github.com/webpack-contrib/css-loader#modules):

```js
{
  test: /\.css$/,
  loaders: [
    'style-loader',
    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap&-minimize'
  ]
}
```

Nyt molemmat komponentit saavat omat tyylinsä. Konsolista tarkastelemalla huomaamme, että komponenttien luokille on generoitunut webpackin css-loaderin generoimat uniikit nimet:

![]({{ "/assets/7/17.png" | absolute_url }})

CSS-luokan nimen muotoieva osa on _css-loaderin_ yhteydessä oleva

<pre>
localIdentName=[name]__[local]___[hash:base64:5]
</pre>

Jos olet aikeissa käyttää CSS-moduuleja, kannattaa vilkaista mitä kirjasto [react-css-modules](https://github.com/gajus/react-css-modules) tarjoaa .

### Styled components

Mielenkiintoisen näkökulman tyylien määrittelyyn tarjoaa Javascriptin ES6 syntaksin [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)-syntaksia hyödyntävä [styled components](https://www.styled-components.com/)-kirjasto.


Tehdään styled-componentsin avulla esimerkkisovellukseemme muutama tyylillinen muutos:

```bash
import styled from 'styled-components'

const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid black;
  border-radius: 3px;
`

const Hello = ({ className, counter }) => (
  <p className={className}>
    hello webpack {counter} clicks
  </p>
)

const StyledHello = styled(Hello) `
  color: blue;
  font-weight: bold;
`

class App extends React.Component {
  //...

  render() {
    return (
      <div>   
        <StyledHello counter={this.state.counter} />
        <Button onClick={this.onClick}>click</Button>
      </div>
    )
  }
} 
```

Heti alussa luodaan HTML:n _button_-elementistä jalostettu versio ja sijoitetaan se muuttujaan _Button_:

```js
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid black;
  border-radius: 3px;
`
```

Tyylien määrittelyn syntaksi on varsin mielenkiintoinen.

Määritelty komponentti toimii kuten normaali _button_ ja sovellus renderöi sen normaaliin tapaan:

```html
<Button onClick={this.onClick}>click</Button>
```

Seuraavaksi koodi määrittelee normaalin React-komponentin

```react
const Hello = ({ className, counter }) => (
  <p className={className}>
    hello webpack {counter} clicks
  </p>
)
```

ja lisää tälle tyylit metodin _styled_ avulla:

const StyledHello = styled(Hello) `
  color: blue;
  font-weight: bold;
`

Muuttujaan _StyledHello_ sijoitettua tyyleillä jalostettua komponenttia käytetään kuten alkuperäistä:

```react
<StyledHello counter={this.state.counter} />
```

Sovelluksen ulkoasu seuraavassa:

![]({{ "/assets/7/18.png" | absolute_url }})


## Testauksesta

- snapshot
- Headles

## React

- Reactin roolista sovelluksissa
- Isompien sovellusten komponenttien organisointi
- Virtual DOM

## react+redux+node

- Reactin roolista sovelluksissa
- sovelluksen rakenne jos frontti ja backend kaikki samassa repossa  

## react/node-sovellusten tietoturva
  
- Helmet.js

## Tyypitys

- ProcTypes revisited
- Flow
- typescrit

## Librarydropping
  
- immutable.js
- websocket.js

## Tulevaisuuden trendit
  
- Isomorfinen koodi: react backendissa
- Progessive web aps
- Cloud native apps

