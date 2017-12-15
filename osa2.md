---
layout: page
title: osa 2
permalink: /osa2/
---



<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>
</div>

## osan 2 oppimistavoitteet

- Web-sovellusten toiminnan perusteet
  - ...
- React
  - ...
- Javascript
  - ...

## kokoelmien renderöiminen

Tehdään nyt reactilla [ensimmäisen osan](/osa1) alussa käytettyä esimerkkisovelluksen [Single page app -versiota](https://fullstack-exampleapp.herokuapp.com/spa) vastaava sovellus.

Aloitetaan seuraavasta:

```react
const notes = [
  {
    id: 1,
    content: "HTML on helppoa",
    date: "2017-12-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Selain pystyy suorittamaan vain javascriptiä",
    date: "2017-12-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "HTTP-protokollan tärkeimmät metodit ovat GET ja POST",
    date: "2017-12-10T19:20:14.298Z",
    important: true
  }
]

const App = (props) => {
  const { notes } = props;

  return(
    <div>
      <h1>Muistiinpanot</h1>
      <ul>
        <li>{note[0].content}</li>
        <li>{note[1].content}</li>
        <li>{note[2].content}</li>
      </ul>
    </div>
  )
}

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
) 
```

Jokaiseen muistiinpanoon on merkitty myös _boolean_-arvo, joka kertoo onko muistiinpano luokiteltu tärkeäksi, sekä yksikäsitteinen tunniste _id_.

Koodin toiminta perustuu siihen, että taulukossa on tasan kolme muistiinpanoa, yksittäiset muitiinpanot renderöidään 'kovakoodatusti' viittaamalla suoraan taulukossa oleviin olioihin:

```html
<li>{note[1].content}</li>
```

Tämä ei tietenkään ole järkevää. Ratkaisu voidaan yleistää generoimalla taulukon perusteella joukko React-elementtejä käyttäen [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)-funktiota:

```js
notes.map(note => <li>{note.content}</li>)
```

nyt tuloksena on taulukko, jonka sisältö on joukko _li_-elementtejä

```js
[ 
  <li>'HTML on helppoa'</li>, 
  <li>'Selain pystyy suorittamaan vain javascriptiä'</li>,
  <li>'HTTP-protokollan tärkeimmät metodit ovat GET ja POST'</li>
]
```

jotka voidaan sijoittaa _ul_-tagien sisälle:

```react
const App = (props) => {
  const { notes } = props;
  const rivit = () => notes.map(note => <li>{note.content}</li>)

  return(

    <div >
      <h1>Muistiinpanot</h1>
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
    </div >
  )
}
```

Koska li-tagit generoiva koodi on javascriptia, tulee se sijoittaa JSX-templatessa aaltosulkujen sisälle kaiken muun javascript-koorin tapaan.

Usein vastaavissa tilanteissa dynaamisesti generoitava sisältö eristetään omaan metodiin jota JSX-template kutsuu:

```react
const App = (props) => {
  const { notes } = props;
  const rivit = () => notes.map(note => <li>{note.content}</li>)

  return(

    <div >
      <h1>Muistiinpanot</h1>
      <ul>
        {rivit()}
      </ul>
    </div >
  )
}
```

Vaikka sovellus näyttää toimivain, tulee konsoliin ikävä varoitus

![]({{ "/assets/2/1.png" | absolute_url }})

Kuten virheilmoituksen linkittämä [sivu](https://reactjs.org/docs/lists-and-keys.html#keys) kertoo, tulee taulukossa olevilla, eli käytännössä _map_-metodilla muodostetuilla elementeillä olla uniikki avain, eli kenttä nimeltään _key_. 

Lisätään avaimet: 

```react
const App = (props) => {
  const { notes } = props;
  const rivit = () => notes.map(note => <li key={note.id}>{note.content}</li>)

  return(

    <div >
      <h1>Muistiinpanot</h1>
      <ul>
        {rivit()}
      </ul>
    </div >
  )
}
```

Virheilmoitus katoaa. 

React käyttää taulukossa olevien elementtien avain-kenttiä päätellessään miten sen tulee päivittää komponentin generoimaa näkymää silloin kun komponentti uudelleenrenderöidään. Lisää aiheesta [täällä](https://reactjs.org/docs/reconciliation.html#recursing-on-children).

### antipattern: taulukon indeksit avaimina

Olisimme saaneet konsolissa olevan varoituksen katoamaan myös käyttämällä avaimina taulukon indeksejä. Indeksit selviävät käyttämällä map-metodissa myös toista parametria:

```js
notes.map((note, i) => ...)
```

näin kutsuttaessa _i_ saa arvokseen sen paikan indeksin taulukossa, missä _note_ sijaitsee. 

Eli virheilmoitukset poistuva tapa määritellä rivien generointi on

```js
const rivit = () => notes.map((note, i) => <li key={i}>{note.content}</li>)
```

Tämä **ei kuitenkaan ole suositeltavaa** ja voi näennäisestä toimimisestaan aiheuttaa joissakin tilanteissa pahoja ongelmia. Lue lisää esim. [täältä](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)

### refaktorointia - moduulit

Siistitään koodia hiukan. Koska olemme kiinnostuneita ainoastaan propsien kentästä _notes_, otetaan se vastaan suoraan [destrukturointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) hyödyntäen.

Erotetaan yksittäisen muistiinpanon esittäminen oman komponenttinsa _Note_ vastuulle: 

```react
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
} 

const App = ({ notes }) => {
  return(
    <div >
      <h1>Muistiinpanot</h1>
      <ul>
        {notes.map(note=><Note key={note.id} note={note}/>)}
      </ul>
    </div >
  )
}
```

Huomaa, että avain-attribuutti täytyy nyt määritellä _Note_-komponenteille, eikä _li_-tageille kuten ennen muutosta. 

Koko React-sovellus on mahdollista määritellä samassa tiedostossa, mutta se ei luonnollisesti ole järkevää. Usein käytäntönä on määritellä yksittäiset komponentit omassa tiedostossaan _ES6-moduuleina_.

Koodissamme on käytetty koko ajan moduuleja. Tiedoston ensimmäiset rivit

```js
import React from 'react'
import ReactDOM from 'react-dom'
```

[importtaavat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) eli ottavat käyttöönsä kaksi moduulia. Moduuli _react_ sijoitetaan muuttujan _React_ ja _react-dom_ muuttujaan _ReactDOM_.


Siirretään nyt komponentti _Note_ omaan moduliinsa. 

Pienissä sovelluksissa komponentit sijoitetaan yleensä _src_-hakemiston alle sijoitettavaan hakemistoon _components_. Konventiona on nimetä tiedosto komponentin mukaan, eli ttehdään hakemisto _components_ ja sinne tiedosto _Note.js_ jonka sisältö on seuraava:

```react
import React from 'react'

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

Koska kyseessä on React-komponentti, tulee React importata komponentissa. 

Moduulin viimeisenä rivinä [eksportataan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) määritelty komonentti, eli muuttuja _Note_.

Nyt komponenttia käyttävä tiedosto _index.js_ voi [importata](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) moduulin:

```react
import React from 'react'
import ReactDOM from 'react-dom'
import Note from './components/Note'
```

Moduulin eksporttaama komponentti on nyt käytettävissä muuttujassa _Note_ täysin samalla tavalla kuin aiemmin.

Koska myös _App_ on komponentti, eristetään sekin omaan moduliinsa. Koska kyseessä on sovelluksen juurikomponentti, sijoitetaan se suoraan hakemistoon _src_, sisältö on seuraava:

```react
import React from 'react';
import Note from './components/Note'

const App = ({ notes }) => {
  return (
    <div >
      <h1>Muistiinpanot</h1>
      <ul>
        {notes.map(note => <Note key={note.id} note={note} />)}
      </ul>
    </div >
  )
}

export default App
```

Tiedoston _index.js_ sisällöksi jää:

```react
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const notes = [
  ...
]

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
) 
```
Moduuleilla on paljon muutakin käyttöä kuin mahdollistaa komponenttien määritteleminen omissa tiedostoissaan, palaamme moduuleihin tarkemmin myöhemmin kurssilla.

## lomakkeet

Jatketaan sovelluksen laajentamista siten, että se mahdollistaa uusien muistiinpanojen lisäämisen.

Jotta saisimme sivun päivittymään uusien muistiinpanojen lisäyksen yhteydessä, on parasta sijoittaa muistiinpanot komponentin _App_ tilaan. Funktionaalisilla komponenteilla ei ole tilaa, joten muutetaan _App_ luokkaan perustuvaksi komponentiksi:

```react
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      notes: props.notes 
    }
  }

  render() {
    return(
      <div >
        <h1>Muistiinpanot</h1>
        <ul>
          {this.state.notes.map(note => <Note key={note.id} note={note} />)}
        </ul>
      </div>
    ) 
  }
}
```

Konstruktori asettaa nyt propseina saatavan _notes_-taulukon tilaan avaimen _notes_ arvoksi:

```js
  constructor(props) {
    super(props)
    this.state = { 
      notes: props.notes 
    }
  }
```  

tila siis näyttää seuraavalta komponentin alustuksen jälkeen seuraavalta:

```js
this.state = {
  notes: [
    {
      id: 1,
      content: "HTML on helppoa",
      date: "2017-12-10T17:30:31.098Z",
      important: true
    }
    //...
  ]
}
```

Lisätään sitten lomake uusen muistiinpanon lisäämistä varten:

```react
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      notes: props.notes 
    }
  }

  addNote = (e) => {
    e.preventDefault()
    console.log('nappia painettu')
  }

  render() {
    return(
      <div >
        <h1>Muistiinpanot</h1>
        <ul>
          {this.state.notes.map(note => <Note key={note.id} note={note} />)}
        </ul>
        <form onSubmit={this.addNote}>
          <input/>
          <button>tallenna</button>
        </form>
      </div >
    ) 
  }
}
```

Lomakkeelle on lisätty myös tapahtumankäsittelijäksi metodi _addNote_ reagoimaan sen "lähettämiseen", eli napin painamiseen.

Tapahtumankäsittelijä on tuttuun tapaan määritelty seuraavasti:

```js
  addNote = (e) => {
    e.preventDefault()
    console.log('nappia painettu')
    console.log(e.target)  
  }
```

Parametrin _e_ arvona on metodin kutsun aiheuttama [tapahtuma](https://reactjs.org/docs/handling-events.html). 

Tapahtumankäsittelijä kutsuu heti tapahtumalle metodia <code>e.preventDefault()</code> jolla se estää lomakkeen lähetyksen oletusarvoisen toiminnan joka aiheuttaisi sivun uudelleenlatautumisen. 

Tapahtuman kohde, eli _e.target_ on tulostettu konsoliin

![]({{ "/assets/2/2.png" | absolute_url }})

Kohteena on siis komponentin määrittelemä lomake.

Miten pääsemme käsiksi lomakkeen _input_-komponenttiin syötettyyn dataan?

Tapoja on useampia, tutustumme ensin ns. [kontrolloituina komponentteina](https://reactjs.org/docs/forms.html#controlled-components) toteutettuihin lomakkeisiin.

Lisätään komponentin _App_ tilaan kenttä _new_note_ lomakkeen syötettä varten:

```js
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      notes: props.notes,
      new_note: 'uusi muistiinpano...'
    }
  }
  // ...
}
```

Määritellään tilaan lisätty kenttä _input_-komponentin attribuutin _value_ arvoksi:

```html
    <form onSubmit={this.addNote}>
      <input value={this.state.new_note} />
      <button>tallenna</button>
    </form>
```

Tilaan määritelty "palceholder"-teksi ilmestyy syötekomponenttiin, tekstiä ei kuitenkaan voi muuttaa. Konsoliin tuleekin ikävä varoitus joka keroo mistä on kyse

![]({{ "/assets/2/4.png" | absolute_url }})



## datan haku palvelimelta

### npm-riippuvuus, axios

### selain suoritusympäristönä

### promise

### elinsyklimetodi

## datan lähetys

## tyylien lisääminen