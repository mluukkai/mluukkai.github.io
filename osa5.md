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
  - Lisää formeista: mm refs
  - Bootstrap (reactstrap) tai material UI
  - Periaatteita: Virtual dom
  - Proptype
  - child https://reactjs.org/docs/composition-vs-inheritance.html
- Frontendin testauksen alkeet
  - Ava jsdom enzyme
- Redux
Redux
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

Lomakkeet generoiva koodi on nyt erotettu funktioihin, joissa lomakkeet generoidaan ehdollisesti, eli esim. login-lomake ainoastaan jos käyttäjä ei jo ole kirjautunut.

Sovelluksemme pääkomponentti _App_ on tällä hetkellä jo aivan liian laaja ja nyt tekemämme muutos on aivan ilmeinen signaali siitä, että lomakkeet olisi syyt ärefaktoroida omiksi kompotenteikseen. Jätämme sen kuitenkin harjoitustehtäväksi.

## Muistiinpanojen luominen

## Tokenin tallettaminen selaimen local storageen