---
layout: page
title: osa 5
permalink: /osa5/
---

<div class="important">
  <h1>KESKEN, ÄLÄ LUE</h1>

  <p>Osan on tavoitteena valmistua tiistaina 2.1.</p>
</div>

## Osan 5 oppimistavoitteet

- React
  - child 
  - ref
  - PropTypes
- Frontendin testauksen alkeet
  - enzyme
  - shallow ja full DOM -rendering
- Redux
  - Flux-pattern
  - Storage, reducerit, actionit
  - Testaus mm deepfreeze
- React+redux
  - Storagen välittäminen propseilla ja kontekstissa
- Javascript
  - Spread-operaatio
  - Reduxin edellyttämästä funktionaalisesta ohjelmoinnista
    - puhtaat funktiot
    - immutable

##  Kirjautuminen React-sovelluksesta

Kaksi edellistä osaa keskittyi lähinnä backendin toiminnallisuudeen ja edellisessä osassa backendiin toteutettua käyttäjänhallintaa ei ole tällä hetkellä tuettuna frontendissa millään tavalla. 

Fronend näyttää tällä hetkellä olemassaolevat muistiinpanot ja antaa muuttaa niiden tilaa. Uusia muistiinpanoja ei kuitenkaan voi lisätä, sillä osan 4 muutosten myötä backend edellyttää, että lisäyksen mukana on käyttäjän identifioima token.

Toteutetaan nyt osa käyttäjienhallinnan edellyttämästä toiminnallisuudesta fronendiin. Aloitetaan käyttäjän kirjaantumisesta. Oletetaan toistaiseksi, että käyttäjät luodaan suoraan backendiin.

Sovelluksen yläosaan on nyt lisätty kirjautumislomake, myös uuden muistinpanon lisäämisestä huolehtiva lomake on siirretty sivun yläosaan:

![]({{ "/assets/5/1.png" | absolute_url }})

Komponentin _App_ koodi näyttää seuraavalta:

```react
import React from 'react'
import noteService from './services/notes'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      new_note: '',
      showAll: true,
      error: null,
      username: '',
      password: '',
      user: null
    }
  }

  componentWillMount() {
    noteService.getAll().then(notes =>
      this.setState({ notes })
    )
  }

  addNote = (e) => {
    e.preventDefault()
    const noteObject = {
      content: this.state.new_note,
      date: new Date(),
      important: Math.random() > 0.5,
    }

    noteService.create(noteObject).then(newNote => {
      this.setState({
        notes: this.state.notes.concat(newNote),
        new_note: ''
      })
    })
  }

  toggleImportanceOf = (id) => {
    // ...
  }

  login = (e) => {
    e.preventDefault()
    console.log('login in with', this.state.username, this.state.password)
  }

  handleNoteChange = (e) => {
    this.setState({ new_note: e.target.value })
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value })
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value })
  }

  toggleVisible = () => {
    this.setState({ showAll: !this.state.showAll })
  }

  render() {
    // ...

    return (
      <div>
        <h1>Muistiinpanot</h1>

        <Notification message={this.state.error} />

        <h2>Kirjaudu</h2>

        <form onSubmit={this.login}>
          <div>
            käyttäjätunnus
            <input
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
          </div>
          <div>
            salasana
            <input
              type='password'
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <button>kirjaudu</button>
        </form>

        <h2>Luo uusi muistiinpano</h2>

        <form onSubmit={this.addNote}>
          <input
            value={this.state.new_note}
            onChange={this.handleNoteChange}
          />
          <button>tallenna</button>
        </form>

        <h2>Muistiinpanot</h2>

        // ...

      </div >
    )
  }
}

export default App
```

Lomakkeen käsittely noudattaa samaa periaatetta, kun osassa 2 [osa2/#Lomakkeet]. Lomakkeen kenttiä varten on lisätty komponentin tilaan kentät _username_ ja _password_. Molemmille kentille on rekisteröity muutoksenkäsittelijä (_handleUsernameChange_ ja _handlePaswordChange_) joka synkronoi kenttään tehdyt muutokset ja komponentin _App_ tilan. Kirjautumislomakkeen lähettämisetä vastaava metodi _login_ ei tee vielä mitään.

Jos lomakkeella on paljon kenttiä, voi olla työlästä totettaa jokaiselle kentälle oma muutoksenkäsittelijä. React tarjoaakin tapoja, miten yhden muutoksenkäsittelijän avulla on mahdollista huolehtia useista syötekentistä. Jaetun käsittelijän on saatava jollain tavalla tieto minkä syötekentän muutto aiheutti tapahtuman. Eräs tapa tähän on lomakkeen syötekenttien nimeäminen.

Muutetaan lomaketta seuraavasti:

```html
<form onSubmit={this.login}>
  <div>
    käyttäjätunnus
    <input
      value={this.state.username}
      onChange={this.handleLoginFieldChange}
      name='username'
    />
  </div>
  <div>
    salasana
    <input
      type='password'
      value={this.state.password}
      onChange={this.handleLoginFieldChange}
      name='password'
    />
  </div>
  <button>kirjaudu</button>
</form> 
```

Yhteinen muutoksista huolehtiva tapahtumankäsittelijä on seuraava:

```js
handleLoginFieldChange = (e) => {
  if ( e.target.name === 'password') {
    this.setState({ password: e.target.value })
  } else if ( e.target.name === 'username') {
    this.setState({ username: e.target.value })
  }
}
```  

Tapahtumankäsittelijän parametrina olevan tapahtumaolion _e_ kentän _target.name_ arvona on tapahtuman aiheuttaneen komponentin _name_-attribuutti, eli joko _username_ tai _password_. Koodi haarautuu nimen perusteella ja asettaa tilaan oikean kentän arvon.

Javascriptissa on kuitenkin ES6:n myötä uusi syntaksi [computed property name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), jonka avulla olion kentän voi määritellä muuttujan avulla. Esim. seuraava koodi


```js
const field = 'name'

const object = { [field] : 'Arto Hellas' }
```

määrittelee olion <code>{ name: 'Arto Hellas'}</code>

Näin saamme eliminoitua if-lauseen tapahtumankäsittelijästä ja se pelkistyy yhden rivin mittaiseksi:

```js
handleLoginFieldChange = (e) => {
  this.setState({ [e.target.name]: e.target.value })
}
``` 

Kirjautuminen tapahtuu tekemällä HTTP POST -pyyntö palvelimen osoitteeseen _api/login_. Eristetään pyynnön tekevä koodi omaan moduuliin tiedostoon _services/login.js_

Käytetään nyt promisejen sijaan _async/await_-syntaksia HTTP-pyynnön tekemiseen:

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

Kirjautumisen käsittelystä huolehtiva metodi voidaan toteuttaa seuraavasti:

```js
  login = async (e) => {
    e.preventDefault()
    try{
      const user = await loginService.login({
        username: this.state.username, password: this.state.password
      })

      this.setState({ username: '', password: '', user})
    } catch(exception) {
      this.setState({
        error: 'käyttäjätunnus tai salasana virheellinen',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }
```

Kirjautumisen onnistuessa nollataan kirjautumislomakkeen kentät _ja_ talletetaan palvelimen vastaus (joka sisältää _tokenin_ sekä kirjautuneen käyttäjän tiedot) sovelluksen tilan kenttään _user_.

Jos kirjautuminen epäonnistuu, eli metodin _loginService.login_ suoritus aiheuttaa poikkeuksen, ilmoitetaan siitä käyttäjälle.

Onnistunut kirjautuminen ei nyt näy sovelluksen käyttäjälle mitenkään. Muokataan sovellusta vielä siten, että kirjautumislomake näkyy vain _jos käyttäjä ei ole kirjautuneena_ eli _this.state.user === null_ ja uuden muistiinpanon luomislomake vain _jos käyttäjä on kirjaantuneena_, eli (eli this.state.user_ sisältää kirjaantuneen käyttäjän tiedot:


```js
render() {
  // ...

  const loginForm = () => {
    if ( this.state.user !== null) {
      return null
    }

    return (
      <div>
        <h2>Kirjaudu</h2>

        <form onSubmit={this.login}>
          <div>
            käyttäjätunnus
            <input
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
              name='username'
            />
          </div>
          <div>
            salasana
            <input
              value={this.state.password}
              type='password'
              onChange={this.handleLoginFieldChange}
              name='password'
            />
          </div>
          <button>kirjaudu</button>
        </form>
      </div>
    )
  }

  const noteCreation = () => {
    if (this.state.user === null) {
      return null
    }

    return (
      <div>
        <div><em>{this.state.user.name} logged in</em></div>

        <h2>Luo uusi muistiinpano</h2>

        <form onSubmit={this.addNote}>
          <input
            value={this.state.new_note}
            onChange={this.handleNoteChange}
          />
          <button>tallenna</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h1>Muistiinpanot</h1>

      <Notification message={this.state.error} />

      {loginForm()}

      {noteCreation()}

      <h2>Muistiinpanot</h2>
    </div>  
  )
}
```

Lomakkeet generoiva koodi on nyt erotettu funktioihin, joissa lomakkeet generoidaan ehdollisesti, eli esim. login-lomake ainoastaan jos käyttäjä ei jo ole kirjautunut. Kirjautuneen käyttäjän nimi renderöidään hieman epätyylikkäästi muistiinpanojen luontiin tarkoitetun lomakkeen koodin generoivassa funktiossa.

Sovelluksemme pääkomponentti _App_ on tällä hetkellä jo aivan liian laaja ja nyt tekemämme muutos on aivan ilmeinen signaali siitä, että lomakkeet olisi syyt ärefaktoroida omiksi kompotenteikseen. Jätämme sen kuitenkin harjoitustehtäväksi.

## Muistiinpanojen luominen

Fronend on siis tallettanut onnistuneen kirjautumisen yhteydessä backendilta saamansa tokenin sovelluksen tilaan _this.state.user.token_.

Korjataan uusien muistiinpanojen luominen siihen muotoon, mitä backend edellyttää, eli lisätään kirjautuneen käyttäjän token HTTP-pyynnön Authorization-headeriin. 

_noteService_-moduuli muuttuu seuraavasti

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const create = async (newObject) => {
  const config = {
    headers: { 'Authorization': token }
  }  

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, update, setToken }
```

Moduulille on määritelty vain moduulin sisällä näkyvä muuttuja _token_ jolle voidaan asettaa arvo moduulin exporttaamalla funktiolla _setToken_. Async/await-syntaksiin muutettu _create_ asettaa moduulin tallessa pitämän tokenin _Authorization_-headeriin, jonka se antaa axiosille metodin _post_ kolmantena parametrina.

Kirjautumisesta huolehtivaa tapahtumankäsittelijää pitää vielä viilata sen verran, että kutsuu <code>noteService.setToken(user.token)</code> onnistuneen kirjautumisen yhteydessä: 

```js
  login = async (e) => {
    e.preventDefault()
    try{
      const user = await loginService.login({
        username: this.state.username, password: this.state.password
      })

      noteService.setToken(user.token)
      this.setState({ username: '', password: '', user})
    } catch(exception) {
      // ...
    }
  }
```

Kirjautuminen toimii taas!

## Tokenin tallettaminen selaimen local storageen

Sovelluksessamme on ikävä piirre, kun sivu uudelleenladataan, tieto käyttäjän kirjautumisesta katoaa. Tämä hidastaa melkoisesti myös sovelluskehitystä, esim. testatessamme uuden muistiinpanon luomista, joudumme joka kerta kirjautumaan järjestelmään.

Ongelma korjaantuu helposti tallettamalla kirjautumistiedot [local storageen](https://developer.mozilla.org/en-US/docs/Web/API/Storage) eli selaimessa olevaan pieneen tietokantaan.

Local storage on erittäin helppokäyttöinen. Metodilla [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem) voidaan storageen tallentaa tiettyä _avainta_ vastaava _arvo_, esim:

```js
window.localStorage.setItem('nimi', 'juha tauriainen')
```

tallettaa avaimen _nimi_ arvoksi toisena parametrina olevan merkkijonon. 

Avaimen arvo selviää metodilla [getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem):

```js
window.localStorage.getItem('nimi')
```

ja [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) poistaa avaimen.

Storageen talletetut arvot säilyvät vaikka sivu uudelleenladattaisiin. Storage on ns [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)-kohtainen, eli jokaisella selaimella käytettävällä web-sovelluksella on oma storagensa. 

Laajennetaan sovellusta siten, että se asettaa kirjautneen käyttäjän tiedot local storageen.

Koska storageen talletettavat arvot ovat [merkkijonoja](https://developer.mozilla.org/en-US/docs/Web/API/DOMString), emme voi tallettaa storageen suoraan javascript-oliota, vaan ne on muutettava ensin JSON-muotoon metodilla _JSON.stringify_. Vastaavasti kun JSON-muotoinen olio luetaan local storagesta, on se parsittava takaisin Javascript-olioksi metodilla _JSON.parse_.

Kirjautumisen yhteyteen tehtävä muutos on seuraava:

```js
  login = async (e) => {
    e.preventDefault()
    try{
      const user = await loginService.login({
        username: this.state.username, password: this.state.password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      noteService.setToken(user.token)
      this.setState({ username: '', password: '', user})
    } catch(exception) {
      // ...
    }
   
  }
```

Kirjaantuneen käyttäjän tiedot tallentuvat nyt localstorageen ja niitä voidaan tarkastella konsolista:

![]({{ "/assets/5/2.png" | absolute_url }})

Sovellusta on vielä laajennettava siten, että kun sivulle tullaan uudelleen, esim. selaimen uudelleenlataamisen yhteydessä, tulee sovelluksen tarkistaa löytyykö local storagesta tiedot kirjautuneesta käyttäjästä. Jos löytyy, asetetaan ne sovelluksen tilaan ja _noteServicelle_.

Sopiva paikka tähän on _App_-komponentin metodi [componentwillmount](https://reactjs.org/docs/react-component.html#componentwillmount) johon tutustuimme jo [osassa 2](osa2/#Komponenttien-lifecycle-metodit).

Kyseessä on siis ns. lifecycle-metodi, jota React-kutsuu juuri ennen kuin komponentti ollaan renderöimässä ensimmäistä kertaa. Metodissa on tällähetkellä jo muistiinpanot palvelimelta lataava koodi. Muutetaan koodia seuraavasti

```js
  componentWillMount() {
    noteService.getAll().then(notes =>
      this.setState({ notes })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON ){
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      noteService.setToken(user.token)
    }
  }
```

Nyt käyttäjä pysyy kirjautuneena sovellukseen ikuisesti. Sovellukseen olisikin kenties syytä lisätä _logout_-toiminnallisuus, joka poistaisi kirjautumistiedot local storagesta. Jätämme kuitenkin uloskirjautumisen harjoitustehtäväksi.

Meille riittää se, että sovelluksesta on mahdollista kirjautua ulos kirjoittamalla konsoliin

```js
window.localStorage.removeItem('loggedUser')
```

## kirjautumislomakkeen näyttäminen vain tarvittaessa

Muutetaan sovellusta siten, että kirjautumislomaketta ei oletusarvoisesti näytetä:

![]({{ "/assets/5/3.png" | absolute_url }})

Lomake aukeaa, jos käyttäjä painaa nappia _login_:


![]({{ "/assets/5/4.png" | absolute_url }})

Napilla _cancel_ käyttäjä saa tarvittaessa suljettua lomakkeen.

Aloitetaan eristämällä kirjautumislomake omaksi komponentikseen:

```js
const LoginForm = ({ handleSubmit, handleChange, username, password }) => {
  return (
    <div>
      <h2>Kirjaudu</h2>

      <form onSubmit={handleSubmit}>
        <div>
          käyttäjätunnus
          <input
            value={username}
            onChange={handleChange}
            name='username'
          />
        </div>
        <div>
          salasana
          <input
            value={password}
            type='password'
            onChange={handleChange}
            name='password'
          />
        </div>
        <button>kirjaudu</button>
      </form>
    </div>
  )
} 
```

Reactin [suosittelemaan tyyliin](https://reactjs.org/docs/lifting-state-up.html) tila ja tilaa käsittelevät funktiot on kaikki määritelty komponentin ulkopuolella ja välitetään komponentille propseina. 

Huomaa, että propsit otetaan vastaan _destrukturoimalla_, eli sensijaan että määriteltäisiin

```html
const LoginForm = (props) => {
  return (
      <form onSubmit={props.handleSubmit}>
        <div>
          käyttäjätunnus
          <input
            value={props.username}
            onChange={props.handleChange}
            name='username'
          />
        </div>
        // ...
        <button>kirjaudu</button>
      </form>
    </div>
  )
} 
```

jolloinen muuttujan _props_ kenttiin on viitattava muuttujan kautta esim. _props.handleSubmit_ , otetaan kentät suoraan vastaan omiin muuttujiinsa.

Nopea tapa toiminnallisuuden toteuttamiseen on seuraava:

```html
<div>
  <div style={{ display: this.state.loginVisible ? 'none' : '' }}>
    <button onClick={e => this.setState({ loginVisible: true })}>login in</button>
  </div>
  <div style={{ display: this.state.loginVisible ? '' : 'none' }}>
    <LoginForm
      visible={this.state.visible}
      username={this.state.username}
      password={this.state.password}
      handleChange={this.handleLoginFieldChange}
      handleSubmit={this.login}
    />
    <button onClick={e => this.setState({ loginVisible: false })}>cancel</button>
  </div>
</div>
```

Komponentin _App_ tilaan on nyt määritelty kenttä _loginVisible_ joka määrittelee sen näytetäänkö kenttä. 

Näkyvyyttä säätelevää tilaa vaihdellaan kahden napin avulla, molempiin on kirjoitettu tapahtumankäsittelijän koodi suoraan:

```html
<button onClick={e => this.setState({ loginVisible: true })}>login in</button>

<button onClick={e => this.setState({ loginVisible: false })}>cancel</button>
```

Komponenttien näkyvyys on määritelty asettamalla komponetille CSS-määrittely, jossa [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)-propertyn arvoksi asetetaan _none_ jos komponentin ei haluta näkyvän:

```html
<div style={{ display: this.state.loginVisible ? '' : 'none' }}>
```
Käytössä on taas kysymysmerkkioperaattori, eli jos _this.state.visible_ on _false_, tulee napin CSS-määrittelyksi 

```css
display: 'none';
```

jos _this.state.loginVisible_ on _true_, ei _display_ saa mitään (napin näkyvyyteen liittyvää) arvoa.

Hyödynsimme mahdollisuutta määritellä React-komponenteille koodin avulla [inline](https://react-cn.github.io/react/tips/inline-styles.html)-tyylejä. Palaamme asiaan tarkemmin myöhemmin.

## Komponentin lapset, eli this.props.children

Kirjautumislomakkeen näkyvyyttä ympäröivä koodin voi ajatella olevan oma looginen kokonaisuutensa joka olisi hyvä eristää pois komponentista _App_ omaksi komponentikseen.

Tavoitteena on luoda komponentti _Togglable_ jota käytetän seruaavalla tavalla:

```html
<Togglable buttonLabel='login'>
  <LoginForm
    visible={this.state.visible}
    username={this.state.username}
    password={this.state.password}
    handleChange={this.handleLoginFieldChange}
    handleSubmit={this.login}
  />
</Togglable>
```

Komponentin käyttö poikkeaa aiemmin näkemistämme siinä, että käytössä on nyt avaava ja sulkeva tagi, joiden sisällä määritellään toinen komponentti eli _LoginForm_. Reactin terminologiassa _LoginForm_ on nyt komponentin _Togglable_ lapsi.

_Togglablen_ avaavan ja sulkevan tagin sisälle voi sijoittaa lapsiks mitä tahansa react-elementtejä, esim.:

```html
<Togglable buttonLabel='paljasta'>
  <p>tämä on aluksi piilossa</p>
  <p>toinen salainen rivi</p>
</Togglable>
```

Komponentin koodi on seuraavassa:

```react
class Togglable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible})
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={this.toggleVisibility}>{this.props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
          {this.props.children}
          <button onClick={this.toggleVisibility}>cancel</button>
        </div>
      </div>
    )
  }
}
```

Mielenkiintoista ja meille uutta on [this.props.children](https://reactjs.org/docs/glossary.html#propschildren), jonka avulla koodi viittaa komponentin  lapsiin, eli tagien sisällä määriteltyihin React-elementteihin.

Tällä kertaa lapset ainoastaan renderöidään komponentin oman renderöivän koodin seassa:

```html
<div style={showWhenVisible}>
  {this.props.children}
  <button onClick={this.toggleVisibility}>cancel</button>
</div>
```

Toisin kuin "normaalit" propsit, _children_ on Reactin automaattisesti määrittelemä, aina olemassa oleva propsi. Jos komponentti määritellään automaattisesti suljettavalla eli _/>_ loppuvalla tagilla, esim.

```html
<Note
  key={note.id}
  note={note}
  toggleImportance={this.toggleImportanceOf(note.id)}
/>
```

on _this.props.children_ tyhjä taulukko.

Komponentti _Togglable_ on uusiokäytettävä ja voimme käyttää sitä tekemään myös uuden muistiinpanon luomisesta huolehtivan fromin vastaavalla tavalla tarpeen mukaan näytettäväksi. 

Määrittelimme jo komponentin

<div style={showWhenVisible} class='togglableContent'>

Eristetään ensin muistiinpanojen luominen omaksi komponentiksi

```react
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Luo uusi muistiinpano</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button>tallenna</button>
      </form>    
    </div>
  )
}
```
ja määritellääm lomakkeen näyttävä koodi komponentin _Togglable_ sisällä

```html
<Togglable button='new note'>
  <NoteForm 
    onSubmit={this.addNote}
    value={this.state.new_note}
    handleChange={this.handleNoteChange}
  />
</Togglable>
```

## ref eli viite komponenttiin

Ratkaisu on melko hyvä, haluaisimme kuitenkin parantaa sitä erään seikan osalta. 

Kun uusi muistiinpano luodaan, olisi logista jos luomislomake menisi piiloon, nyt lomake pysyy näkyvillä. Lomakkeen piilottamiseen sisältyy kuitenkin pieni ongelma sillä näkyvyyttä kontrolloidaan _Togglable_-komponentin tilassa olevalla muuttujalla ja komponentissa määritellyllä metodilla _toggleVisibility_ miten pääsemme hiihin käsiksi komponentin ulkopuolelta?

Koska React-komponentit ovat Javascript-oliota, on niiden metodeja mahdollista kutsua jos komponenttia vastaavaan olioon onnistutaan saamaan viite.

Eräs keino viitteen saamiseen on React-komponenttien attribuutti [ref](https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-class-component). 

Muutetaan lomakkeen renderöivää koodia seuraavasti:

```html
<div>
  <Togglable buttonLabel='new note' ref={component => this.noteForm = component}>
    <NoteForm 
      //...
    />
  </Togglable>
</div>
```

Kun komponentti _Togglable_ renderöidään, suorittaa React ref-attribuutin sisällä määritellyn funktion:

```js
component => this.noteForm = component
```

parametrin _component_ arvona on viite komponenttiin. Funktio tallettaa viitteen muuttujaan _this.noteForm_ eli _App_-komponentin kenttään _noteForm_.

Nyt mistä tahansa komponentin _App_ sisältä onn mahdollista päästä käsiksi uusien muistiinpanojen luomisen sisältävään _Togglable_-komponenttiin.

Voimme nyt piilottaa lomakkeen kutsumalla _this.noteForm.toggleVisibility()_ samalla kun uuden muistiinpanon luminen tapahtuu:


```js
  addNote = (e) => {
    e.preventDefault()
    this.noteForm.toggleVisibility()

    // ..
  }
```  

Refeille on myös [muita käyttötarkoituksia](https://reactjs.org/docs/refs-and-the-dom.html) kuin React-komponentteihin käsiksi pääseminen.

### Huomio komponenteista

Kun Reactissa määritellään komponentti

```js
class Togglable extends React.Component {
  // ...
}
```

ja otetaan se käyttöön seuraavasti

```html
<div>
  <Togglable buttonLabel="1" ref={component=>this.t1 = component}>
    ensimmäinen
  </Togglable>

  <Togglable buttonLabel="2" ref={component=>this.t2 = component}>
    toinen
  </Togglable>

  <Togglable buttonLabel="3" ref={component=>this.t3 = component}>
    kolmas
  </Togglable>
</div>
```

syntyy kolme erillsitä komponenttiolioa, joilla on kaikilla oma tilansa:

![]({{ "/assets/5/5.png" | absolute_url }})

_ref_-attribuutin avulla on talletettu viite jokaiseen komponenttiin muuttujiin _this.t1_, _this.t2_, ja _this.t3_, 

## Proptype

Komponenntti _Togglable_ olettaa, että sille määritellään propsina _buttonLabel_ napin teksti. Jos määrittely unohtuu

```html
<Togglable>
  buttonLabel unohtui...
</Togglable>
```

Sovellus kyllä toimii, mutta selaimeen renderöityy hämäävästi nappi, jolla ei ole mitään tekstiä.

Haluaisimmekin varmistaa että jos _Togglable_-komponenttia käytetään, on propsille "pakko" antaa arvo. 

Kirjaston olettamat ja edellyttämät propsit ja niiden tyypit voidaan määritellä kirjaston 
[prop-types](https://github.com/facebook/prop-types) avulla. Asennetaan kirjasto

```bash
npm install --save prop-types
```

_buttonLabel_ voidaan määritellä _pakolliseksi_ string-tyyppiseksi propsiksi seuraavasti

```react
import PropTypes from 'prop-types'

class Togglable extends React.Component {
  // ...
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}
```

Jos propsia ei määritellä, seurauksena on konsoliin tulostuva virheilmoitus

![]({{ "/assets/5/6.png" | absolute_url }})

Koodi kuitenkin toimii edelleen, eli mikään ei pakota määrittelemään propseja PropTypes-määrittelyistä huolimatta. On kuitenkin erittäin epäprofessionaalia jättää konsoliin _mitään_ punaisia tulosteita.

Määritellään Proptypet myös _LoginForm_-komponentille:

```react
import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit, handleChange, username, password }) => {
  return (
    // ...
  )
} 

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired, 
  handleChange: PropTypes.func.isRequired, 
  username: PropTypes.string.isRequired, 
  password: PropTypes.string.isRequired
}
```

Funtionaalisen komponentin proptypejen määrittely tapahtuu samalla tavalla kuin luokkaperustaisten.

Jos propsin tyyppi on väärä, esim. yritetään määritellä propsiksi _handleChange_ merkkijono, seurauksena on varoitus:

![]({{ "/assets/5/7.png" | absolute_url }})

Luokkaperustaisille komponenteille ProcTypet on mahdollista määritellä myös _luokkamuuttujina_, seuraavalla syntaksilla:

```react
import PropTypes from 'prop-types'

class Togglable extends React.Component {
  static propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  }
  
  // ...
}
```

Muuttujamäärittelyn edessä oleva _static_ määrittelee, nyt että _propTypes_-kenttä on nimenomaan komponentin määrittelevällä luokalla _Togglable_ eikä luokan instansseilla. Oleellisesti ottaen kyseessä on ainoastaan javascriptin vielä standardoimattoman [ominaisuuden](https://github.com/tc39/proposal-class-fields) mahdollistava syntatinen oikotie määritellä seuraava:

```js
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}
```

Surfatessasi internetissä saatata vielä nähdä ennen Reactin versiota 0.16. tehtyjä esimerkkejä, joissa PropTypejen käyttö ei edellytä erillistä kirjastoa. Versiosta 0.16 alkaen PropTypejä ei enää määritelty React-kirjastossa itsessään ja kirjaston _prop-types_ käyttö on pakollista.

## React-sovelluksen testaus

Reactilla tehtyjen fronendien testaamiseen on monia tapoja. Aloteaan niihin tutustuminen nyt.

Testit tehdään samaan tapaan kuin edellisessä osassa eli Facebookin [Jest](https://facebook.github.io/jest/)-kirjastolla. Jest onkin valmiiksi konfiguroitu create-react-app:illa luotuihin projekteihin.

Jestin lisäksi käytetään AirBnB:n kehittämää [enzyme](https://github.com/airbnb/enzyme)-kirjastoa. 

Asennetaan enzyme komennolla:

```bash
npm i --save-dev enzyme enzyme-adapter-react-16
```

Testataan maluksi muisiinpanon renderöivää komponenttia:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'
  return (
    <div className='wrapper'>
      <div className='content'>
        {note.content}
      </div>
      <div>
        <button onClick={toggleImportance}>{label}</button>
      </div>
    </div>
  )
}
```

Testauksen helpottamiseksi komponenttiin on lisätty sisällön määrittelevälle _div_-elementille [CSS-luokka](https://reactjs.org/docs/dom-elements.html#classname) _content_. 

### shallow-renderöinti

Ennen testien tekemisä, tehdään _enzymen_ konfiguraatioita varten tiedosto _src/setupTests.js_ ja sille seuraava sisältö:

```js
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() })
```

Nyt olemme valmiina testine tekemiseen.

Koska _Note_ on yksinkertainen komponentti, joka ei käytä yhtään monimutkaista alikomponenttia vaan renderöi suoraan HTML:ää, sopii sen testaamiseen hyvin enzymen [shallow](http://airbnb.io/enzyme/docs/api/shallow.html)-renderöijä

Tehdään testi tiedoston _src/components/Note.test.js_, eli samaan hakemistoon, missä komponentti itsekin sijaitsee.

Ensimmäinen testi varmistaa, että

```js
import React from 'react'
import { shallow } from 'enzyme'
import Note from './Note'

describe.only('<Note />', () => {
  it('renders content', () => {
    const note = {
      content: 'Komonenttitestaus tapahtuu jestillä ja enzymellä',
      important: true
    }

    const noteComponent = shallow(<Note note={note} />)
    const contentDiv = noteComponent.find('.content')

    expect(contentDiv.text()).toContain(note.content)
  })
})
```

Alun konfiguroinnin jälkeen testi renderöi komponentin metodin _shallow_ avulla:

```js
const noteComponent = shallow(<Note note={note} />)
```

Normaalisti React-komponentit renderöityvät _DOM_:iin. Nyt kuitenkin renderöimme komponentteja [shallowWrapper](http://airbnb.io/enzyme/docs/api/shallow.html)-tyyppisiksi, testaukseen sopiviksi olioiksi.

ShallowWrapper-mutoon renderöidyillä React-komponenteilla on runsaasta metodeja, joiden avulla niiden sisältöä voidaan tutkia. Esimerkiksi [find](http://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html) mahdollistaa komponentin sisällä olevien _elementtien_ etsimisen [enzyme-selektorien](http://airbnb.io/enzyme/docs/api/selector.html) avulla. Eräs tapa elementtien etsimiseen on [CSS-selektorien](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) käyttö. Liitimme muisiinpanon sisällön kertovaan div-elementtiin luokan _content_, joten voimme etsiä edelmentin seuraavasti:

```js
const contentDiv = noteComponent.find('.content')
```

ekspektaatiossa vaarmistamme, että elementtiin on renderöitynyt oikea teksti, eli muistiinpanon sisältö:

```js
expect(contentDiv.text()).toContain(note.content)
```

### testien suorittaminen

Create-react-app:issa on konfiguroitu testit oletusarvoisesti suoritettavaksi ns. watch-moodissa, eli jos suoritat testit komennolla _npm test_ jää konsoli odottamaan koodissa tapahtuvia muutoksia. Muutosten jälkeen testit suoritetaan automaattisesti ja jest alkaa taas odottaa uusia muutoksia koodiin.

Jos haluat ajaa testit "normaalisti", se onnistuu komennolla

```bash
CI=true npm test
```

### testien sijainti

Reactissa on (ainakin) [kaksi erilaista](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) konventiota testien sijoittamiseen. Sijoitimme testit ehkä vallitsevan tavan mukaan, eli samaan hakemistoon missä testattava komponentti sijaitsee. 

Toinen tapa olisi sijoittaa testit "normaaliin" tapaan omaan erilliseen hakemistoon. Valitaanpa kumpi tahansa tapa, on 100% varmaan että se on jonkun mielestä täysin väärin.

Itse en pidä siitä, että testit ja normaali koodi ovat samassa hakemistossa. Noudatanne kuitenkin nyt tätä tapaa sillä create-react-app:illa konfiguroidut sovellukset suosivat oletusarvoisesti tätä tapaa.

### testien debuggaaminen

Testejä tehdessä törmäämme tyypillisesti moniin ongelmiin. Näissä tilanteissa vanha kunnon _console.log_ on hyödyllinen. Voimme tulostaa _shallow_-metodin avulla renderöityjä komponentteja ja niiden sisällä olevia elementtejä seuraavasti:

```js
describe.only('<Note />', () => {
  it('renders content', () => {
    const note = {
      content: 'Komonenttitestaus tapahtuu jestillä ja enzymellä',
      important: true
    }

    const noteComponent = shallow(<Note note={note} />)
    console.log(noteComponent.debug())

    
    const contentDiv = noteComponent.find('.content')
    console.log(contentDiv.debug())

    // ...
  })
})
```

Konsoliin tulostuu komponentinn generoima html:

```bash
console.log src/components/Note.test.js:16
  <div className="wrapper">
    <div className="content">
      Komonenttitestaus tapahtuu jestillä ja enzymellä
    </div>
    <div>
      <button onClick={[undefined]}>
        make not important
      </button>
    </div>
  </div>

console.log src/components/Note.test.js:20
  <div className="content">
    Komonenttitestaus tapahtuu jestillä ja enzymellä
  </div>
```

### nappien painelu testeissä

Sisällön näyttämisen lisäksi toinen _Note_-komponenttien vastuulla oleva asia on huolehtia siitä, että painettaessa noten yhteydesssä olevaa nappia, tulee propsina välitetyä tapahtumankäsittelijäfunktota _toggleImportance_ kutsua.

Testaus onnistuu seuraavasti:

```bash
  it('clicking the button calls event handler once', () => {
    const note = {
      content: 'Komonenttitestaus tapahtuu jestillä ja enzymellä',
      important: true
    }

    const mockHandler = jest.fn()

    const noteComponent = shallow(
      <Note 
        note={note} 
        toggleImportance={mockHandler}
      />
    )
    
    const button = noteComponent.find('button')
    button.simulate('click')

    expect(mockHandler.mock.calls.length).toBe(1)
  })  
})
```

Testissä on muutama mielenkiintoinen seikka. Tapahtumankäsittelijäksi annetaan Jestin avulla määritelty [mock](https://facebook.github.io/jest/docs/en/mock-functions.html)-funktio:

```js
const mockHandler = jest.fn()
```

Testi hakee renderöidystä komponentista _button_-elementin ja klikkaa sitä. Koska komponentissa on ainoastaan yksi nappi, on sen hakeminen helppoa:

```js
const button = noteComponent.find('button')
button.simulate('click')
```

Klikkaaminen tapahtuu metodin [simulate] (http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html) avulla.

Testin ekspektaatio varmistaa, että _mock-funktiota_ on kutsuttu täsmälleen kerran:

```js
expect(mockHandler.mock.calls.length).toBe(1)
```


[Mockoliot ja -funktiot](https://en.wikipedia.org/wiki/Mock_object) testauksessa yleisesti käytettyjä valekomponentteja, joiden avulla korvataan testattavien komponenttien tarvitsemia muita komponentteja. Mockit mahdollistavat mm. kovakoodattujen syötteiden palauttamisen sekä niiden metodikutsujen lukumäärän sekä parametrien tarkkailemisen testatessa. 

Esimerkissämme mock-funktio sopi tarkoitukseen erinomaisesti, sillä sen avulla oli hyvä varmistaa, että metodia on kutsuttu täsmälleen kerran. Testiä olisi mahdollisa myös parantaa varmistamalla, että mock-olion metodikutsussa annettu parametri on odotetun kaltainen. Jätämme kuitenkin testien parantelun harjoitustehtäväksi.

### Komponentin Togglable testit

Tehdään komponentille _Togglable_ muutama testi. Lisätään komponentin lapset renderöivään div-elementtiin CSS-luokka _togglableContent_:

```react
class Togglable extends React.Component {

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={this.toggleVisibility}>{this.props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible} class='togglableContent'>
          {this.props.children}
          <button onClick={this.toggleVisibility}>cancel</button>
        </div>
      </div>
    )
  }
}
```

Testit ovat seuraavassa

```js
import React from 'react'
import { shallow } from 'enzyme'
import foo from 'enzyme-matchers'
import Adapter from 'enzyme-adapter-react-16';
import Note from './Note'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let togglableComponent

  beforeEach(() => {
    togglableComponent = shallow(
      <Togglable buttonLabel='show...'>
        <div class='testDiv' />
      </Togglable>)
  })

  it('renders its children', () => {
    expect(togglableComponent.contains(<div class='testDiv' />)).toEqual(true)
  })

  it('at start the children are not displayed', () => {
    const div = togglableComponent.find('.togglableContent')
    expect(div.getElement().props.style).toEqual({display: 'none'})
  })

  it('after clicking the button, children are displayed', () => {
    const button = togglableComponent.find('button')

    button.at(0).simulate('click')
    const div = togglableComponent.find('.togglableContent')
    expect(div.getElement().props.style).toEqual({ display: '' })
  })

})
```

Ennen jokaista testiä suoritettava _beforeEach_ alustaa shallowrenderöi _Togglable_-komponentin muuttujaan _togglableComponent_. 

Ensimmäinen testi tarkastaa, että _Togglable_ renderöi lapsikomponentin _<div class='testDiv' />_. Loput testit varmistavat, että Togglablen sisältämä lapsikomponentti on alussa näkymättömissä, eli sen sisältävään _div_-elementin liittyy tyyli _{display: 'none'}_, ja että nappia painettaessa komponentti näkyy, eli tyyli on _{ display: '' }_. Koska Togglablessa on kaksi nappia, painallusta simuloidessa niistä pitää valita oikea, eli tällä kertaa ensimmäinen.


### mount ja full DOM -renderöinti

Käyttämämme _shallow_-renderöijä on useimmissta tapauksissa riittävä. Joskus tarvitsemme kuitenkin järeämmän työkalun sillä _shallow_ renderöi ainoastaan "yhden tason", eli sen komponentin, jolle metodia kutsutaan. 

Jos yritämme esim. sijoittaa kaksi _Note_-komponenttia _Togglable_-komponentin sisälle ja tulostamme syntyvän _ShallowWrapper_ olion

```
it('shallow renders only one level', () => {
  const note1 = {
    content: 'Komonenttitestaus tapahtuu jestillä ja enzymellä',
    important: true
  }
  const note12= {
    content: 'shallow ei renderöi alikomponentteja',
    important: true
  }

  const togglableComponent = shallow(
    <Togglable buttonLabel='show...'>
      <Note note={note1} />
      <Note note={note2} />
    </Togglable>)
  
  console.log(togglableComponent.debug())
})

```

huomaamme, että _Togglable_ komponentti on renderöitynyt, eli "muuttunut" HTML:ksi, mutta sen sisällä olevat _Note_-komponentit eivät ole HTML:ää vaan React-komponentteja.

```bash
<div>
  <div style={{...}}>
    <button onClick={[Function]}>
      show...
    </button>
  </div>
  <div style={{...}} className="togglableContent">
    <Note note={{...}} />
    <Note note={{...}} />
    <button onClick={[Function]}>
      cancel
    </button>
  </div>
</div>
```

Jos komponetille tehdään edellisten esimerkkien tapaan yksikkötestejä, _shallow_-renderöinti on useimmiten riittävä. Jos haluamme testata isompia kokonaisuuksia, eli tehdä fronendin _integraatiotestausta_, ei _shallow_-renderöinti riitä vaan on turvauduttava komponentit kokonaisuudessaan renderöivään [mount](http://airbnb.io/enzyme/docs/api/mount.html):iin.

Muutetaan testi käyttämään _shallowin_ sijaan _mountia_:

```js
import React from 'react'
import { shallow, mount } from 'enzyme'
import Note from './Note'
import Togglable from './Togglable'

it('mount renders all components', () => {
  const note1 = {
    content: 'Komonenttitestaus tapahtuu jestillä ja enzymellä',
    important: true
  }
  const note2 = {
    content: 'mount renderöi myös alikomponentit',
    important: true
  }

  const noteComponent = mount(
    <Togglable buttonLabel='show...'>
      <Note note={note1} />
      <Note note={note2} />
    </Togglable>)

  console.log(noteComponent.debug())
})
```

Tuloksena on kokonaisuudessaan HTML:ksi renderöitynyt _Togglable_-komponentti:

```html
<Togglable buttonLabel="show...">
  <div>
    <div style={{...}}>
      <button onClick={[Function]}>
        show...
      </button>
    </div>
    <div style={{...}} className="togglableContent">
      <Note note={{...}}>
        <div className="wrapper">
          <div className="content">
            Komonenttitestaus tapahtuu jestillä ja enzymellä
          </div>
          <div>
            <button onClick={[undefined]}>
              make not important
            </button>
          </div>
        </div>
      </Note>
      <Note note={{...}}>
        <div className="wrapper">
          <div className="content">
            mount renderöi myös alikomponentit
          </div>
          <div>
            <button onClick={[undefined]}>
              make not important
            </button>
          </div>
        </div>
      </Note>
      <button onClick={[Function]}>
        cancel
      </button>
    </div>
  </div>
</Togglable>
```

Mountin avulla renderöitäessä testi pääsee siis käsiksi periaatteessa samaan HTML-koodiin, joka todellisuudessa renderöidään selaimeen ja tämä luonnollisesti mahdollistaa huomattavasti monipuolisemman testauksen kuin _shallow_-renderöinti. Komennolla _mount_ tapahtuva renderöinti on kuitenkin hitaampaa, joten jos _shallow_ riittää, sitä kannattaa käyttää.

Komennon _mount_ palauttamaa renderöidyn "komponenttipuun" [ReactWrapper](http://airbnb.io/enzyme/docs/api/mount.htm)-tyyppisenä oliona, joka tarjoaa hyvin samantyyppisen rajapinnan komponentin sisällön tutkimiseen kuin _ShallowWrapper_.

## fronendin integraatiotestaus

Suoritimme edellisessä osassa backendille integraatiotestejä, jotka testasivat backendin tarjoaman API:n läpi backendia ja tietokantaa. Backendin testauksessa tehtiin tietoinen päätös olla kirjoittamatta yksikkötestejä sillä backendin koodi on sinänsä erittäin suoraviivaista ja ongelmat tulevatkin esiin todennäköisemmin juuri monimutkaisemmissa skenaarioissa, joita integraatiotestit hyvin testaavat

Toistaiseksi kaikki fronendiin tekemämme testit ovat olleet yksittäisten komponenttien oikeellisuutta valvovia yksikkötestejä. Yksikkötestaus on toki tärkeää, muuta kattavinkaan ykikkötestaus ei riitä koskaan antamaan riittävää luotettavuutta sille, että järjestelmä toimii kokonaiusuudessaan.

Tehdään nyt sovellukselle yksi integraatiotesti. Integraatiotestaus on huomattavasti komponenttien yksikkötestausta hankalampaa. Erityisesti sovelluksemme kohdalla ongelmia aiheuttaa kaksi seikkaa: sovellus hakee näytettävät muuistiinpanot palvelimelta _ja_ sovellus käyttää localstoragea kirjautuneen käyttäjän tietojen tallettamiseen. 

Localstorage ei ole oletusarvoiseti käytettävissä testejä suorittaessa, sillä kyseessä on selaimen tarjoama toiminnallisuus ja testit ajetaan selaimen ulkopuolella. Ongelma on helppo korjata määrittelemällä testien suorituksen ajaksi _mock_ joka matkii localstoragea. Tapoja tähän on [monia](https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests). 

Koska testimme ei edellytä localstoragelta juuri mitään toiminnallisuutta, teemme tiedostoon[src/setupTests.js](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#initializing-test-environment) hyvin yksinkertaisen mockin

```js
let savedItem

const localStorageMock = {
  getItem: (item) => {
    savedItem = item
  },
  setItem: () => savedItem,
  clear: jest.fn()
}

window.localStorage = localStorageMock
```

Toinen ongelmistamme on se, että sovellus hakee näytettävät muistiinpanot palvelimelta. Muistiinpanojen haku tapahtuu heti komponentin _App_ luomisen jälkeen, kun metodi _componentWillMount_ kutsuu _noteService_:n metodia _getAll_:



```js
  componentWillMount() {
    noteService.getAll().then(notes =>
      this.setState({ notes })
    )

    // ...
  }
```

Jestin [manual mock](https://facebook.github.io/jest/docs/en/manual-mocks.html#content) -konsepti tarjoaa tilanteeseen hyvän ratkaisun. Manual mockien avulla voidaan kokonainen moduuli, tässä tapauksessa _noteService_ korvata testien ajaksi vaihtoehtoisella esim. kovakoodattua dataa tarjoavalla toiminnallisuudella.

Luodaan Jestin ohjeiden mukaisesti hakemistoon _src/services_ alihakemisto *__mock__* ja sinne tiedosto _notes.js_ jonka määrittelemä metodi _getAll_ palauttaa kovakoodatun listan muistiinpanoja:

```js
let token = null

const notes = [
  {
    id: "5a451df7571c224a31b5c8ce",
    content: "HTML on helppoa",
    date: "2017-12-28T16:38:15.541Z",
    important: false,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  },
  {
    id: "5a451e21e0b8b04a45638211",
    content: "Selain pystyy suorittamaan vain javascriptiä",
    date: "2017-12-28T16:38:57.694Z",
    important: true,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  },
  {
    id: "5a451e30b5ffd44a58fa79ab",
    content: "HTTP-protokollan tärkeimmät metodit ovat GET ja POST",
    date: "2017-12-28T16:39:12.713Z",
    important: true,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  }
]

const getAll = () => {
  return Promise.resolve(notes)
}

export default { getAll, notes }
```

Määritelty metodi _getAll_ palauttaa muistiinpanojen listan käärittynä promiseksi metodin[Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
avulla sillä käytettäessä metodia, oletetaan sen paluuarvon olevan promise:

```js
noteService.getAll().then(notes =>
```

Olemme valmiina määrittelemään testin:

```js
import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Note from './components/Note'
jest.mock('./services/notes')
import noteService from './services/notes'

describe('<App />', ()=>{

  let app
  beforeAll( () =>{
    app = mount(<App />)
  })

  it('renders all notes it gets from backend', () => {
    app.update()
    const noteComponents = app.find(Note)
    expect(noteComponents.length).toEqual(5)
  })
})
```

Komennolla _jest.mock('./services/notes')_ otetaan juuri määritelty mock käyttöön. Loogisempi paikka komennolle olisi kenties testien määrittelyt tekevä tiedosto _src/testSetup.js_

Testin toimivuuden kannalta on oleellista metodin [app.update](http://airbnb.io/enzyme/docs/api/ReactWrapper/update.html) kutsuminen, näin pakotetaan sovellus renderöitymään uudelleen siten, että myös mockatun backendin palauttamat muistiinpanot renderöityvät.

## Testauskattavuus

[Testauskattavuus](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting)  saadaan helposti selville 
suorittamalla testit komennolla

```bash
CI=true npm test -- --coverage 
```

![]({{ "/assets/5/8.png" | absolute_url }})

Melko primitiivinen HTML-mutoinen raportti generoituu hakemistoon _coverage/lcov-report_. HTML-mutoinen raportti kertoo mm. yksittäisen komponenttien testaamattomien koodirivit:

![]({{ "/assets/5/9.png" | absolute_url }})

Huomaamme, että parannettavaa jäi vielä runstaasti.

## snapshot-testaus

Jest tarjoaa "perinteisen" testaustavan lisäksi aivan uudenlaisen tavan testaukseen, ns. 
[snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html)-testauksen. Mielenkiintoista snapshot-testauksessa on se, että sovelluskehittäjän ei tarvitse itse määritellä ollenkaan testejä, snapshot-testauksen käyttöönotto riittää.

Periaatteena on verrata komponenttien määrittelemää HTML:ää aina koodin muutoksen jälkeen siihen minkälaisen HTML:n komponentit määrittelivät ennen muutosta. 

Jos spanshot-testi huomaa muutoksen komponenttien määrittelemässä HTML:ssä kyseessä voi joko olla haluttu muutos tai vaihingossa aiheutettu "bugi". Snaphshot-testi huomauttaa sovelluskehittäjälle jos komponentin määrittelemä HTML muuttuu. Sovelluskehittäjä kertoo muutosten yhteydessä jos muutos oli haluttu. Jos muutos tuli yllätyksenä, eli kyseessä oli bugi, sovelluskehittäjä huomaa sen snapshot-testauksen ansiosta nopeasti.

Palaamme aiheeseen myöhemmin kurssilla.

## end to end -testaus

Olemme nyt tehneet sekä backendille että frontendille hieman niitä kokonaisuutena testavia integraatiotestejä. Eräs tärkeä testauksen kategoria on vielä käsittelemättä, [järjestelmää kokonaisuutena](https://en.wikipedia.org/wiki/System_testing) testaavat "end to end" (eli E2E) -testit. 

Web-sovellusten E2E-testaus tapahtuu simuloidun selaimen avulla esimerkiksi [Selenium](http://www.seleniumhq.org)-kirjastoa käyttäen. Toinen vaihtoehto on käyttää ns. [headless browseria]
(https://en.wikipedia.org/wiki/Headless_browser) eli selainta, jolla ei ole ollenkaan graafista käyttöliittymää. Esim. Chromea on mahdollista suorittaa Headless-moodissa.

E2E testit ovat potentiaalisesti kaikkein hyödyllisin testikategoria, sillä ne tutkivat järjestelmää mahdollisimman samanlaisena, mikä käyttöönotettava sovellus todellisuudessa on.

E2E-testeihin liittyy myös ikäviä puolia. Niiden konfigurointi on haastavampaa kuin yksikkö- ja integraatiotestien. E2E-testit ovat tyypillisesti myös melko hitaita ja isommassa ohjelmistossa niiden suortitusaika voi helposti nousta minuutteihin, tai jopa tunteihin. Tämä on ikävää sovelluskehityksen kannalta, sovellusta koodatessa olisi erittäin hyödyllistä pystyä ajamaan testejä mahdollisimman usein koodin regressioiden varalta.

Palaamme end to end -testeihin kurssin viimeisessä, eli seitsemännessä osassa.

## redux