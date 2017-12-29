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
  - Proptype
  - Bootstrap (reactstrap) tai material UI
  - Periaatteita: Virtual dom
- Frontendin testauksen alkeet
  - jsdom enzyme
- Redux
- Flux-pattern
- Storage, reducerit, actionit
- Testaus mm deepfreeze
React+redux
- Storagen välittäminen propseilla ja kontekstissa
Javascript
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

[this.props.children](https://reactjs.org/docs/glossary.html#propschildren)


Komponentti _Togglable_ on uusiokäytettävä ja voimme käyttää sitä tekemään myös uuden muistiinpanon luomisesta huolehtivan fromin vastaavalla tavalla tarpeen mukaan näytettäväksi. 

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
  <Togglable/>

  <Togglable buttonLabel="2" ref={component=>this.t2 = component}>
    toinen
  <Togglable/>

  <Togglable buttonLabel="3" ref={component=>this.t3 = component}>
    kolmas
  <Togglable/>
</div>
```

syntyy kolme erillsitä komponenttiolioa, joilla on kaikilla oma tilansa:

![]({{ "/assets/5/5.png" | absolute_url }})

_ref_-attribuutin avulla on talletettu viite jokaiseen komponenttiin muuttujiin _this.t1_, _this.t2_, ja _this.t3_, 

## Proptype

voidaan vahingossa jättää _buttonLabel_ määrittelemättä:
```html
  <Togglable>
    ensimmäinen
  <Togglable/>
```

proptypes to the rescue
https://reactjs.org/docs/typechecking-with-proptypes.html
https://github.com/facebook/prop-types

## testaus

## redux