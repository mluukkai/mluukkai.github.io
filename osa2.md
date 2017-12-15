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

Koska määrittelimme syötekomponentille _value_-attribuutiksi komponentin _App_ tilassa olevan kentän, alkaa _App_ kontrolloimaan syötekomponentin toimintaa. 

Jotta syötekomponentin editoiminen tulisi mahdolliseksi, täytyy sille sille rekisteröidä tapahtumankäsittelijä, joka synkronoi syötekenttään tehdyt muutokset komponentin _App_ tilaan:

```react
class App extends React.Component {
  // ...

  handleNoteChange = (e) => {
    console.log(e.target.value)
    this.setState({ new_note: e.target.value })
  }

  render() {
    return(
      <div >
        <h1>Muistiinpanot</h1>
        <ul>
          {this.state.notes.map(note => <Note key={note.id} note={note} />)}
        </ul>
        <form onSubmit={this.addNote}>
          <input 
            value={this.state.new_note} 
            onChange={this.handleNoteChange}
          />
          <button>tallenna</button>
        </form>
      </div >
    ) 
  }
}
```

Lomakkeen _input_-komponentille on nyt rekisteröity tapahtumankäsittelijä tilanteeseen _onChange_. 

```html
    <input 
      value={this.state.new_note} 
      onChange={this.handleNoteChange}
    />
```

Tapahtumankäsittelijää kutsutaan aina kun syötekomponentissa tapahtuu jotain. Tapahtumankäsittelijämetodi saa pametriksi tapahtumaolion _e_ 

```js
  handleNoteChange = (e) => {
    console.log(e.target.value)
    this.setState({ new_note: e.target.value })
  }
```  

Tapahtumaolion kenttä _target_ vastaa nyt kontrolloitua _input_-kenttää ja _e.target.value_ viittaa inputin-kentän arvoon. Voit seurata konsolista miten tapahtumankäsittelijää kutsutaan:

![]({{ "/assets/2/.5png" | absolute_url }})

Nyt komponentin _App_ tilan kenttä _new_note_ heijastaa koko ajan syötekentän arvoa, joten voimme viimeistellä uuden muistiinpanon lisäämisestä huolehtivan metodin _addNote_:

```js
  addNote = (e) => {
    e.preventDefault()  
    const noteObject = {
      content: this.state.new_note,
      date: new Date().new,
      important: Math.random()>0.5
      id: this.state.notes.length + 1 
    }

    const notes = this.state.notes.concat(noteObject)

    this.setState({
      notes: notes,
      new_note: ''
    })
  }
```

Ensin luodaan uutta muistiinpanoa vastaava olio. Sen sisältökenttä saadaan komponentin tilasta _this.state.new_note_. Yksikäsitteinen tunnus eli _id_ generoidaan kaikkien muistiinpanojen lukumäärän perusteella. Koska muistiinpanoja ei poisteta, menetelmä toimii sovelluksessamme. Komennon <code>Math.random()</code> avulla muistiinpanosta tulee 50% todennäköisyydellä tärkeä. 

Uusi muistiinpano lisätään vanhojen joukkoon oikeaoppisesti käyttämällä [viime viikolta](/osa1#taulukon käsittelyä) tuttua metodia [concat](
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat). Metodi ei muuta alkuperäistä taulukkoa _this.state.notes_ vaan luo uuden taulukon, joka sisältää myös lisättävän alkion. 

Tila päivitetään uusilla muistiinpanoilla ja tyhjentämällä syötekomponentin arvoa kontrolloiva kenttä.

### kehittyneempi tapa olioliteraalien kirjoittamiseen

Voimme muuttaa tilan päivittämän koodin

```js
  this.setState({
    notes: notes,
    new_note: ''
  })
```

muotoon

```js
  this.setState({
    notes,
    new_note: ''
  })
```

Tämä johtuu siitä, että ES6:n myötä (ks. kohta [property definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)) javascriptiin on tullut uusi ominaisuus, joka mahdollistaa hieman tiiviimmän tavan määritellä olioita muuttujien avulla.

Tarkastellaan tilannetta, jossa meillä on muuttujissa arvoja

```js
  const name: 'Leevi'
  const age = 0
```

ja haluamme määritellä näiden perusteella olion, jolla on kentät _name_ ja _age_.

Vanhassa javascritpissä olio täytyi määritellä seuraavaan tapaan

```js
  const person = {
    name: name,
    age: age
  }
```

koska muuttujien ja luotavan olio kenttien nimi nyt on sama, riittää ES6:ssa kirjoittaa:

```js
  const person = { name, age }
```

lopputulos molemmilla tavoilla luotuun olioon on täsmälleen sama.

## näytettävien elementtien filtteröinti

Tehdään sovellukseen feature, joka mahdollistaa ainoastaan tärkeiden muistiinpanojen näyttämisen.

Lisätään koponentin _App_ tilaan tieto siitä näytetäänkö muistiinpanoista kaikki vai ainoastaan tärkeät:

```react
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      notes: props.notes ,
      new_note: '',
      showAll: true
    }
  }
  // ...
}
```

Muutetaan metodia _render_ siten, että se tallettaa muuttujaan _notesToShow_ näytettävien muistiinpanojen listan riippuen siitä tuleeko näyttää kaikki vai vain tärket:

```react
  render() {
    const notesToShow = this.state.showAll ? 
                          this.state.notes : 
                          this.state.notes.filter(note=>note.important === true ) 

    return(
      <div >
        <h1>Muistiinpanot</h1>
        <ul>
          {notesToShow.map(note => <Note key={note.id} note={note} />)}
        </ul>
        <form onSubmit={this.addNote}>
          <input 
            value={this.state.new_note} 
            onChange={this.handleNoteChange}
          />
          <button>tallenna</button>
        </form>
      </div >
    ) 
  }
```

Muuttujan _notesToShow_ määrittely on melko kompakti

```js
  const notesToShow = this.state.showAll ? 
                        this.state.notes : 
                        this.state.notes.filter(note=>note.important === true ) 
```

Käytössä on monissa muissakin kielissä oleva [ehdollinen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operaatio. 

Operaatio toimi seuraavasti. Jos meillä on esim:

```js
const tulos = ehto ? val1 : val2
```

muuttujan _tulos_ arvoksi asetetaan _val1_:n arvo jos _ehto_ on tosi. Jos _ehto_ ei ole tosi, muuttujan _tulos_ arvoksi tulee _val2_:n arvo.

Jos ehto _this.state.showAll_ on epätosi, muuttuja _notesToShow_ saa arvokseen vaan ne muistiinpanot, joiden _important_-kentän arvo on tosi. Filtteröinti tapahtuu taulukon metodilla [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter):

```js
this.state.notes.filter(note=>note.important === true ) 
```

vertailu-operaatio on oikeastaan turha koska _note.important_ on arvoltaan joko _true_ tai _false_, eli riittää kirjoittaa 

```js
this.state.notes.filter(note=>note.important) 
```

Tässä käytettiin kuitenkin ensin vertailua, mm. korostamaan erästä tärkeää seikkaa: Javasriptissa <code>arvo1 == arvo2</code> ei toimi kaikissa tilanteissa loogisesti ja onkin varmempi käyttää aina vertailuissa muotoa <code>arvo1 === arvo2</code>. Enemmän aiheesta [tällä](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

Filtteröinnin toimivuutta voi jo nyt kokeilla vaihelemalla sitä, miten tilan kentän _showAll_ alkuarvo määritelään konstruktorissa.

Lisätään sitten toiminnallisuus, mikä mahdollistaa _showAll_:in tilan muuttamisen sovelluksesta. 

Oleelliset muutokset ovat seuraavassa:

```react
class App extends React.Component {
  // ...

  toggleVisible = () => {
    this.setState({showAll: !this.state.showAll})
  }

  render() {
    const notesToShow = this.state.showAll ? 
                          this.state.notes : 
                          this.state.notes.filter(note=>note.important === true ) 

    const label = this.state.showAll ? 'vain tärkeät' : 'kaikki'

    return(
      <div >
        <h1>Muistiinpanot</h1>

        <div>
          <button onClick={this.toggleVisible}>
            näytä {label}
          </button>
        </div>

        <ul>
          {notesToShow.map(note => <Note key={note.id} note={note} />)}
        </ul>
        <form onSubmit={this.addNote}>
          <input 
            value={this.state.new_note} 
            onChange={this.handleNoteChange}
          />
          <button>tallenna</button>
        </form>
      </div >
    ) 
  }
}
```

Näkyviä muistiinpanoja (kaikki vai ainoastaan tärkeät) siis kontrolloidaan napin avulla. Napin tapahtumankäsittelijä on yksinkertainen, se muuttaa _this.state.showAll_:n arvon truesta falseksi ja päinvastoin:

```js
  toggleVisible = () => {
    this.setState({showAll: !this.state.showAll})
  }
```

Napin teksti määritellään muuttujaan, jonka arvo määräytyy tilan perusteella:

```js
    const label = this.state.showAll ? 'vain tärkeät' : 'kaikki'
```

## datan haku palvelimelta

### npm-riippuvuus, axios

### selain suoritusympäristönä

### promise

### elinsyklimetodi

## datan lähetys

## tyylien lisääminen