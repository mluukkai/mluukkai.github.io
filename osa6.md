---
layout: page
title: osa 6
permalink: /osa6/
---

<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>

  <p>Osan on tavoitteena valmistua lauantaina 6.1.</p>
</div>


## Osan 6 oppimistavoitteet

- Redux
  - Combined reducers
  - Asynkroniset actionit
- React+redux
  - connect
- React
  - presenter/container-patterni
  - High order -komponentit
  - React router
  - Inline styles

## Muistiinpano-svelluksen refaktorointia

Jatketaan osan 5 loppupuolella tehdyn muistiinpanosovelluksen yksinkertaistetun [redux-version](osa5/#Redux-muistiinpanot) laajentamista.

Sovelluksen tämänhetkinen koodi on [githubissa](https://github.com/mluukkai/redux-simplenotes/tree/v5-6) tagissä _v5-6_.

Tehdään koodiin muutamia rakenteellisia muutoksia. Siirretään reducerin määrittelevä tiedosto _noteReducer.js_ hakemiston _src/reducers_-alle.

Sovelluskehitystä helpottaaksemme laajennetaan reduceria siten, että storelle määritellään alkutila, jossa on pari muistiinpanoa:

```js
const initalState = [
  { content: 'reduxin storen toiminnan määrittelee reduceri', important: true, id: 1},
  { content: 'storen tilassa voi olla mielivaltaista dataa', important: false, id: 2}
]
const noteReducer = (state = initalState, action) => {
  // ...
}

export default noteReducer
```

Siirretään [action creatiorit](osa4/#action-creatorit), eli sopivia [action](https://redux.js.org/docs/basics/Actions.html)-olioita generoivat apufunktiot reducerin kanssa samaan moduuliin:

```js
const initalState = [
  // ...
]

const noteReducer = (state = initalState, action) => {
  // ...
}

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

export const noteCreation = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const constimportanceToggling = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}

export default noteReducer
```

Moduulissa on nyt useita [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)-komentoja.

Reducer-funktio palautetaan edelleen komennolla _export default_. Tämän ansiosta reducer importataan (tiedostossa _index.js_) tuttuun tapaan:

```js
import noteReducer from './reducers/noteReducer'
```

Moduulilla voi olla vain _yksi default export_, mutta useita "normaaleja" exporteja, kuten _Action creator_ -funktiot esimerkissämme

```js
export const noteCreation = (content) => {
  // ...
}

export const constimportanceToggling = (id) => {
  // ...
}
```

Normaalisti exportattujen funktioiden käyttöönotto tapahtuu aaltosulkusyntaksilla:

```js
import { noteCreation, constimportanceToggling } from './../reducers/noteReducer'
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/mluukkai/redux-simplenotes/tree/v6-1) tagissä _v6-1_.

## Monimutkaisempi tila storessa

Toteutetaan sovellukseen näytettävien muistiinpanojen filtteröinti, jonka avulla näytettäviä muistiinpanoja voidaan rajata. Filtterin toteutus tapahtuu [radiobuttoneiden avulla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)

![]({{ "/assets/6/1.png" | absolute_url }})

Alitetaan todella suoraviivaisella toteutuksella:

```react
class App extends React.Component {
  filterClicked = (value) => (e) => {
    console.log(value)
  }
  render() {
    return (
      <div>
        <NoteForm />
        <div>
          kaikki    <input type="radio" name="filter"
                      onChange={this.filterClicked('ALL')}/>
          tärkeät   <input type="radio" name="filter"
                      onChange={this.filterClicked('IMPORTANT')}/>
          eitärkeät <input type="radio" name="filter"
                      onChange={this.filterClicked('NONIMPORTANT')}/>
        </div>
        <NoteList />
      </div>
    )
  }
}
```

Koska painikkeiden attribuutin _name_ arvo on kaikilla sama, muodostavat ne _nappiryhmän_, joista ainoastaan yksi voi olla kerrallaan valittuna.

Napeille on määritelty muutoksenkäsittelijä, joka tällä hetkellä ainoastaan tulostaa painettua nappia vastaavan merkkijonon konsoliin.

Päätämme toteuttaa filtteröinnin siten, että talletamme muistiinpanojen lisäksi sovelluksen storeen myös _filtterin arvon_. Eli muutoksen jälkeen storessa oleva tila olisi näyttäisi seuraavalta:

```js
{
  notes: [
    { content: 'reduxin storen toiminnan määrittelee reduceri', important: true, id: 1},
    { content: 'storen tilassa voi olla mielivaltaista dataa', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

Tällä hetkellähän tilassa on ainoastaan muistiinpanot sisältävä taulukko. Uudessa ratkaisussa tilalla on siis kaksi avainta _notes_ jonka arvona muistiinpanot ovat sekä _filter_ jonka arvona on merkkijono joka kertoo mitkä muistiinpanoista tulisi näyttää ruudulla.

### Yhdisteyt reducerit

Voisimme periaatteessa muokata olemassaolevaa reduceria ottamaan huomioon muuttuneen tilanteen. Parempi ratkaisu on kuitenkin määritellä tässä tilanteessa uusi, filtterin arvosta huolehtiva reduceri:

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter
    default:
      return state
  }
}
```

Filterin arvon asettavat actionit ovat siis muotoa

```js
{
  type: 'SET_FILTER',
  filter: 'IMPORTANT'
}
```

Määritellään samalla myös sopiva _action creator_ -funktio. Sijoitetaan koodi moduuliin _src/reducers/filterReducer.js_:

```js
const filterReducer = (state = 'ALL', action) => {
  // ...
}

export const filterChange = (filter) => {
  return {
    type: 'SET_FILTER',
    filter
  }
}

export default filterReducer
```

Saamme nyt muodostettua varsinaisen reducerin yhdistämällä kaksi olemassaolevaa funktion (combineReducers)[https://redux.js.org/docs/recipes/reducers/UsingCombineReducers.html] avulla.

Määritellään yhdistetty reduceri tiedostossa _index.js_:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.render(
  <Provider store={store}>
    <div> </div>
  </Provider>,
document.getElementById('root'))
```

Koska sovelluksemme hajoaa tässä vaiheessa täysin, renderöidään komponentin _App_ sijasta tyhjä _div_-elementti.

Konsoliin tulostuu storen tila:

![]({{ "/assets/6/2.png" | absolute_url }})

eli store on juuri siinä muodossa missä haluammekin sen olevan!

Tarkastellaan vielä yhdisteytyn reducerin luomista

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})
```

Näin tehdyn reducerin määrittelemän storen tila on olio, jossa on kaksi kenttä _notes_ ja _filter_. Tilan kentän _notes_ arvon määrittelee _noteReducer_ jonka ei tarvitse välittää mitään tilan muista kentistä.

Ennen muun koodin muutoksia, kokeillaan vielä konsolista, miten actionit muuttavat yhdistetyn reducerin muodostamaa staten tilaa:

```js
//...
import noteReducer, { noteCreation } from './reducers/noteReducer'
import filterReducer, { filterChange } from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)
store.subscribe(() =>
  console.log(store.getState())
)
console.log(store.getState())
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(noteCreation('combineReducers muodostaa yhdistetyn reducerin'))
```

Konsoliin tulostuu storen tila:

![]({{ "/assets/6/3.png" | absolute_url }})

Jo tässä vaiheessa kannattaa laittaa mieleen tärkeä detalji. Jos lisäämme molempien reducerien alkuun konsoliin tulostuksen:

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action)
  // ...
}
```

Näyttää konsolin perusteella siltä, että jokainen action kahdentuu:

![]({{ "/assets/6/4.png" | absolute_url }})

Onko koodissa bugi? Ei. Yhdistetty reducer toimii siten, että jokainen _action_ käsitellään _kaikissa_ yhdistetyn reducerin osissa. Usein, kuten sovelluksessamme, tietystä actionista on kiinnostunut vain yksi reduceri, on kuitenkin tilanteita, joissa useampi reduceri muuttaa hallitsemaansa staten tilaa jonkin actionin seurauksena.

### Sovelluksen viimeistely

Viimeistellään nyt sovellus käyttämään yhdistettyä raduceria. Korjataan ensin bugi, joka johtuu siitä, että koodi olettaa storen tilan olevan mustiinpanojen joukko:

![]({{ "/assets/6/5.png" | absolute_url }})

Korjaus komponenttiin _NoteList_ on helppo. Viitteen <code>this.context.store.getState()</code> sijaan kaikki muistiinpanot sisältävään taulukkoon viitataan <code>this.context.store.getState().notes</code>.

Ennakoiden tulevaa on eriytetty näytettävien muistiinpanojen selvittämisen huolehtiminen funktioon _notesToShow_ joka tässä vaiheessa palauttaa kaikki muistiinpanot:

```js
class NoteList extends React.Component {

  render() {
    const notesToShow = () => {
      return this.context.store.getState().notes
    }

    return (
      <ul>
        {notesToShow().map(note =>
          <Note
            key={note.id}
            note={note}
            handleClick={this.toggleImportance(note.id)}
          />
        )}
      </ul>
    )
  }
}
```

Eriytetään näkyvyyden säätelyfiltteri omaksi komponentikseen:

```react
import React from 'react'
import PropTypes from 'prop-types'
import { filterChange } from '../reducers/filterReducer'

class VisibilityFilter extends React.Component {
  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  filterClicked = (value) => (e) => {
    this.context.store.dispatch(filterChange(value))
  }

  render() {
    return (
      <div>
        kaikki    <input type="radio" name="filter" onChange={this.filterClicked('ALL')} />
        tärkeät   <input type="radio" name="filter" onChange={this.filterClicked('IMPORTANT')} />
        eitärkeät <input type="radio" name="filter" onChange={this.filterClicked('NONIMPORTANT')} />
      </div>
    )
  }
}

VisibilityFilter.contextTypes = {
  store: PropTypes.object
}

export default VisibilityFilter
```

Toteutus on suoraviivainen, radiobuttonin klikkaaminen muuttaa storen kentän _filter_ tilaa.

Muutetaan vielä komponentin _NoteList_ metodi _notesToShow_ ottamaan huomioon filtteri

```js
const notesToShow = () => {
  const { notes, filter } = this.context.store.getState()
  if (filter === 'ALL') {
    return notes
  }

  return filter === 'IMPORTANT'
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important)
}
```

Huomaa miten storen tilan kentät on otettu destrukturoimalla apumuuttujiin

```js
const { notes, filter } = this.context.store.getState()
```

siis on sama kuin kuirjoittaisimme

```js
const notes = this.context.store.getState().notes
const filter = this.context.store.getState().filter
```

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/mluukkai/redux-simplenotes/tree/v6-2) tagissä _v6-2_.

Sovelluksessa on vielä pieni kauneusvirhe, vaikka oletusarvosesti filtterin arvo on _ALL_, eli näytetään kaikki muistiinpanot, ei vastaava radiobutton ole valittuna. Ongelma on luonnollisestikin mahdollista korjata, mutta koska kyseessä on ikävä, mutta harmiton feature, jätämme korjauksen myöhemmäksi.

## tehtäviä

Tee nyt tehtävät [100-](../tehtavat#yhdistetyt-reducerit)


## Connect

Kaikissa redux-storea käyttävissä komponenteissa on nyt runsaasti samaa koodia

```js
class ComponentUsingReduxStore extends React.Component {
  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

}

ComponentUsingReduxStore.contextTypes = {
  store: PropTypes.object
}
```

Vaikka rivit on helppo copy-pasteta aina uusiin komponentteihin, ei tämä ole tarkoituksenmukaista. Osan 5 luvussa [staten välittäminen propseissa ja contextissa](osa5/#staten-välittäminen-propseissa-ja-contextissa) myös varoiteltiin luottamasta liikaa Reactin Context APIin, se on kokeellinen ja saattaa poistua tulevissa versioissa. Contextia on siis ainakin tässä vaiheessa käytettävä varovasti.

[React Redux](https://github.com/reactjs/react-redux) -kirjaston määrittelemä funktio [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) on paras ratkaisu siitä, miten redux-store saadaan välitettyä React-componenteille.

Tutustutaan nyt connectin käyttöön.

Tutkitaan ensin komponenttia _NoteList_. Funktiota _connect_ käyttämällä "normaaleista" React-komponenteista saadaan muodostettua komponentteja, joiden _propseihin_ on yhdistetty haluttuja piirteitä _storesta_.

Muodostetaan ensin komponentista _NoteList_ connectin avulla yhdistetty komponentti:

```js
// ...
import { connect } from 'react-redux'

class NoteList extends React.Component {
  // ...
}

const ConnectedNoteList = connect()(NoteList)

export default ConnectedNoteList
```

Moduuli eksporttaa nyt alkuperäisen komponentin sijaan yhdistetyn komponentin joka toimii toistaiseksi täsmälleen alkuperäisen komponentin kaltaisesti.

Komponentti tarvitsee storesta sekä muistiinpanojen listan, että filtterin arvon. Funktion _connect_ ensimmäisenä parametrina voidaan määritellä funktio _mapStateToProps_, joka liittää joitakin storen tilan perusteella määriteltyjä asioita connectilla muodostetun _yhdistetyn komponentin_ propseiksi.

Jos määritellän:

```js
const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter
  }
}

const ConnectedNoteList = connect(
  mapStateToProps
)(NoteList)

export default ConnectedNoteList
```

on komponentin sisällä mahdollista viitata storen tilan, esim. muistiinpanoihin suoraan propsin kautta _props.notes_ sen sijaan että käytettäisiin suoraan contextia muodossa _this.context.store.getState().notes_. Vastaavasti _props.filter_ viittaa storessa olevaan filter-kentän tilaan.

Komponentin _NoteList_ sisältö pelkistyy seuraavasti

```js
class NoteList extends React.Component {

  render() {
    const notesToShow = () => {
      const { notes, filter } = this.props
      if (filter === 'ALL') {
        return notes
      }

      return filter === 'IMPORTANT'
        ? notes.filter(note => note.important)
        : notes.filter(note => !note.important)
    }

    // ...
  }
}
```

_NoteList_ viittaa edelleen suoraan kontekstin kautta storen metodiin _dispatch_, jota se tarvitsee action creatorin _importanceToggling_ avulla tehdyn actionin dispatchaamiseen:

```js
toggleImportance = (id) => (e) => {
  this.context.store.dispatch(
    importanceToggling(id)
  )
```

Connect-funktion toisena parametrina voidaan määritellä _mapDispatchToProps_ eli joukko action creator -funktioita, jotka välitetään yhdistetylle komponentille propseina. Laajennetaan connectausta seuraavasti

```js
const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter
  }
}

const mapDispatchToProps = {
  importanceToggling
}

const ConnectedNoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteList)

export default ConnectedNoteList
```

Nyt komponentti voi dispatchata suoraan action creatorin _importanceToggling_ määritteleän actionin kutsumalla prosien kautta saamaansa funktiota koodissa:

```js
class NoteList extends React.Component {
  toggleImportance = (id) => (e) => {
    this.props.importanceToggling(id)
  }

  // ...
}
```

Koska komponentti saa storeen liittyvät asiat propseina, voidaan koodista poistaa metodit _componentDidMount_ ja _componentWillUnMount_ jotka huolehtivat komponentin uudelleenrenderöitymisestä storen tilan muuttuessa. Connect tekee tämän puolestamme.

Komponentti _NoteList_ ei tarvitse storea enää mihinkään, se saa kaiken tarvitsemansa propseina _connect_-funktion ansiosta. Komponentti ei käytä enää suoraan contextia joten koodi ykinkertaistuu seuraavaan muotoon:

```react
import React from 'react'
import { importanceToggling } from './../reducers/noteReducer'
import { connect } from 'react-redux'

class NoteList extends React.Component {

  render() {
    const notesToShow = () => {
      const { notes, filter } = this.props
      if (filter === 'ALL') {
        return notes
      }

      return filter === 'IMPORTANT'
        ? notes.filter(note => note.important)
        : notes.filter(note => !note.important)
    }

    return (
      <ul>
        {notesToShow().map(note =>
          <Note
            key={note.id}
            note={note}
            handleClick={(e) => this.props.importanceToggling(note.id)}
          />
        )}
      </ul>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter
  }
}

export default connect(
  mapStateToProps,
  { importanceToggling }
)(NoteList)
```

Koodi sisältää pari muutakin oikaisua, mm. apumetodista _toggleImportance_ on hankkiuduttu eroon.
Itseasiassa komponentti on nyt niin yksinkertainen että se voitaisiin määritellä funktionaalisena komponenttina, emme kuitenkaan tee muutosta nyt.

Otetaan vielä connect käyttöön uuden muistiinpanon luomisessa:

```react
import React from 'react'
import { noteCreation } from './../reducers/noteReducer'
import { connect } from 'react-redux'

class NoteForm extends React.Component {

  addNote = (e) => {
    e.preventDefault()
    this.props.noteCreation(e.target.note.value)
    e.target.note.value = ''
  }

  render() {
    return (
      <form onSubmit={this.addNote}>
        <input name='note' />
        <button>lisää</button>
      </form>
    )

  }
}

export default connect(
  null,
  { noteCreation }
)(NoteForm)
```

Koska komponentti ei tarvitse storen tilasta mitään, on funktion _connect_ ensimmäinen parametri _null_.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/mluukkai/redux-simplenotes/tree/v6-3) tagissä _v6-3_.

Connect on erittäin kätevä työkalu, mutta abstraktiutensa takia kenties käsitteellisesti haastavin kurssin tähänastisista asioista.

Viimeistään nyt kannattaa katsoa kokonaisuudessaan Egghead.io:ta Reduxin kehittäjän Dan Abramovin loistava tuoriaali [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux). Neljässä viimeisessä videossa käsitellään _connect_-metodia.

Siinä vaiheessa kun videot on tehty, connectin käyttö oli asteen verran nykyistä hankalampaa, sillä esimerkeissä käyttämämme tapa määritellä connection toinen parametri _mapDispatchToProps_ suoraan _action creator_ -funktioiden avulla ei ollut vielä mahdollinen. Katsotaan seuraavassa luvussa lyhyesti vaihtoehtoista, "hankalampaa" tapaa, sitä näkee usein vanhemmassa react-koodissa, joten sen tunteminen on oleellista.

### fromDispatchToProps

Määrittelimme siis connectin komponentille _NoteForm_ antamat actioneja dispatchaavat funktiot seuraavasti:

```bash
class NoteForm extends React.Component {
  // ...
}

export default connect(
  null,
  { noteCreation }
)(NoteForm)
```

Eli määrittelyn ansiosta komponentti dispatchaa actionin suoraan komennolla _this.props.noteCreation('uusi muistiinpano')_.

Määrittely onnistui koska _noteCreation_ palauttaa _action_-olion.

Voimme määritellä saman myös "pitemmän kaavan" kautta, antamalla _connectin_ toisena parametrina seuraavanlaisen _funktion_:

```bash
class NoteForm extends React.Component {
  // ...
}

const mapDispatchToProps = (dispatch) => {
  return {
    createTodo: (value) => {
      dispatch(noteCreation(value))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(NoteForm)
```

Funktio _mapDispatchToProps_ pääsee parametrinsa kautta käsiksi storen _dispatch_-funktioon. Funktion paluuarvona on olio, joka määrittelee joukon funktioita, jotka annetaan connectattavalle komponentille propsiksi. Esimerkkimme määrittelee propsin _createTodo_ olevan funktio

```js
(value) => {
  dispatch(noteCreation(value))
}
```

eli action creatorilla luodun actionin dispatchaus.

Komponentti siis viitata funktioon propsin _this.props.createTodo_ kautta:

```bash
class NoteForm extends React.Component {

  addNote = (e) => {
    e.preventDefault()
    this.props.createTodo(e.target.note.value)
    e.target.note.value = ''
  }

  render() {
    return (
      <form onSubmit={this.addNote}>
        <input name="note" />
        <button>lisää</button>
      </form>
    )
  }
}
```

Konsepti on hiukan monimutkaisen ja sen selittäminen sanallisesti on haastavaa. Kannattaa katsoa huolellisesti Dan Abramovin videot ja koittaa miettiä mistä on kyse.

Useimmissa tapauksissa riittää _mapDispatchToProps_:in yksinkertaisempi muoto. On kuitenkin tilanteita, joissa monimutkaisempi muoto on tarpeen, esim. jos määriteltäessä propseiksi mäpättyjä _dispatchattavia actioneja_ on [viitata komponentin omiin propseihin](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931).

## Presentational/Container revisited

Komponentti _NoteList_ käyttää apumetodia _notesToShow_, joka päättelee filtterin perusteella näytettävien muistiinpanojen listan:

```js
const notesToShow = () => {
  const { notes, filter } = this.props
  if (filter === 'ALL') {
    return notes
  }

  return filter === 'IMPORTANT'
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important)
}
```

Komponentin on tarpeetonta sisältää kaikkea tätä logiikkaa, eli päätetään eriyttää se komponentin ulkopuolelle _connect_-metodin parametrin _mapStateToProps_ yhteyteen. Muutetaan komponentti samalla funktionaaliseksi:

```react
const NoteList = (props) => (
  <ul>
    {props.visibleNotes.map(note =>
      <Note
        key={note.id}
        note={note}
        handleClick={(e) => props.importanceToggling(note.id)}
      />
    )}
  </ul>
)

const notesToShow = (notes, filter) => {
  if (filter === 'ALL') {
    return notes
  }
  return filter === 'IMPORTANT'
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important)
}

const mapStateToProps = (state) => {
  return {
    visibleNotes: notesToShow(state.notes, state.filter)
  }
}

export default connect(
  mapStateToProps,
  { importanceToggling }
)(NoteList)
```

Nyt _NoteList_ keskittyy lähes ainoastaan muistiinpanojen renderöimiseen, se on hyvin lähellä sitä minkä sanotaan olevan [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)-komponentti.

Dan Abramovin [sanoin](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), _presentational_-komponentit:
-Are concerned with how things look.
- May contain both presentational and container components** inside, and usually have some DOM markup and styles of their own.
- Often allow containment via this.props.children.
- Have no dependencies on the rest of the app, such Redux actions or stores.
- Don’t specify how the data is loaded or mutated.
- Receive data and callbacks exclusively via props.
- Rarely have their own state (when they do, it’s UI state rather than data).
- Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.

Connect-metodin avulla muodostettu _yhdistetty komponentti_

```js
const notesToShow = (notes, filter) => {
  if (filter === 'ALL') {
    return notes
  }
  return filter === 'IMPORTANT'
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important)
}

const mapStateToProps = (state) => {
  return {
    visibleNotes: notesToShow(state.notes, state.filter)
  }
}

connect(
  mapStateToProps,
  { importanceToggling }
)(NoteList)
```

taas on selkeästi _container_-komponentti.

[Lainataan](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) taas Dan Abramovia, _container_-komponentit:

- Are concerned with how things work.
- May contain both presentational and container components** inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provide the data and behavior to presentational or other container components.
- Call Redux actions and provide these as callbacks to the presentational components.
- Are often stateful, as they tend to serve as data sources.
- Are usually generated using higher order components such as connect() from React Redux, rather than written by hand.

Komponenttien presentational vs. container -jaottelu on eräs hyväksi havaittu tapa strukturoida React-applikaatioita. Jako voi olla toimiva tai sitten ei, kaikki riippuu kontekstista.

Abramov mainitsee jaon [eduiksi](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) seuraavat
- Better separation of concerns. You understand your app and your UI better by writing components this way.
- Better reusability. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused.
- Presentational components are essentially your app’s “palette”. You can put them on a single page and let the designer tweak all their variations without touching the app’s logic. You can run screenshot regression tests on that page.

Abramov mainitsee termin [high order component](https://reactjs.org/docs/higher-order-components.html). Esim. _NoteList_ on normaali komponentti, React-reduxin taas _connect_ metodi määrittelee _high order komponentin_, eli käytännössä funktio, joka haluaa parametrikseen komponentin muuttuakseen "normaaliksi" komponentiksi.

High order componentit eli HOC:t ovatkin yleinen tapa määritellä geneerinen toiminnallisuus, joka sitten erikoistetaan esim. ulkoasultaan parametrina olevan komponentin avulla. Kyseessä on funktionaalisen ohjelmoinnin hieman perintää muistuttava käsite.

HOC:it ovat oikeastaan käsitteen [High Order Function](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) yleistys. HOF:eja ovat sellaiset funkiot, jotka joko ottavat parametrikseen tai palauttavat funkioita. Olemme siis käyttäneet HOF:eja pitkin kurssia, esim. lähes kaikki taulukoiden käisttelyyn tarkoitetut metodit, kuten _map_ ovat HOF:eja, samoin jo monta kertaa käyttämämme funktioita palauttavat (eli kahden nuolen) funktiot, esim.

```js
filterClicked = (value) => (e) => {
  this.props.filterChange(value)
}
```

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/mluukkai/redux-simplenotes/tree/v6-4) tagissä _v6-4_.

Mukana on myös edellisestä unohtunut _VisibilityFilter_-komponentin _connect_-funktiota käyttävä versio, jota on myös paranneltu siten, että nappi _kaikki_ on oletusarvoisesti valittuna. Koodissa on pieni ikävä copypaste mutta kelvatkoon.

## Tehtäviä

Tee nyt tehtävät [97-99](../tehtavat#redux-anekdootit)

## Redux-sovelluksen kommunikointi palvelimen kanssa

Laajennetan sovellusta siten, että muistiinpanot talletetaan backendiin. Käytetään osasta 2 tuttua [json-serveriä](osa2/#Datan-haku-palvelimelta).

Tallennetaan projektin juuren tiedostoon _db.js_ tietokannan alkutila:

```json
{
  "notes": [
    {
      "content": "reduxin storen toiminnan määrittelee reduceri",
      "important": true,
      "id": 1
    },
    {
      "content": "storen tilassa voi olla mielivaltaista dataa",
      "important": false,
      "id": 2
    }
  ]
}
```

ja käynnistetään json-server porttiin 3001:

```bash
json-server --port 3001 db.js
```

Tehdään sitten tuttuun tapaan _axiosia_ hyödyntävä backendistä dataa hakeva metodi tiedostoon _services/notes.js_

```js
import axios from 'axios'

const getAll = async () => {
  const response = await axios.get('http://localhost:3001/notes')
  return response.data
}

export default { getAll }
```

Muutetaan _nodeReducer_:issa tapahtuva muistiinpanojen tilan alustusta, siten että oletusarvoisesti mustiinpanoja ei ole:

```js
const noteReducer = (state = [], action) => {
  // ...
}

```

Nopea tapa saada storagen tila alustettua palvelimella olevan datan perusteella on hakea muistiinpanot tiedostossa _index.js_ ja dispatchata niille yksitellen action _NEW_NOTE_:

```js
// ...
import noteService from './services/notes'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

noteService.getAll().then(notes =>
  notes.forEach(note => {
    store.dispatch({ type: 'NEW_NOTE', data: note})
  })
)

// ...
```

Lisätään reduceriin tuki actionille _INIT_NOTES_, jonka avulla alustus voidaan tehdä dispatchaamalla yksittäinen action. Luodaan myös sitä varten oma action creator -funktio _noteInitialization_:

```js
// ...
const noteReducer = (state = [], action) => {
  console.log('ACTION: ', action)
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'INIT_NOTES':
      return action.data
    // ...
  }
}

export const noteInitialization = (data) => {
  return {
    type: 'INIT_NOTES',
    data
  }
}

// ...
```

_index.js_ yksinkertaistuu:

```js
import noteReducer, { noteInitialization} from './reducers/noteReducer'
// ...

noteService.getAll().then(notes =>
  store.dispatch(noteInitialization(notes))
)
```

Päätetään kuitenkin siirtää muistiinpanojen alustus _App_-komponentin metodiin _componentWillMount_, se on luonteva paikka alustuksille, sillä metodi suoritetaan ennen kuin soveluksemme renderöidään ensimmäistä kertaa.

Jotta saamme action creatorin _noteInitialization_ käyttöön komponentissa _App_ tarvitsemme jälleen _connect_-metodin apua:

```js
import React from 'react'
import NoteForm from './components/NoteForm.js'
import NoteList from './components/NoteList.js'
import VisibilityFilter from './components/VisibilityFilter'
import { connect } from 'react-redux'
import { noteInitialization } from './reducers/noteReducer'
import noteService from './services/notes'

class App extends React.Component {
  componentWillMount() {
    noteService.getAll().then(notes =>
      this.props.noteInitialization(notes)
    )
  }

  render() {
    return (
      <div>
        <NoteForm />
        <VisibilityFilter />
        <NoteList />
      </div>
    )
  }
}

export default connect(
  null,
  { noteInitialization }
)(App)
```

Näin funktio _noteInitialization_ tulee komponentin _App_ propsiksi _this.props.noteInitialization_ ja sen kutsumiseen ei tarvita _dispatch_-metodia koska _connect_ hoitaa asian puolestamme.

Voisimme toimia samoin myös uuden muistiinpanon luomisen suhteen. Laajennetaan palvelimen kanssa kommunikoivaa koodia:

```
const url = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const createNew = async (note) => {
  const response = await axios.post(url, note)
  return response.data
}

export default {
  getAll, createNew
}
```

Komponentin _NoteForm_ metodi _addNote_ muuttuu hiukan:

```react
import React from 'react'
import { noteCreation } from './../reducers/noteReducer'
import { connect } from 'react-redux'
import noteService from '../services/notes'

class NoteForm extends React.Component {

  addNote = async (e) => {
    e.preventDefault()
    const content = e.target.note.value
    e.target.note.value = ''
    const newNote = await noteService.createNew(content)
    this.props.noteCreation(newNote)
  }

  render() {
    //...
  }
}

export default connect(
  null,
  {noteCreation}
)(NoteForm)
```

Koska backend generoi muistiinpanoille id:t, muutetaan action creator _noteCreation_ muotoon

```js
export const noteCreation = (data) => {
  return {
    type: 'NEW_NOTE',
    data
  }
}
```

Muistiinpanojen tärkeyden muuttaminen olisi mahdollista toteuttaa samalla periaatteella, eli tehdä palvelimelle ensin asynkroninen metodikutsu ja sen jälkeen dispatchata sopiva action.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/mluukkai/redux-simplenotes/tree/v6-5) tagissä _v6-5_.

### Asynkroniset actionit ja thunk

**HUOM** Tämä luku lienee kurssin käsitteellisesti haastavin. Voit alustavasti hypätä suoraan luvun yli.

Lähestymistapamme on ok, mutta siinä mielessä ikävä, että palvelimen kanssa kommunikointi tapahtuu komponenttien metodeissa. Olisi parempi, jos kommunikointi voitaisiin abstrahoida komponenteilta siten, että niiden ei tarvitsisi kuin kutsua sopivaa _action creatoria_, esim. _App_ alustaisi sovelluksen tilan seuraavasti:

```bash
class App extends React.Component {
  componentWillMount() {
    this.props.initializeNotes()
  }
  // ...
}
```

ja _NoteForm_ loisi uuden muitsiinpanon seuraavasti:

```bash
class NoteForm extends React.Component {

  addNote = async (e) => {
    e.preventDefault()
    const content = e.target.note.value
    e.target.note.value = ''
    this.props.createNote(newNote)
  }
}
```

Molemmat komponentit käyttäisivät ainoastaan propsina saamaansa funktiota, välittämättä siitä että taustalla tapahtuu todellisuudessa palvelimen kanssa tapahtuvaa kommunikoinia.

Asennetaan nyt [redux-thunk]()-kirjasto, joka mahdollistaa _asynkronisten actionien_ luomisen. Asennus tapahtuu komennolla:

```bash
npm install --save redux-thunk
```

redux-thunk-kirjasto on ns. _redux-middleware_ ja tiedostossa _index.js_ olevassa storen alustuksessa on määriteltävä että se otetaan käyttöön:

```bash
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)
```

Thunk-kirjaston ansiosta on mahdollista määritellä _action creatoreja_ siten, että ne palauttavat funktion. Creatorin palauttama saa parametrikseen storen _dispatch_-funktion.

Voimme nyt määritellä muistiinpanojen alkutilan palvelimelta hakevan action creatorin _initializeNotes_ seuraavati:

```bash
export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch({
      type: 'INIT_NOTES',
      data: notes
    })
  }
}
```

Sisemmässä funktiossaan, eli _asynkroonisessa actionissa_ operaatio hakee ensin palvelimelta kaikki muistiinpanot ja sen jälkeen _dispatchaa_ muistiinpanot storeen lisäävän actionin.

Uuden muistiinpanon lisäävä action creator _createNew_ on seuraavassa

```bash
export const createNew = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch({
      type: 'NEW_NOTE',
      data: newNote
    })
  }
}
```

Periaate on jälleen sama, ensin suoritetaan asynkroninen operaatio, ja sen valmistuttua _dispatchataan_ storen tilaa muuttava action.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/mluukkai/redux-simplenotes/tree/v6-6) tagissä _v6-6_. Githubin versiosta löytyy myös muistiinpanon muutoksen tärkeyden backendiin synkronoiva operaatio.

### debugger

## tehtäviä

Tee nyt tehtävät [97-99](../tehtavat#redux-anekdootit)

## React router


## tehtäviä

Tee nyt tehtävät [97-99](../tehtavat#redux-anekdootit)


## Inline-tyylit

## tehtäviä

Tee nyt tehtävät [97-99](../tehtavat#redux-anekdootit)

## Material UI

Tee nyt tehtävät [97-99](../tehtavat#redux-anekdootit)
