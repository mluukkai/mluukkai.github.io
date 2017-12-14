# tehtävät

## osa 1

### web-sovellusten perusteet ###

#### 1 

Kertaa HTML:n ja CSS:n perusteet lukemalla Mozzillan tutoriaali [HTML:stä](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics) ja 
[CSS:stä](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)

#### 2

Tutustu HTML:n lomakkeiden perusteisiin lukemalla Mozzillan tutoriaali [Your first form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form)

#### 3

Kun käyttäjä menee selaimella osoitteeseen <https://fullstack-exampleapp.herokuapp.com/> voidaan sen seurauksena olevaa tapahtumaketjua kuvata sekvenssikaaviona seuraavasti: 

![]({{ "/assets/teht/1.png" | absolute_url }})

Kaavio on luotu [websequencediagrams](https://www.websequencediagrams.com)-palvelussa, seuraavasti:

<pre>
kayttaja->selain:
note left of selain
kayttaja kirjottaa osoiteriville 
fullstack-exampleapp.herokuapp.com
end note
selain->palvelin: GET fullstack-exampleapp.herokuapp.com
note left of palvelin
  muodostetaan HTML missä olemassaolevien
  muistiinpanojen lukumäärä päivitettynä
end note
palvelin->selain: status 200, sivun HTML-koodi

selain->palvelin: GET fullstack-exampleapp.herokuapp.com/kuva.png
palvelin->selain: status 200, kuva

note left of selain
 selain näyttää palvelimen palauttaman HTML:n 
 johon on upotettu palvelimelta haettu kuva
end note
</pre>

**Tee vastaavanlainen kaavio, joka kuvaa mitä tapahtuu kun käyttäjä navigoi muistiinpanojen sivulle.**

Kaavion ei ole pakko olla sekvenssikaavio. Mikä tahansa järkevä kuvaustapa käy.

Kaiken oleellisen tehtävän tekemiseen liittyvän informaatin pitäisi olla selitettynä [osa 1](../osa1):n tekstissä. Tämän ja seuraavien 3 tehtävän ideana on, että luet tekstin vielä kerran ja mietit tarkkaan mitä missäkin tapahtuu. Ohjelman [koodin](https://github.com/mluukkai/example_app) lukemista ei näissä tehtävissä edellytetä vaikka sekin on toki mahdollista.

#### 4

Tee kaavio tilanteesta, missä käyttäjä luo uuden muistiinpanon, eli kirjoittaa tekstikenttään jotain ja painaa nappia _tallenna_

Kirjoita tarvittaessa pavelimella tai  selaimessa tapahtuvat operaatiot sopivina kommentteina kaavion sekaan.

#### 5

Tee kaavio tilanteesta, missä käyttäjä menee selaimella osoitteeseen <https://fullstack-exampleapp.herokuapp.com/spa> eli muistiinpanojen [single page app](../osa1/#single-page-app)-versioon

#### 6

Tee kaavio tilanteesta, missä käyttäjä luo uuden muistiinpanin single page -versiossa.

### react alkeet ###

#### 7

Luo create-react-app:illa uusi sovellus. Muuta _index.js_ muotoon

```react
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const kurssi = "Half Stack -sovelluskehitys"
  const osa1 = 'Reactin perusteet'
  const tehtavia1 = 10
  const osa2 = 'Tiedonvälitys propseilla'
  const tehtavia2 = 7
  const osa3 = 'Komponenttien tila'
  const tehtavia3 = 14

  return (
    <div>
      <h1>{kurssi}</h1>
      <p>{osa1} {tehtavia1}</p>
      <p>{osa2} {tehtavia2}</p>
      <p>{osa3} {tehtavia3}</p>      
      <p>yhteensä {tehtavia1 + tehtavia2 + tehtavia3} tehtävää</p>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
) 
```

ja poista ylimääräiset tiedoston.

Koko sovellus on nyt ikävästi yhdessä komponentissa. Refaktoroi sovellus siten, että se koostuu kolmesta komponentista _Otsikko_, _Sisalto_ ja _Yhteensa_. Kaikki data pidetään edelleen komponentissa _App_, joka välittää tarpeelliset tiedot kullekin komponenteille _props:_ien avulla. _Otsikko_ huolehtii kurssin nimen renderöimisestä, _Sisalto_ osista ja niiden tehtävämääristä ja _Yhteensa_ tehtävien yhteismäärästä.

Komponentin _App_ runko tulee olevaan suunilleen seuraavanlainen: 

```react
const App = () => {
  // const-määrittelyt

  return (
    <div>
      <Otsikko kurssi={kurssi} />
      <Sisalto ... />
      <Yhteensa ... />
    </div>
  )
}
```

#### 8 

Refaktoroi vielä komponentti _Sisalto_ siten, että se ei itse renderöi yhdenkään osan nimeä eikä sen tehtävälukumäärää vaan ainoastaan kolme _Osa_-nimistä komponenttia, joista kukin siis renderöi yhden osan nimen ja tehtävämäärän.

```react
const Sisalto =  ... {
  return(
    <div>
      <Osa .../>
      <Osa .../>
      <Osa .../>
    </div>
  )

}
```

Sovelluksemme tiedonvälitys on tällä hetkellä todella alkukantaista sillä se perustuu yksittäisiin muuttujiin. Tilanne paranee pian

### javascriptin alkeet ###

### 9

Siirrytään käyttämään sovelluksessamme oliota. Mutta _App_:in muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikki osat niin että se taas toimii:

```react
const App = () => {
  const kurssi = "Half Stack -sovelluskehitys"
  const osa1 = {
    nimi: 'Reactin perusteet',
    tehtavia: 10,
  }
  const osa2 = {
    nimi: 'Tiedonvälitys propseilla',
    tehtavia: 7
  }
  const osa3 = {
    nimi: 'Komponenttien tila',
    tehtavia: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

### 10

Ja laitetaan oliot taulukkoon, eli mutta _App_:in muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikki osat vastaavasti. Huomaa, että sovelluksen on toimittava ilman muutoksia riippumatta taulukossa olevien osien määrästä:

```react
const App = () => {
  const kurssi = "Half Stack -sovelluskehitys"
  const osat =  [
    {
      nimi: 'Reactin perusteet',
      tehtavia: 10,
    },
    {
      nimi: 'Tiedonvälitys propseilla',
      tehtavia: 7
    },
    {
      nimi: 'Komponenttien tila',
      tehtavia: 14
    } 
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

Pro tip: laske tehtävien summa taulukon [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)-funktiolla.

### 11

Viedään muutos vielä yhtä askelta pidemmälle, eli tehdään kurssista ja sen osista yksi Javascript-olio. Korjaa kaikki mikä menee rikki.

```react
const App = () => {
  const kurssi =  {
    nimi: "Half Stack -sovelluskehitys",
    osat = [
      {
        nimi: 'Reactin perusteet',
        tehtavia: 10,
      },
      {
        nimi: 'Tiedonvälitys propseilla',
        tehtavia: 7
      },
      {
        nimi: 'Komponenttien tila',
        tehtavia: 14
      } 
    ]
  }
  
  return (
    <div>
      ...
    </div>
  )
}
```

### lisää reactia ###

#### 12