# tehtävät

## osa 1

### web-sovellusten perusteet ###

#### 1 HTML ja CSS ####

Kertaa HTML:n ja CSS:n perusteet lukemalla Mozillan tutoriaali [HTML:stä](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics) ja
[CSS:stä](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)

#### 2 HTML:n lomakkeet

Tutustu HTML:n lomakkeiden perusteisiin lukemalla Mozillan tutoriaali [Your first form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form)

#### 3

Kun käyttäjä menee selaimella osoitteeseen <https://fullstack-exampleapp.herokuapp.com/> voidaan sen seurauksena olevaa tapahtumaketjua kuvata sekvenssikaaviona esim. seuraavasti:


<img src="/assets/teht/1.png" height="400">


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

Kaiken oleellisen tämän ja seuraavien 3 tehtävän tekemiseen liittyvän informaation pitäisi olla selitettynä [osa 1](../osa1):n tekstissä. Näiden tehtävien ideana on, että luet tekstin vielä kerran ja mietit tarkkaan mitä missäkin tapahtuu. Ohjelman [koodin](https://github.com/mluukkai/example_app) lukemista ei näissä tehtävissä edellytetä vaikka sekin on toki mahdollista.

#### 4

Tee kaavio tilanteesta, missä käyttäjä luo uuden muistiinpanon, eli kirjoittaa tekstikenttään jotain ja painaa nappia _tallenna_

Kirjoita tarvittaessa palvelimella tai selaimessa tapahtuvat operaatiot sopivina kommentteina kaavion sekaan.

#### 5

Tee kaavio tilanteesta, missä käyttäjä menee selaimella osoitteeseen <https://fullstack-exampleapp.herokuapp.com/spa> eli muistiinpanojen [single page app](../osa1/#single-page-app)-versioon

#### 6

Tee kaavio tilanteesta, missä käyttäjä luo uuden muistiinpanin single page -versiossa.

### react alkeet ###

#### 7 jako komponenteiksi

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

ja poista ylimääräiset tiedostot.

Koko sovellus on nyt ikävästi yhdessä komponentissa. Refaktoroi sovellus siten, että se koostuu kolmesta komponentista _Otsikko_, _Sisalto_ ja _Yhteensa_. Kaikki data pidetään edelleen komponentissa _App_, joka välittää tarpeelliset tiedot kullekin komponenteille _props:ien_ avulla. _Otsikko_ huolehtii kurssin nimen renderöimisestä, _Sisalto_ osista ja niiden tehtävämääristä ja _Yhteensa_ tehtävien yhteismäärästä.

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

#### 8 lisää komponentteja

Refaktoroi vielä komponentti _Sisalto_ siten, että se ei itse renderöi yhdenkään osan nimeä eikä sen tehtävälukumäärää vaan ainoastaan kolme _Osa_-nimistä komponenttia, joista kukin siis renderöi yhden osan nimen ja tehtävämäärän.

```react
const Sisalto = ... {
  return (
    <div>
      <Osa .../>
      <Osa .../>
      <Osa .../>
    </div>
  )

}
```

Sovelluksemme tiedonvälitys on tällä hetkellä todella alkukantaista sillä se perustuu yksittäisiin muuttujiin. Tilanne paranee pian.

### javascriptin alkeet ###

#### 9 tieto olioissa

Siirrytään käyttämään sovelluksessamme oliota. Muuta _App_:in muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikki osat niin että se taas toimii:

```react
const App = () => {
  const kurssi = 'Half Stack -sovelluskehitys'
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

#### 10 oliot taulukkoon

Ja laitetaan oliot taulukkoon, eli muuta _App_:in muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikki osat vastaavasti:

```react
const App = () => {
  const kurssi = 'Half Stack -sovelluskehitys'
  const osat = [
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

**HUOM:** tässä vaiheessa _voit olettaa, että taulukossa on aina kolme alkiota_, eli taulukkoa ei ole pakko käydä läpi looppaamalla. Palataan taulukossa olevien olioiden perusteella tapahtuvaan komponenttien renderöintiin asiaan tarkemmin kurssin [seuraavassa osassa](../osa2).

Älä kuitenkaan välitä eri olioita komponenttien välillä (esim. komponentista _App_ komponenttiin _Yhteensa_) erillisinä propsina, vaan suoraan taulukkona:

```react
const App = () => {
  // const-määrittelyt

  return (
    <div>
      <Otsikko kurssi={kurssi} />
      <Sisalto osat={osat} />
      <Yhteensa osat={osat} />
    </div>
  )
}
```

#### 11

Viedään muutos vielä yhtä askelta pidemmälle, eli tehdään kurssista ja sen osista yksi Javascript-olio. Korjaa kaikki mikä menee rikki.

```react
const App = () => {
  const kurssi = {
    nimi: 'Half Stack -sovelluskehitys',
    osat: [
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

#### 12 unicafe osa1

Monien firmojen tapaan nykyään myös [Unicafe](https://www.unicafe.fi/#/9/4) kerää asiakaspalautetta. Tee Unicafelle verkossa toimiva palautesovellus. Vastausvaihtoehtoja olkoon vaan kolme: _hyvä_, neutraali ja _huono_.

Sovelluksen tulee näyttää jokaisen palautteen lukumäärä. Sovellus voi näyttää esim. seuraavalta:

<img src="/assets/teht/4a.png" height="200">

Huomaa, että sovelluksen tarvitsee toimia vain yhden selaimen käyttökerran ajan, esim. kun selain refreshataan, tilastot saavat hävitä.

#### 13 unicafe osa2

Laajenna sovellusta siten, että se näyttää palautteista statistiikkaa, keskiarvon (hyvän arvo 1, neutraalin 0, huonon -1) ja sen kuinka monta prosenttia palautteista on ollut positiivisia:

<img src="/assets/teht/4.png" height="250">

#### 14 unicafe osa3

Refaktoroi sovelluksesi siten, että se koostuu monista komponenteista. Pidä tila kuitenkin sovelluksen _juurikomponentissa_.

Tee sovellukseen ainakin seuraavat komponentit:
- _Button_ vastaa yksittäistä palautteenantonappia
- _Statistics_ huolehtii tilastojen näyttämisestä
- _Statistic_ huolehtii yksittäisen tilastorivin, esim. keskiarvon näyttämisestä

#### 15 unicafe osa4

Muuta sovellusta siten, että numeeriset tilastot näytetään ainoastaan jos palautteita on jo annettu:

<img src="/assets/teht/5.png" height="180">


#### 16 unicafe osa5

Jos olet määritellyt jokaiselle napille oman tapahtumankäsittelijän, refaktoroi sovellustasi siten, että kaikki napit käyttävät samaa tapahtumankäsittelijäfunktiota samaan tapaan kuin materiaalin luvussa [funktio joka palauttaa funktion](#funktio-joka-palauttaa-funktion)

#### 17 unicafe osa6

Toteuta tilastojen näyttäminen HTML:n [taulukkona](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) siten, että saat sovelluksesi näyttämään suunilleen seuraavanlaiselta

<img src="/assets/teht/6.png" height="250">

Muista pitää konsoli koko ajan auki. Jos saat konsoliin seuraavan warningin

<img src="/assets/teht/7.png" height="100">

tee tarvittavat toimenpiteet jotta saat warningin katoamaan. Googlaa tarvittaessa virhelimoituksella.

**Huolehdi nyt ja jatkossa, että konsolissa ei näy mitään warningeja!**

#### 18 anekdootit osa1

Ohjelmistotuotannossa tunnetaan lukematon määrä [anekdootteja](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) eli pieniä "onelinereita", jotka kiteyttävät alan ikuisia totuuksia.

Laajenna seuraavaa sovellusta siten, että siihen tulee nappi, jota painamalla sovellus näyttää _satunnaisen_ ohjelmistotuotantoon liittyvän anekdootin:

```react
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0
    }
  }

  render() {
    return (
      <div>
        {this.props.anecdotes[this.state.selected]}
      </div>
    )
  }
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
```

Google kertoo, miten voit generoida Javascriptilla sopivia satunnaisia lukuja. Muista, että voit testata esim. satunnaislukujen generointia konsolissa.

Sovellus voi näyttää esim. seuraavalta:

<img src="/assets/teht/2.png" height="70">

#### 19 anekdootit osa2

Laajenna sovellusta siten, että näytettävää anekdoottia on mahdollista äänestää:

<img src="/assets/teht/3.png" height="90">

#### 20 anekdootit osa3

Ja sitten vielä lopullinen versio, joka näyttää eniten ääniä saaneen anekdootin:

<img src="/assets/teht/3b.png" height="200">

Tämä saattaa olla jo hieman haastavampi. Tauluoilta löytyy monia hyviä metodeja, katso lisää [Mozillan dokumentaatiosta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

Kurssin normaaliin versioon tullaan todeenäköisesti lisäämään tehtäviä, joissa harjotellaan taulukkojen käsittelyä. Nyt en niitä ehdi tekemään...

Youtubessa on kohtuullisen hyvä [johdatus funktionaaliseen javascript-ohjelmointiin]
(https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84).  Kolmen ensimmäisen osan katsominen riittää hyvin tässä vaiheessa.


## osa 2

### kokoelmien renderöinti

#### 21 kurssien sisältö

Viimeistellään nyt tehtävien 7-11 kurssin sisältöjä renderöivä koodi.

Muutetaan sovelluskomponenttia hiukan sen datan osalta:

```react
const App = () => {
  const kurssi = {
    nimi: 'Half Stack -sovelluskehitys',
    osat: [
      {
        nimi: 'Reactin perusteet',
        tehtavia: 10,
        id: 1,
      },
      {
        nimi: 'Tiedonvälitys propseilla',
        tehtavia: 7,
        id: 2,
      },
      {
        nimi: 'Komponenttien tila',
        tehtavia: 14,
        id: 3,
      }
    ]
  }

  return (
    <div>
      <Kurssi kurssi={kurssi} />
    </div>
  )
}
```

Määrittele sovellukseen myös yksittäisen muotoilusta huolehtiva komponentti _Kurssi_. Komponenttirakenne voi olla esim. seuraava

<pre>
App
  Kurssi
    kurssin nimi
    Sisalto
      Osa
      Osa
      ...
</pre>

ja renderöityvä sivu voi näyttää esim. seuraavalta:

<img src="/assets/teht/8.png" height="150">

Sovelluksen täytyy luonnollisesti toimia riippumatta kurssissa olevien osien määrästä.

Varmista, että konsolissa ei näy mitään virheilmoituksia!

#### 22 tehtävien määrä

Ilmoita myös kurssin yhteenlaskettu tehtävien lukumäärä

<img src="/assets/teht/9.png" height="145">

#### 23 reduce

Jos et jo niin tehnyt, laske koodissasi tehtävien määrä taulkon metodilla [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

#### 24 monta kurssia

Laajennetaan sovellusta siten, että kursseja voi olla _mielivaltainen määrä_:

```react
const App = () => {
  const kurssit = [
    {
      nimi: 'Half Stack -sovelluskehitys',
      id: 1,
      osat: [
        {
          nimi: 'Reactin perusteet',
          tehtavia: 10,
          id: 1,
        },
        {
          nimi: 'Tiedonvälitys propseilla',
          tehtavia: 7,
          id: 2,
        },
        {
          nimi: 'Komponenttien tila',
          tehtavia: 14,
          id: 3,
        }
      ]
    },
    {
      nimi: 'Node.js',
      id: 2,
      osat: [
        {
          nimi: 'Routing',
          tehtavia: 3,
          id: 1,
        },
        {
          nimi: 'Middlewaret',
          tehtavia: 7,
          id: 2,
        },
      ]
    }
  ]

  return (
    <div>
    </div>
  )
}
```

Sovelluksen ulkoasu voi olla esim seuraava:

<img src="/assets/teht/10.png" height="400">

#### 25 erillinen moduuli

Määrittele komponentti _Kurssi_ omana moduulinaan, jonka komponentti _App_ importtaa. Voit sisällyttää kaikki kurssin alikomponentit samaan moduuliin.

### lomakkeet

#### 26 puhelinluettelo osa 1

Toteutetaan yksinkertainen puhelinluettelo. Aluksi lisätään luetteloon vaan nimiä.

Voit ottaa sovelluksesi pohjaksi seuraavan:

```react
class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      persons: [
        { name: 'Arto Hellas' }
      ],
      newName: ''
    }
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <form>
          <div>
            nimi: <input />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <h2>Numerot</h2>
        ...
      </div>
    )
  }
}
```

Tilassa oleva kenttä _newName_ on tarkoitettu lomakkeen kentän kontrollointiin.

Joskus tilan muuttujia ja tarvittaessa muitakin voi olla hyödyllistä renderöidä debugatessa komponenttiin, eli voi lisätä tilapäisesti lisätä komponentin metodin _render_ palauttamaan koodiin esim. seuraavan:

```js
<div>
  debug: {this.state.newName}
</div>
```

Muista myös osan 1 luku [React-sovellusten debuggaus](#React-sovellusten-debuggaus), erityisesti [react developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) on välillä todella kätevä tilan komponentin tilan muutosten seuraamisessa.

Sovellus voi näyttää tässä vaiheessa seuraavalta

<img src="/assets/teht/10.png" height="200">

**Huom:**
* voit käyttää kentän _key_ arvona henkilön nimeä
* muista estää lomakkeen lähetyksen oletusarvoinen toiminta!

#### 27 puhelinluettelo osa 2

Jos lisättävä nimi on jo sovelluksen tiedossa, estä lisäys. Taulukolla on lukuisia sopivia [metodeja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) tehtävän tekemiseen.

Voit antaa halutessasi virheilmoituksen esim. komennolla _alert()_. Se ei kuitenkaan ole tarpeen.

#### 28 puhelinluettelo osa 3

Lisää sovellukseen mahdollisuus antaa henkilöille puhelinnumero. Tarvitset siis lomakkeeseen myös toisen _input_-elementin (ja sille oman muutoksenkäsittelijän):

```html
<form>
  <div>
    nimi: <input />
  </div>
  <div>
    numero: <input />
  </div>
  <div>
    <button type="submit">lisää</button>
  </div>
</form>
```

Sovellus voi näyttää tässä vaiheessa seuraavalta. Kuvassa myös [react developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):in tarjoama näkymä komponentin _App_ tilaan:

<img src="/assets/teht/11.png" height="300">

#### 29 puhelinluettelo osa 4

Tee lomakkeeseen hakukenttä, jonka avulla näytettävien nimien listaa voidaan rajata:

<img src="/assets/teht/12.png" height="300">

Rajausehdon syöttämisen voi hoitaa omana lomakkeeseen kuulumattomana _input_-elementtinä. Kuvassa rajausehdosta on tehty _caseinsensitiivinen_ eli ehto _arto_ löytää isolla kirjaimella kirjoitetun Arton.

**Huom:** Kun toteutat jotain uutta toiminnallisuutta, on usein hyötyä 'kovakoodata' sovellukseen jotain sisältöä, esim.

```js
constructor(props){
  super(props)
  this.state = {
    persons: [
      { name: 'Arto Hellas', number: '040-123456' },
      { name: 'Martti Tienari', number: '040-123456' },
      { name: 'Arto Järvinen', number: '040-123456' },
      { name: 'Lea Kutvonen', number: '040-123456' }
    ],
    newName: '',
    newNumber: '',
    filter: ''
  }
}
```

Näin vältytään turhalta manuaaliselta työltä, missä testaaminen edellyttäisi myös testiaineiston syöttämistä käsin soveluksen lomakkeen kautta.

Kurssin seuraavasta osasta alkaen alamme määrittelemään sovelluksemme _testejä_ jotka tietyissä tapauksissa hoitavat kovakoodatun apusyötteen roolia.

#### 30 puhelinluettelo osa 5

Jos koko sovelluksesi on tehty yhteen komponenttiin, refaktoroi sitä eriyttämällä sopivia komponentteja. Pidä kuitenkin edelleen kaikki tila juurikomponentissa.

### datan hakeminen palvelimelta

#### 31 puhelinluettelo osa 6

Talleta sovelluksen alkutila projektin juureen sijoitettavaan tiedostoon _db.json_

```json
{
  "persons": [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
		},
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]
}
```

Käynnistä json-server porttiin 3001 ja varmista selaimella, että palvelin palauttaa henkilölistan.

Muuta sovellusta siten, että datan alkutila haetaan _axios_-kirjaston avulla palvelimelta. Hoida datan hakeminen [lifecyclemetodissa](/osa2#komponenttien-lifecycle-metodit) _componentWillMount_.

#### 32 maiden tiedot

Rajapinta [https://restcountries.eu](https://restcountries.eu) tarjoaa paljon eri maihin liittyvää tietoa koneluettavassa muodossa REST-apina.

Tee sovellus, jonka avulla toit tarkastella eri maiden tietoja. Sovelluksen kannattaa hakea tiedot endpointista [all](https://restcountries.eu/#api-endpoints-all)

Sovelluksen käyttöliittymä on yksinkertainen. Näytettävä maa haetaan kirjoittamalla hakuehto etsintäkenttään.

Jos ehdon täyttäviä maita on liikaa (yli 10), kehoitetaan tarkentamaan hakuehtoa

<img src="/assets/teht/13.png" height="300">

Jos maita on alle kymmenen, mutta yli 1 näytetään hakuehdon täyttävät maat

<img src="/assets/teht/14.png" height="300">

Kun ehdon täyttäviä maita on enää yksi, näytetään maan lippu sekä perustiedot:

<img src="/assets/teht/15.png" height="300">

#### 33 maiden tiedot klikkaamalla

Paranna sovellusta siten, että kun sivulla näkyy useiden maiden nimiä, riittää maan nimen klikkaaminen tarkentamaan haun siten, että klikatun maan tarkemmat tiedot saadaan näkyviin.

Huomaa, että saat "nimestä" klikattavan kiinnittämällä nimen sisältävään elementtiin, esim. diviin klikkaustenkuuntelijan:

```
<div onClick={...}>
  {country.name}
</div>
```
### palvelimella olevan datan päivitäminen

#### 34 puhelinluettelo osa 7

Palataan jälleen puhelinluettelon pariin.

Tällä hetkellä luetteloon lisättäviä uusia numeroita ei synkronoida palvelimelle. Korjaa tilanne.

#### 35 puhelinluettelo osa 8

Siirrä palvelimen kanssa kommunikoinnista vastaava toiminnallisuus omaan monduuliin osan 2 [esimerkin](#palvelimen-kanssa-tapahtuvan-komunikoinnin-eristäminen-omaan-moduuliin) tapaan.

#### 35 puhelinluettelo osa 9

Tee ohjelmaan mahdollisuus yhteystietojen poistamiseen. Poistaminen voi tapahtua esim. nimen yhteyteen liitetyllä napilla. Poiston suorittaminen voidaan varmistaa käyttäjältä [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)-metodilla:

<img src="/assets/teht/16.png" height="300">

Pavelimelta tiettyä henkilöä vastaava resurssi tuhotaan tekemällä HTTP DELETE -pyyntö resurssia vastaavaan _URL_:iin, eli jos poistaisimme esim. käyttäjän, jonka _id_ on 2, tulisi tapauksessamme tehdä HTTP DELETE osoitteeseen _localhost:3001:persons/2_. Pyynnön mukana ei lähetetä mitään dataa.

[Axios](https://github.com/axios/axios)-kirjaston avulla HTTP DELETE -pyyntö tehdään samaan tapaan kuin muutkin pyynnöt.

#### 37 puhelinluettelo osa 10

Muuta toiminnallisuutta siten, että jos jo olemassaolevalle henkilölle lisätään numero, korvaa lisätty numero aiemman numeron. Huolehdi siitä, että yhteystietojen listan järjestys ei muutu muutosten myötä.

### tyylit

#### 38 puhelinluettelo osa 11

Toteuta osan 2 esimerkin [parempi virheilmoitus](osa#parempi-virheilmoitus) tyyliin ruudulla muutaman sekunnin näkyvä ilmoitus, joka kertoo onnistuneista operaatioista (henkilön lisäys ja poisto, sekä numeron muutos):

<img src="/assets/teht/17.png" height="300">

#### 39 puhelinluettelo osa 12

Jos poistat jonkun henkilön toisesta selaimesta hieman ennen kun yrität _muuttaa henkilön numeroa_ toisesta selaimesta, tapahtuu virhetilanne:

<img src="/assets/teht/18.png" height="300">

Korjaa ongelma osan 2 esimerkin [promise ja virheet](#promise-ja-virheet) tapaan. Loogisin korjaus lienee henkilön lisääminen uudelleen palvelimelle.

## osa 3
