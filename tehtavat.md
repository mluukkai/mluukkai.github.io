# tehtävät

Muut osat: [2](#osa-2) [3](#osa-3) [4](#osa-4) [5](#osa-5) [6](#osa-6) [7](#osa-7)

## Osa 1

### web-sovellusten perusteet ###

#### 1 HTML ja CSS ####

Kertaa HTML:n ja CSS:n perusteet lukemalla Mozillan tutoriaali [HTML:stä](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics) ja [CSS:stä](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)

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
  const kurssi = 'Half Stack -sovelluskehitys'
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

Komponentin _App_ runko tulee olevaan suunnilleen seuraavanlainen:

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
    tehtavia: 10
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
        tehtavia: 10
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

Jos olet määritellyt jokaiselle napille oman tapahtumankäsittelijän, refaktoroi sovellustasi siten, että kaikki napit käyttävät samaa tapahtumankäsittelijäfunktiota samaan tapaan kuin materiaalin luvussa [funktio joka palauttaa funktion](https://mluukkai.github.io/osa1/#funktio-joka-palauttaa-funktion)

#### 17 unicafe osa6

Toteuta tilastojen näyttäminen HTML:n [taulukkona](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) siten, että saat sovelluksesi näyttämään suunnilleen seuraavanlaiselta

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

Tämä saattaa olla jo hieman haastavampi. Taulukolta löytyy monia hyviä metodeja, katso lisää [Mozillan dokumentaatiosta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

Kurssin normaaliin versioon tullaan todennäköisesti lisäämään tehtäviä, joissa harjoitellaan taulukkojen käsittelyä. Nyt en niitä ehdi tekemään...

Youtubessa on kohtuullisen hyvä [johdatus funktionaaliseen javascript-ohjelmointiin](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84). Kolmen ensimmäisen osan katsominen riittää hyvin tässä vaiheessa.


## Osa 2

### Kokoelmien renderöinti

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
        id: 1
      },
      {
        nimi: 'Tiedonvälitys propseilla',
        tehtavia: 7,
        id: 2
      },
      {
        nimi: 'Komponenttien tila',
        tehtavia: 14,
        id: 3
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

Jos et jo niin tehnyt, laske koodissasi tehtävien määrä taulukon metodilla [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

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
          id: 1
        },
        {
          nimi: 'Tiedonvälitys propseilla',
          tehtavia: 7,
          id: 2
        },
        {
          nimi: 'Komponenttien tila',
          tehtavia: 14,
          id: 3
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
          id: 1
        },
        {
          nimi: 'Middlewaret',
          tehtavia: 7,
          id: 2
        }
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
  constructor(props) {
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

```html
<div>
  debug: {this.state.newName}
</div>
```

Muista myös osan 1 luku [React-sovellusten debuggaus](#React-sovellusten-debuggaus), erityisesti [react developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) on välillä todella kätevä tilan komponentin tilan muutosten seuraamisessa.

Sovellus voi näyttää tässä vaiheessa seuraavalta

![]({{ "/assets/teht/11.png" | absolute_url }})

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

![]({{ "/assets/teht/12.png" | absolute_url }})

#### 29 puhelinluettelo osa 4

Tee lomakkeeseen hakukenttä, jonka avulla näytettävien nimien listaa voidaan rajata:

![]({{ "/assets/teht/12c.png" | absolute_url }})

Rajausehdon syöttämisen voi hoitaa omana lomakkeeseen kuulumattomana _input_-elementtinä. Kuvassa rajausehdosta on tehty _caseinsensitiivinen_ eli ehto _arto_ löytää isolla kirjaimella kirjoitetun Arton.

**Huom:** Kun toteutat jotain uutta toiminnallisuutta, on usein hyötyä 'kovakoodata' sovellukseen jotain sisältöä, esim.

```js
constructor(props) {
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

![]({{ "/assets/teht/13.png" | absolute_url }})

Jos maita on alle kymmenen, mutta yli 1 näytetään hakuehdon täyttävät maat

![]({{ "/assets/teht/14.png" | absolute_url }})


Kun ehdon täyttäviä maita on enää yksi, näytetään maan lippu sekä perustiedot:

![]({{ "/assets/teht/15.png" | absolute_url }})

### palvelimella olevan datan päivittäminen

#### 33 maiden tiedot klikkaamalla

Ennen puhelinluettelon jatkokehitystä harjoitellaan vielä elementtikohtaisten tapahtumakäsittelijöiden käyttöä.

Paranna edellisen tehtävän maasovellusta siten, että kun sivulla näkyy useiden maiden nimiä, riittää maan nimen klikkaaminen tarkentamaan haun siten, että klikatun maan tarkemmat tiedot saadaan näkyviin.

Huomaa, että saat "nimestä" klikattavan kiinnittämällä nimen sisältävään elementtiin, esim. diviin klikkaustenkuuntelijan:

```
<div onClick={...}>
  {country.name}
</div>
```

#### 34 puhelinluettelo osa 7

Palataan jälleen puhelinluettelon pariin.

Tällä hetkellä luetteloon lisättäviä uusia numeroita ei synkronoida palvelimelle. Korjaa tilanne.

#### 35 puhelinluettelo osa 8

Siirrä palvelimen kanssa kommunikoinnista vastaava toiminnallisuus omaan monduuliin osan 2 [esimerkin](#palvelimen-kanssa-tapahtuvan-komunikoinnin-eristäminen-omaan-moduuliin) tapaan.

#### 36 puhelinluettelo osa 9

Tee ohjelmaan mahdollisuus yhteystietojen poistamiseen. Poistaminen voi tapahtua esim. nimen yhteyteen liitetyllä napilla. Poiston suorittaminen voidaan varmistaa käyttäjältä [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)-metodilla:

<img src="/assets/teht/16.png" height="300">

Palvelimelta tiettyä henkilöä vastaava resurssi tuhotaan tekemällä HTTP DELETE -pyyntö resurssia vastaavaan _URL_:iin, eli jos poistaisimme esim. käyttäjän, jonka _id_ on 2, tulisi tapauksessamme tehdä HTTP DELETE osoitteeseen _localhost:3001:persons/2_. Pyynnön mukana ei lähetetä mitään dataa.

[Axios](https://github.com/axios/axios)-kirjaston avulla HTTP DELETE -pyyntö tehdään samaan tapaan kuin muutkin pyynnöt.

#### 37 puhelinluettelo osa 10

Muuta toiminnallisuutta siten, että jos jo olemassaolevalle henkilölle lisätään numero, korvaa lisätty numero aiemman numeron. Huolehdi siitä, että yhteystietojen listan järjestys ei muutu muutosten myötä.

### tyylit

#### 38 puhelinluettelo osa 11

Toteuta osan 2 esimerkin [parempi virheilmoitus](osa2/#parempi-virheilmoitus) tyyliin ruudulla muutaman sekunnin näkyvä ilmoitus, joka kertoo onnistuneista operaatioista (henkilön lisäys ja poisto, sekä numeron muutos):

<img src="/assets/teht/17.png" height="300">

#### 39 puhelinluettelo osa 12

Jos poistat jonkun henkilön toisesta selaimesta hieman ennen kun yrität _muuttaa henkilön numeroa_ toisesta selaimesta, tapahtuu virhetilanne:

<img src="/assets/teht/18.png" height="300">

Korjaa ongelma osan 2 esimerkin [promise ja virheet](osa2/#promise-ja-virheet) tapaan. Loogisin korjaus lienee henkilön lisääminen uudelleen palvelimelle.

## Osa 3

Tämän osan tehtävissä teemme backendin edellisen osan puhelinluettelosovellukseen.

### Expressin alkeet

#### 40 puhelinluettelon backend osa 1

**HUOM** tämän osan tehtäväsarja kannattaa tehdä omaan git-repositorioon, suoraan repositorion juureen! Jos et tee näin, joudut ongelmiin tehtävässä 49.

Tee node-sovellus, joka tarjoaa osoitteessa <http://localhost:3001/api/persons> kovakoodatun taukkoon listan puhelinnumerotietoja:

![]({{ "/assets/teht/19.png" | absolute_url }})

Huomaa, että noden routejen määrittelyssä merkkijonon _api/persons_ kenoviiva käyttäytyy kuten mikä tahansa muu merkki.

Sovellus pitää pystyä käynnistämään komennolla _npm start_.

Komennolla _npm run watch_ käynnistettäessa sovelluksen tulee käynnistyä uudelleen kun koodiin tehdään muutoksia.

#### 41 puhelinluettelon backend osa 2

Tee sovelluksen osoitteeseen <http://localhost:3001/info> suunilleen seuraavanlainen sivu

![]({{ "/assets/teht/20.png" | absolute_url }})

eli sivu kertoo pyynön tekohetken sekä sen kuinka monta puhelinluettelotietoa sovelluksen muistissa olevassa taulukossa on.

#### 42 puhelinluettelon backend osa 3

Toteuta toiminnallisuus yksittäisen puhelinnumerotiedon näyttämiseen. Esim. id:n 5 omaavan numerotiedon url on <http://localhost:3001/api/persons/5>

Jos id:tä vastaavaa puhelinnumerotietoa ei ole, tulee palvelimen vastata asianmukaisella statuskoodilla.

#### 43 puhelinluettelon backend osa 3

Toteuta toiminnallisuus, jonka avulla puhelinnumerotieto on mahdollista poistaa numerotiedon yksilöivään URL:iin tehtävällä HTTP DELETE -pyynnöllä.

Testaa toiminnallisuus Postmanilla.

#### 44 puhelinluettelon backend osa 4

Laajenna backendia siten, että uusia puhelintietoja on mahdollista lisätä osoitteeseen <http://localhost:3001/api/persons> tapahtuvalla HTTP POST -pyynnöllä.

Generoi uuden puhelintiedon tunniste funktiolla [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random). Käytä riittävän isoa arvoväliä jotta arvottu id on riittävän suurella todennäköisyydellä sellainen, joka ei ole jo käytössä.

#### 45 puhelinluettelon backend osa 5

Tee uuden numeron lisäykseen virheiden käsittely, pyyntö ei saa onnistua, jos
- jos nimi tai numero puuttu
- lisättävälle nimelle on jo numero luettelossa

Vastaa asiaankuuluvalla statuskoodilla, liitä vastaukseen mukaan myös tieto, joka kertoo virheen syyn, esim:

```js
{ error: 'name must be unique' }
```

### lisää middlewareja

#### 46 puhelinluettelon backend osa 6

Lisää sovellukseesi loggausta tekevä middleware [morgan](https://github.com/expressjs/morgan). Konfiguroi se tulostamaan konsoliin _tiny_-konfiguraation mukaisesti.

Morganin ohjeet eivät ole ehkä kaikkein selvimmät ja joudut kenties miettimään hiukan. Toisaalta juuri koskaan dokumentaatio ei ole aivan itsestäänselvää, joten kryptisempiäkin asioita on hyvä oppia tulkitsemaan.

#### 47 puhelinluettelon backend osa 7

Konfiguroi morgania siten, että se näyttää myös HTTP-pyyntöjen mukana tulevan datan:

![]({{ "/assets/teht/21.png" | absolute_url }})

Tämä tehtävä ei välttämättä ole helpommasta päästä. Pari vihjettä:
- [creating new tokens](https://github.com/expressjs/morgan#creating-new-tokens)
- [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

### yhteys frontendiin ja vienti tuotantoon

#### 48 puhelinluettelon backend osa 8

Laita backend toimimaan edellisessä osassa tehdyn puhelinluettelon frontendin kanssa.

Joudut tekemään erinäisiä pieniä muutoksia. Muista pitää selaimen konsoli koko ajan auki. Jos jotkut HTTP-pyynnöt epäonnistuvat, kannattaa katsoa _Network_-välilehdeltä mitä tapahtuu. Pidä myös silmällä mitä palvelimen konsolissa tapahtuu. Jos et tehnyt tehtävää 47, kannattaa POST-pyyntöä käsittelevässä tapahtumankäsittelijässä tulostaa konsoliin mukana tuleva data eli _request.body_.

#### 49 puhelinluettelon backend osa 9

Vie sovelluksen backend internetiin, esim. Herokuun.

Testaa selaimen ja postmanin avulla, että internetissä oleva backend toimii.

Tee repositorion juureen tiedosto README.md ja lisää siihen linkki internetissä olevaan sovellukseesi.

#### 50 puhelinluettelo full stack

Generoi frontendistä tuotantoversio ja lisää se internetissä olevaan sovellukseesi osan 3 [tapaa noudatellen](osa3/#staattisten-tiedostojen-tarjoaminen-backendistä)

Huolehdi myös, frontend toimii edelleen myös paikallisesti.

**PRO TIP:** kun deployaat sovelluksen herokuun, kannattaa ainakin alkuvaiheissa pitää **KOKO AJAN** näkyvillä herokussa olevan sovelluksen loki antamalla komento <code>heroku logs -t</code>:

![]({{ "/assets/teht/22.png" | absolute_url }})

### mongoosen alkeet

#### 51 tietokanta komentoriviltä

Luo sovellukselle pilvessä oleva mongo esim. Herokun avulla.

Tee projektihakemistoon tiedosto _mongo.js_, jonka avulla voit lisätä tietokantaan puhelinnumeroja sekä listata kaikki kannassa olevat numerot.

Ohjelma toimii siten, että jos sille annetaan käynnistäessä kaksi komentoriviparametria, esim:

```bash
node mongo.js Joulupukki 040-1234556
```

Ohjelma tulostaa

```bash
lisätään henkilö Joulupukki numero 040-1234556 luetteloon
```

ja lisää uuden yhteystiedon tietokantaan. Huomaa, että jos nimi sisältää välilyöntejä, on se annettava hipsuissa:

```bash
node mongo.js 'Arto Vihavainen' 040-1234556
```

Jos komentoriviparametreja ei anneta, eli ohjelma suoritetaan komennolla

```bash
node mongo.js
```

tulostaa ohjelma tietokannassa olevat numerotiedot:

<pre>
puhelinluettelo:
Pekka Mikkola 040-1234556
Arto Vihavainen 045-1232456
Tiina Niklander 040-1231236
</pre>

Saat selville ohjelman komentoriviparametrit muuttujasta [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv)

#### 52 tietokanta komentoriviltä, finetuning

Parantele ohjelmaasi siten, että koko luettelon tulostaminen tapahtuu (etunimen mukaisessa) aakkosjärjestyksessä, ja puhelinnumerot tulostuvat alkaen samasta kohdasta riviä, eli tulostus on suunilleen seuraavanlainen

<pre>
puhelinluettelo:
Arto Vihavainen    045-1232456
Joulupukki         09-342322
Pekka Mikkola      040-1234556
Tiina Niklander    040-1231236
</pre>

### backend ja tietokanta

Seuraavat tehtävät saattavat olla melko suoraviivaisia, tosin jos frontend-koodissasi sattuu olemaan bugeja tai epäyhteensopivuutta backendin kanssa, voi seurauksena olla myös mielenkiintoisia bugeja.

#### 53 puhelinluettelo ja tietokanta, osa 1

Muuta backendin kaikkien puhelintietojen näyttämistä siten, että se hakee näytettävät puhelintiedot tietokannasta.

Varmista, että frontend toimii muutosten jälkeen.

Tee tässä ja seuraavissa tehtävissä mongoose-spesifinen koodi omaan moduuliin samaan tapaan kuin osan 3 luvussa [tietokantamäärittelyjen eriyttäminen omaksi moduuliksi](osa3#tietokantamäärittelyjen-eriyttäminen-omaksi-moduuliksi)

#### 54 puhelinluettelo ja tietokanta, osa 2

Mutta backendiä siten, että uudet numerot tallennetaan tietokantaan. Tässä vaiheessa voit olla välittämättä siitä, onko tietokannassa jo henkilöä jolla on sama nimi kuin lisättävällä.

Varmista, että frontend toimii muutosten jälkeen.

### lisää operaatiota

**HUOM:** vaikka et jostain syystä käsittelisikään promiseihin liittyviä virhetilanteita, on viisasta rekisteröidä promiseille virheenkäsittelijä, joka tulostaa virheen syyn konsoliin:

```js
.catch(error => {
  console.log(error)
  // ...
})
```

näin vältyt monilta ikäviltä yllätyksiltä.

#### 55 puhelinluettelo ja tietokanta, osa 3

Mutta backendiä siten, että numerotietojen poistaminen päivittyy tietokantaan.

Varmista, että frontend toimii muutosten jälkeen.

#### 56 puhelinluettelo ja tietokanta, osa 4

Jos frontendissä annetaan numero henkilölle, joka on jo olemassa, päivittää frontend tiedot uudella tekemällä HTTP PUT -pyynnön henkilön tietoja vastaavaan url:iin.

Laajenna backendisi käsittelemään tämä tilanne.

Varmista, että frontend toimii muutosten jälkeen.

#### 57 puhelinluettelo ja tietokanta, osa 5

Päivitä myös polkujen _api/persons/:id_ ja _info_ käsittely, ja varmista niiden toimivuus suoraan selaimella.

#### 58 puhelinluettelo ja tietokanta, osa 6

Huolehdi, että backendiin voi lisätä yhdelle nimelle ainoastaan yhden numeron. Jos HTTP POST -pyyntö yrittää lisätä nimeä, joka on jo puhelinluettelossa, tulee vastata sopivalla statuskoodilla ja lisätä vastaukseen asianmukainen virheilmoitus.

Tämä tehtävä saattaa olla jossain määrin hankala. Osassa 4 esitettävä async/await-syntaksi helpottaa tehtävän tekemistä, eli jos joudut ongelmiin, älä juutu tehtävään liian pitkäksi aikaa.

### loppuhuipennus

#### 59 eriytetty sovelluskehitys- ja tuotantotietokanta
Käytettävän tietokannan voit konfiguroida seuraten osan 3 lukua [sovelluksen vieminen tuotantoon](osa3#sovelluksen-vieminen-tuotantoon).

## Osa 4

Rakennamme tämän osan tehtävissä _blogilistasovellusta_, jonka aulla käyttäjien on mahdollista tallettaa tietoja internetistä löytämistään mielenkiintoisista blogeista. Kustakin blogista talletetaan sen kirjoittaja (author), aihe (title), url sekä blogilistasovelluksen käyttäjien antamien äänien määrä.

Blogilistasovellus muistuttaa huomattanvasti syksyn ohjelmistotuotantokurssin miniprojekteissa tehyvä [ohjelmistoa](https://github.com/mluukkai/ohjelmistotuotanto2017/wiki/miniprojekti-speksi).

### sovelluksen alustus ja rakenne

#### 60 blogilista, osa 1

Saat sähköpostitse yhteen tiedostoon koodatun sovellusrungon:

```js
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog

app.use(cors())
app.use(bodyParser.json())

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl, { useMongoClient: true })
mongoose.Promise = global.Promise

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Tee sovelluksesta toimiva _npm_-projekti. Jotta sovelluskehitys olisi sujuvaa, konfiguroi sovellus suoritettavaksi _nodemon_:illa.

#### 60 blogilista, osa 2

Jaa sovelluksen koodi osan 4 [alun](/osa4) tapaan useaan moduuliin.

**HUOM** etene todella pienin askelin, varmistaen että kaikki toimii koko ajan. Jos yrität "oikaista" tekemällä monta asiaa kerralla, on [Murphyn lain](https://fi.wikipedia.org/wiki/Murphyn_laki) perusteella käytännössä varmaa, että jokin menee pahasti pieleen ja "oikotien" takia maaliin päästään paljon myöhemmin kuin systemaattisin pienin askelin.

Paras käytänne on commitoida koodi aina stabiilissa tilanteessa, tällöin on helppo palata aina toimivaan tilanteeseen jos koodi menee liian solmuun.

### yksikkötestaus

Tehdään joukko blogilistan käsittelyyn tarkoitettuja apufunktioita. Tee funktiot esim. tiedoston _utils/list_helper.js_. Tee testit sopivasti nimettyyn tiedostoon hakemistoon _test_.

**HUOM:** jos jokin teksti on rikki ei mene läpi, ei kannata ongelmaa korjatessa suorittaa kaikkia testejä vaan ainoastaan rikkinäistä testiä hyödyntäen [only](https://facebook.github.io/jest/docs/en/api.html#testonlyname-fn-timeout)-metodia.

#### 61 apufunktioita ja yksikkötestejä, osa 1

Määrittele ensin funktio _dummy_ joka saa parametrikseen taulukollisen blogeja ja palauttaa aina luvun 1. Tiedoston _list_helper.js_ sisällöksi siis tulee tässä vaiheessa

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

Varmista testikonfiguraatiosi toimivuus seuraavalla testillä:

```js
const list = require('../utils/list_helper')

test('dummy is called', () => {
  const blogs = []

  const result = list.dummy(blogs)
  expect(result).toBe(1)
})
```

#### 62 apufunktioita ja yksikkötestejä, osa 2

Määrittele funktio _totalLikes_ joka saa parametrikseen taulukollisen blogeja. Funktio palauttaa blogien yhteenlaskettujen tykkäysten eli _likejen_ määrän.

Määrittele funktiolle sopivat testit. Funktion testit kannattaa laittaa _describe_-lohkoon jolloin testien tulostus ryhmittyy miellyttävästi:

![]({{ "/assets/teht/23.png" | absolute_url }})

Testisyötteiden määrittely onnistuu esim. seuraavaan tapaan:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})
```

Törmäät varmasti testien tekemisen yhteydessä erinäisiin ongelmiin. Pidä mielessä osassa 3 käsitellyt [dabuggaukseen](osa3/#Node-sovellusten-debuggaaminen) liittyvät asiat, voit testejäkin suorittaessasi printtailla konsoliin komennolla _console.log_

#### 63 apufunktioita ja yksikkötestejä, osa 2

Määrittele funktio _favoriteBlog_ joka saa parametrikseen taulukollisen blogeja. Funktio selvittää millä blogilla on eniten likejä. Paluuarvo voi olla esim. seuraavassa muodossa:

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

Tee myös tämän ja seuraavien kohtien testit kukin oman _describe_-lohkon sisälle.

#### 64 apufunktioita ja yksikkötestejä, osa 4

Tämä ja seuraava tehtävä ovat jo hieman haastavampia.

Määrittele funktio _mostBlogs_ joka saa parametrikseen taulukollisen blogeja. Funktio selvittää _kirjoittajan_, kenellä on eniten blogeja. Funktion paluuarvo kertoo myös ennätysblogaajan blogien määrän:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

#### 65 apufunktioita ja yksikkötestejä, osa 5

Määrittele funktio _mostLikes_ joka saa parametrikseen taulukollisen blogeja. Funktio selvittää kirjoittajan, kenen blogeilla on eniten likejä. Funktion paluuarvo kertoo myös suosikkiblogaajan likejen yhteenlasketun määrän:

```js
{
  author: "Edsger W. Dijkstra",
  votes: 17
}
```

### API:n testaaminen

**Huom** materiaalissa käytetään muutamaan kertaan ekspektaatiota [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) tarkastettaessa että jokin arvo on taulukossa. Kannattaa huomata, että metodi käyttää samuuden vertailuun ===-operaattoria ja olioiden kohdalla tämä ei ole useinkaan se mitä halutaan ja parempi vaihtoehto onkin [toContainEqual](https://facebook.github.io/jest/docs/en/expect.html#tocontainequalitem).

#### 66 blogilistan testit, osa 1

Tee API-tason testit blogilistan osoitteeseen /api/blogs tapahtuvalle HTTP GET -pyynnölle.

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

Huomaa, että joudut tekemään koodiin osan 4 materiaalin tyylin joukon muutoksia (mm. testausympäristön määrittely), jotta saat järkevästi määriteltyä API-tason testejä.

#### 67 blogilistan testit, osa 2

Tee testit blogin lisäämiselle, eli osoitteeseen /api/blogs tapahtuvalle HTTP POST -pyynnölle.

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

#### 68 blogilistan testit, osa 2

Tee testi joka varmistaa, että jos kentälle _likes_ ei anneta arvoa, asetetaan sen arvoksi 0. Muiden kenttien sisällöstä ei tässä tehtävässä vielä välitetä.

Laajenna ohjelmaa siten, että testi menee läpi.

#### 69 blogilistan testit, osa 3

Tee testit blogin lisäämiselle, eli osoitteeseen /api/blogs tapahtuvalle HTTP POST -pyynnölle, joka varmistaa, että jos uusi blogi ei sisällä kenttiä _title_ ja _url_, pyyntöön vastataan statuskoodilla _400 Bad request_

Laajenna toteutusta siten, että testit menevät läpi.

### Lisää toiminnallisuutta ja testejä

#### 70 blogilistan laajennus, osa 1

Refaktoroi projektin testit siten, että ne eivät enää ole riippuvaisia siitä, että HTTP GET -operaatioiden testit suoritetaan ennen uusien blogien lisäämisen testaamista.

#### 71 blogilistan laajennus, osa 2

Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.

Määrittele ensin toiminnallisuutta testaavat testit ja tämän jälkeen toteuta toiminnallisuus. Noudata operaation HTTP-rajapinnan suhteen [RESTful](osa3/#REST)-käytänteitä.

#### 72 blogilistan laajennus, osa 3

Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen.

Tarvitsemme muokkausta lähinnä _likejen_ lukumäärän päivittämiseen, mutta toiminnallisuuden voi toteuttaa samaan tapaan kuin muistiinpanon päivittäminen toteutettiinn [osassa 3](osa3/#loput-operaatiot).

### Blogilistan käyttäjät

Seuraavien tehtävien myötä Blogilistalle luodaan käyttäjienhallinnan perusteet. Varminta on seurata melko tarkkaa osan 4 luvusta [Käyttäjien hallinta ja monimutkaisempi tietokantaskeema](osa4/#Käyttäjien-hallinta-ja-monimutkaisempi-tietokantaskeema) alkavaa tarinaa. Toki luovuus on sallittua.

#### 73 blogilistan laajennus, osa 4

Tee sovellukseen mahdollisuus luoda käyttäjiä tekemällä HTTP POST -pyyntö osoitteeseen _api/users_. Käyttäjillä on käyttäjätunnus, salasana ja nimi sekä totuusarvoinen kenttä, joka kertoo onko käyttäjä täysi-ikäinen.

Älä talleta tietokantaan salasanoja selväkielisenä vaan käytä osan 4 luvun [Käyttäjien luominen](osa4/#Käyttäjien-luominen) tapaan _bcrypt_-kirjastoa.

Tee järjestelmään myös mahdollisuus katsoa kaikkien käyttäjien tiedot sopivalla HTTP-pyynnöllä.

Käyttäjäien lista voi näyttää esim. seuraavalta:
![]({{ "/assets/teht/24.png" | absolute_url }})

#### 74 blogilistan laajennus, osa 5

Laajenna käyttäjätunnusten luomista siten, että käyttäjätunnuksen ja salasanan tulee olla vähintään 3 merkkiä pitkiä ja käyttäjätunnus on järjestelmässä uniikki. Jos täysi-ikäisyydelle ei määritellä luotaessa arvoa, on se oletusarvoisesti true.

Luomisoperaation tulee palauttaa sopiva statuskoodi ja kuvaava virheilmoitus, jos yritetään luoda epävalidi käyttäjä.

Tee testit, jotka varmistavat, että viheellisiä käyttäjiä ei luoda, ja että virheellisen käyttäjän luomisoperaatioon vastaus on järkevä statuskoodin ja virheilmoituksen osalta.

#### 75 blogilistan laajennus, osa 6

Laajenna blogia siten, että blogiin tulee tieto sen lisänneestä käyttäjästä.

Muokkaa blogien lisäystä osan 4 luvun [populate](osa4/#populate) tapaan siten, että blogin lisämisen yhteydessä määritellään blogin lisääjäksi _joku_ järjestelmän tietokannassa olevista käyttäjistä (esim. ensimmäisenä löytyvä). Tässä vaiheessa ei ole väliä kuka käyttäjistä määritellään lisääväksi. Toiminnallisuus viimeistellään tehtävässä 77

Muokaa kaikkien blogien listausta siten, että blogien yhteydessä näytetään lisääjän tiedot:

![]({{ "/assets/teht/25.png" | absolute_url }})

ja käyttäjien listausta siten että käyttäjien lisäämät blogit ovat näkyvillä

![]({{ "/assets/teht/26.png" | absolute_url }})

#### 76 blogilistan laajennus, osa 7

Toteuta osan 4 luvun [Kirjautuminen](osa4/#kirjautuminen) tapaan järjestelmään token-perustainen autentikointi.

Blogin lisääminen tulee olla mahdollista vain, jos lisäyksen tekevässä HTTP POST -pyynnössä on mukana validi token. Tokenin haltija määritellään blogin lisääjäksi.

#### 77 blogilistan laajennus, osa 8

Osan 4 [esimerkissä](osa4/#kirjautuminen) token otetaan headereista apufunktion _getTokenFrom_ avulla.

Jos käytit samaa ratkaisua, refaktoroi tokenin erottaminen [middlewareksi](osa3/#middleware), joka ottaa tokenin _Authorization_-headerista ja sijoittaa sen _request_-olion kenttään _token_.

Eli kun rekisteröit middlewaren ennen routeja tiedostossa _index.js_

```js
app.use(middleware.tokenExtractor)
```

pääsevät routet tokeniin käsiksi suoraan viittaamalla _request.token_:

```js
blogsRouter.post('/', async (request, response) => {
    // ..
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // ..
  }
})
```

#### 78 blogilistan laajennus, osa 9

Muuta blogin poistavaa operaatiota siten, että poisto onnistuu ainoastaan jos poisto-operaation tekijä (eli se kenen token on pyynnön mukana) on sama kuin blogin lisääjä.

Jos poistoa yritetään ilman tokenia tai väärän käyttäjän toimesta, tulee operaation palauttaa asiaankuuluva statuskoodi.

Huomaa, että jos haet blogin tietokannasta

```js
const blog = await Blog.findById(...)
```

ei kenttä _blog.user_ ole tyypiltään merkkijono vaan _object_. Eli jos haluat verrata kannasta haetun olion id:tä merkkijonomuodossa olevaan id:hen, ei normaali vertailu toimi. Kannasta haettu id tulee muuttaa vertailua varten merkkijonoksi:

```js
if ( blog.user.toString() === userid ) ...
```

#### 79 blogilistan laajennus, osa 10

Tee testit tehtävän 78 toiminnallisuudelle.

### ESlint

#### 80 lint-konfiguraatio

Ota sovellukseesi käyttöön ESlint.

## Osa 5

Teemme nyt edellisen osan tehtävissä tehtyä bloglist-backendia käyttävän frontendin. Voit ottaa tehtävien pohjaksi [Githubista](https://github.com/mluukkai/bloglist-frontend) olevan sovellusrungon. Sovellus olettaa, että backend on käynnissä koneesi portissa 3003.

Tämän kerran alkupään tehtävät käytännössä kertaavat kaiken oleellisen tämän kurssin puitteissa Reactista läpikäydyn asian ja voivat siinä mielessä olla kohtuullisen haastavia, erityisesti jos edellisen osan tehtävissä toteuttamasi backend toimii puutteellisesti.

Muista tehtäviä tehdessäsi kaikki debuggaukseen liittyvät käytänteet, erityisesti konsolin tarkkailu.

**HUOM** koska create-react-app:illa kehitettävät sovellukset toimivat oletusarvoisesti _localhostin_ portissa 3000 kannattaa huomata, että _localStorage_ säilyttää arvonsa vaikka käyttäisit eri sovellusta. Tämä voi aiheuttaa mielenkiintoisa ongelmia jos asiaan ei osaa varautua.

Kun siirryt kehittämään uutta sovellusta, onkin varminta aina aluksi nollata local storage konsolista komennolla <code>window.localstorage.clear()</code>

### kirjautuminen ja blogien luonti

#### 81 blogilistan frontend, osa 1

Toteuta frontendiin kirjautumisen mahdollistava toiminnallisuus. Kirjautumisen yhteydessä backendin palauttama token tallennetaan sovelluksen tilan kenttään _user_ .

Jos käyttäjä ei ole kirjautunut, sivulla näytetään _pelkästään_ kirjautumislomake:

![]({{ "/assets/teht/27.png" | absolute_url }})

Kirjautuneelle käyttäjälle näytetään kirjautuneen käyttäjän nimi sekä blogien lista

![]({{ "/assets/teht/28.png" | absolute_url }})

Tässä vaiheessa kirjautuneen käyttäjien tietoja ei vilä tarvitse muistaa local storagen avulla.

**HUOM** Voit tehdä kirjautumislomakkeen ehdollisen renderöinnin esim. seuraavasti:

```html
  render() {
    if (this.state.user === null) {
      return (
        <div>
          <h2>Kirjaudu sovellukseen</h2>
          <form>
            //...
          </form>
        </div>
      )
    }

    return (
      <div>
        <h2>blogs</h2>
        {this.state.blogs.map(blog =>
          <Blog key={blog._id} blog={blog}/>
        )}
      </div>
    )
  }
```

#### 82 blogilistan frontend, osa 2

Tee kirjautumisesta "pysyvä" local storagen avulla. Tee sovellukseen myös mahdollisuus ulkokirjautumiseen

![]({{ "/assets/teht/29.png" | absolute_url }})

Uloskirjautumisen jälkeen selain enää saa muistaa kirjautunutta käyttäjää reloadauksen jäleen.

#### 83 blogilistan frontend, osa 3

Laajenna sovellusta siten, että kirjautunut käyttäjä voi luoda uusia blogeja:

![]({{ "/assets/teht/30.png" | absolute_url }})

Bloginluomislomakkeesta kannattanee tehdä oma komponenttinsa joka hallitsee lomakkeen kenttien sisältöä tilansa avulla.

#### 84 blogilistan frontend, osa 4

Toteuta sovellukseen notifikaatiot, jotka kertovat sovelluksen yläosassa onnistuneista ja epäonnistuneista toimenpiteistä. Esim. blogin lisäämisen yhteydessä voi antaa seuraavan notifikaation

![]({{ "/assets/teht/32.png" | absolute_url }})

epäonnistunut kirjautuminen taas johtaa notifikaatioon

![]({{ "/assets/teht/31.png" | absolute_url }})

Notifikaation tulee olla näkyvillä muutaman sekunnin ajan. Värien lisääminen ei ole pakollista.

### komponenttien näyttäminen vain tarvittaessa

#### 85 blogilistan frontend, osa 5

Tee blogin luomiseen käytettävästä lomakkeesta ainoastaan tarvittaessa näytettävä osan 4 tapaan. Voit halutessasi hyödyntää osassa 4 määriteltyä komponenttia _Togglable_.

#### 86 blogilistan frontend, osa 6

Laajenna blogien listausta siten, että klikkaamalla blogin nimeä, sen tädelliset tiedot aukeavat

![]({{ "/assets/teht/33.png" | absolute_url }})

Uusi klikkaus blogin nimeen pienentää näkymän.

Napin _like_ ei tässä vaiheessa tarvitse tehdä mitään.

Kuvassa on myös käytetty hieman CSS:ää parantamaan sovelluksen ulkoasua.

Tyylejä voidaan määritellä osan 5 tapaan helposti [inline](https://react-cn.github.io/react/tips/inline-styles.html)-tyyleinä seuraavasti:

```js
class Blog extends React.Component {
  // ...

  render() {
    // ..

    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    return (
      <div style={blogStyle}>
        ...
      </div>
    )
  }
}
```

#### 87 blogilistan frontend, osa 7

Toteuta like-painikkeen toiminnallisuus. Like lisätään backendiin blogin yksilöivään urliin tapahtuvalla _PUT_-pyynnöllä.

Koska backendin operaatio korvaa aina koko blogin, joudut lähettämään operaation mukana blogin kaikki kentät, eli jos seuraavaa blogia liketetään

```js
{
  _id: "5a43fde2cbd20b12a2c34e91",
  user: {
    _id: "5a43e6b6c37f3d065eaaa581",
    username: "mluukkai",
    name: "Matti Luukkainen"
  },
  likes: 0,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
},
```

tulee palvelimelle tehdä PUT-pyyntö osoitteeseen _/api/blogs/5a43fde2cbd20b12a2c34e91_ ja sisällyttää pyynnön mukaan seuraava data:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

**Bonus:** järjestä sovellus näyttämään blogit _likejen_ mukaisessa suuruusjärjestyksessä.

#### 88 blogilistan frontend, osa 8

Lisää nappi blogin poistamiselle. Nappi näytetään ainoastaan jos kyseessä on kirjautuneen käyttäjän lisäämä blogi _tai_ blogi, jolle ei ole määritelty lisääjää.

Toteuta myös poiston tekevä logiikka. Laajenna backendiä siten, että ne blogit joihin ei liity lisääjää ovat kaikkien kirjautuneiden käyttäjien positettavissa.

Ohjelmasi voi näyttää esim. seuraavalta:

![]({{ "/assets/teht/34.png" | absolute_url }})

### ProcTypet

#### 89 blogilistan frontend, osa 9

Määrittele joillekin sovelluksesi komponenteille ProcTypet.

### komponenttien testaaminen

**HUOM:** jos jokin teksti on rikki ei mene läpi, ei kannata ongelmaa korjatessa suorittaa kaikkia testejä vaan ainoastaan rikkinäistä testiä hyödyntäen [only](https://facebook.github.io/jest/docs/en/api.html#testonlyname-fn-timeout)-metodia.

#### 90 blogilistan testit, osa 1

Lisää sovellukseesi tilapäisesti seuraava komponentti

```react
const SimpleBlog = ({blog, onClick}) => (
  <div>
    <div>
      {blog.title} {blog.author}
    </div>
    <div>
      blog has {blog.likes} likes
      <button onClick={onClick}>like</button>
    </div>
  </div>
)
```

Tee testi, joka varmistaa, että komponentti renderöi blogin titlen, authorin ja likejen määrän,

Lisää komponenttiin tarvittaessa testausta helpottavia CSS-luokkia.

#### 91 blogilistan testit, osa 2

Tee testi, joka varmistaa, että jos komponentin _like_-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa.

#### 92 blogilistan testit, osa 3

Tee sovelluksesi komponentille _Blog_ testit, jotka varmistavat, että oletusarvoisesti blogista on näkyvissä ainoastaan nimi ja kirjoittaja, ja että klikkaamalla niitä saadaan näkyviin myös muut osat blogin tiedoista.

### integraatiotestaus

#### 93 blogilistan testit, osa 4

Tee sovelluksesi integraatiotesti, joka varmistaa, että jos käyttäjä ei ole kirjautunut järjestelmään, näyttää sovellus ainoastaan kirjautumislomakkeen, eli yhtään blogia ei vielä renderöidä.

#### 94 blogilistan testit, osa 5

Tee myös testi, joka varmistaa, että kun käyttäjä on kirjautuneena, blogit renderöityvät sivulle.

**Vihje 1:**

Kirjautuminen kannattanee toteuttaa manipulomalla testeissä local storagea.

**Vihje 2:**

Jotta mockin palauttamat blogit renderöityvät, kannattaa komponentti _App_ luoda _describe_-lohkossa. Voit noudataa tämän ja edellisen tehtävän organisoinnissa esim. seuraavaa tapaa:

```js
describe('<App />', () => {
  let app

  describe('when user is not logged', () => {
    beforeEach(() => {
      // luo sovellus siten, että käyttäjä ei ole kirjautuneena
    })

    it('only login form is rendered', () => {
      app.update()
      // ...
    })
  })

  describe('when user is logged', ()=>{
    beforeEach(() => {
      // luo sovellus siten, että käyttäjä on kirjautuneena
    })

    it('all notes are rendered', () => {
      app.update()
      // ...
    })
  })
})
```

### Redux-Unicafe

Tehdään seuraavissa tehtävissä hieman muokattu redux-versio osan 1 tehtävien Unicafe-sovelluksesta. Sovellus voi näyttää esim. seuraavalta:

![]({{ "/assets/teht/35.png" | absolute_url }})

Haluttu toiminnallisuus lienee ilmeinen.

#### 95 unicafe revisited, osa 1

Storeen täytyy tallettaa erikseen lukumäärä joisen tyyppisestä palautteeta. Storen hallitsema tila on siis muotoa:

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```

Seuraavassa on runko reducerille:

```js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
      return ...
    case 'OK':
      return ...
    case 'BAD':
      return ...
    case 'ZERO':
      return ...
  }
  return state
}
```

ja sen testien runko

```js
import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  it('should return a proper initial state when called with undefined state', () => {
    const state = []
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })
})
```

**Toteuta reducer ja tee sille testit.**

Varmista testeissä _deep-freeze_-kirjaston avulla, että kyseessä on _puhdas funktio_. Huomaa, että valmiin ensimmäisen testin on syytä mennä läpi koska redux olettaa, että reduceri palauttaa järkevän alkutilan kun sitä kutsutaan siten että ensimmäinen parametri, eli aiempaa tilaa edustava _state_ on _undefined_.

Osan 2 luvun [Muistiinpanon tärkeyden muutos](osa2/#Muistiinpanon-tärkeyden-muutos) olion kopiointiin liittyvät asiat saattavat olla hyödyksi.

#### 96 unicafe revisited, osa 2

Toteuta sitten sovelluksen koko sovellus.

### redux-anekdootit

Toteutetaan osan lopuksi versio toisesta ensimmäisen osan tehtävästä, anekdoottien äänestyssovelluksesta. Voit ottaa ratkaisusi pohjaksi repositoriossa <https://github.com/mluukkai/redux-anecdotes> olevan projektin.

Sovelluksen lopullisen version tulisi näyttää seuraavalta:

![]({{ "/assets/teht/36.png" | absolute_url }})

#### 97 anekdootit, osa 1

Toteuta mahdollisuus anekdoottien äänestämiseen. Äänien määrä tulee tallettaa redux-storeen.

#### 98 anekdootit, osa 2

Huolehdi siitä, että anekdootit pysyvät äänten mukaisessa suuruusjärjetyksessä.

#### 99 anekdootit, osa 3

Tee sovellukseen mahdollisuus uusien anekdoottien lisäämiselle.

## osa 6

Seuraavissa tehtävissä parannellaan edellisen osan anekdoottisovellusta. Ota ratkaisusi pohjaksi repositoriossa <https://github.com/mluukkai/redux-anecdotes-v2> oleva koodi.

### yhdistetyt reducerit

#### 100 paremmat anekdootit, osa 1

Sovelluksen komponenteissa viitataan suoraan actioneihin:

```react
class AnecdoteForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    this.props.store.dispatch({
      type: 'CREATE',
      content
    })

  }
  // ...
}
```

Tämä ei ole hyvä tapa. Eriytä action-olioiden luominen [action creator](https://redux.js.org/docs/basics/Actions.html#action-creators) -funktioihin. Sijoita creatorit tiedostoon _src/reducers/anecdoteReducer.js_.

#### 101 paremmat anekdootit, osa 2

Sovelluksessa on valmiina komponentin _Notification_ runko:

```react
class Notification extends React.Component {
  render() {
    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }
    return (
      <div style={style}>
        render here notification...
      </div>
    )
  }
}
```

Laajenna komponenttia siten, että se renderöi redux-storeen talletetun viestin, eli renderöitävä komponentti muuttuu muodoon:

```react
return (
  <div style={style}>
    {this.props.store.getState()...}
  </div>
)
```

Joudut siis muuttamaan/laajentamaan sovelluksen olemassaoleva reduceria. Tee toiminnallisuutta varten oma reduceri ja siirry käyttämään sovelluksessa yhdistettyä reduceria osan 6 materiaalin tapaan.

Tässä vaiheessa sovelluksen ei vielä tarvitse osata käyttää _Notification_ komponenttia järkevällä tavalla, riittää että sovellus toimii ja näyttää _notificationReducerin_ alkuarvoksi asettaman viestin.

#### 102 paremmat anekdootit, osa 3

Laajenna sovellusta siten, että se näyttää _Notification_-komponentin avulla viiden sekunnin ajan kun sovelluksessa äänestetään tai luodaan uusia anekdootteja:

![]({{ "/assets/teht/37.png" | absolute_url }})

Notifikaation asettamista ja poistamista varten kannattaa kannattaa toteuttaa [action creatorit](https://redux.js.org/docs/basics/Actions.html#action-creators).

#### 103 paremmat anekdootit, osa 4

Toteuta sovellukseen näytettävien muistiinpanojen filtteröiminen

![]({{ "/assets/teht/38.png" | absolute_url }})

Säilytä filtterin tila redux storessa, eli käytännössä kannattaa jälleen luoda uusi reduceri ja action creatorit.

Tee filtterin ruudulla näyttämistä varten komponentti _Filter_. Voit ottaa sen pohjaksi seuraavan

```js
class Filter extends React.Component {
  handleChange = (e) => {
    // input-kentän arvo muuttujassa e.target.value
  }
  render() {
    const style = {
      marginBottom: 10
    }

    return (
      <div style={style}>
        filter <input onChange={this.handleChange}/>
      </div>
    )
  }
}
```

### connect

#### 104 paremmat anekdootit, osa 5

Sovelluksessa välitetään _redux store_ tällä hetkellä kaikille komponenteille propseina.

Ota käyttöön kirjasto [react-redux](https://github.com/reactjs/react-redux) ja muuta komponenttia _Notification_, se pääsee käsiksi tilaan _connect_-funktion välityksellä.

Huomaa, että toimiakseen _context_ edellyttää että sovelukselle on määriteltävä [Provider](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store).


#### 105 paremmat anekdootit, osa 6

Tee sama komponentille _Filter_ ja _AnecdoteForm_.

#### 106 paremmat anekdootit, osa 7

Muuta myös _AnecdoteList_ käyttämään connectia.

Poista turhaksi staten propseina tapahtuva välittäminen, eli pelkistä _App_ muotoon:

```js
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Programming anecdotes</h1>
        <Notification />
        <AnecdoteForm />
        <AnecdoteList />
      </div>
    )
  }
}
```

#### 107 paremmat anekdootit, osa 8

Välitä komponentille _AnecdoteList_ connectin avulla ainoastaan yksi stateen liittyvä propsi, filtterin tilan perusteella näytetävät anekdootit samaan tapaan kuin materiaalin luvussa [Presentational/Container revisited](osa6/#Presentational/Container-revisited).

Komponentin _AnecdoteList_ metodi _render_ siis typistyy suunnilleen seuraavaan muotoon

```react
class AnecdoteList extends React.Component {
  // ...
  render() {
    return (
      <div>
        <h2>Anecdotes</h2>
        <Filter />
        {this.props.anecdotesToShow.map(anecdote =>
          <div key={anecdote.id}>
            ...
          </div>
        )}
      </div>
    )
  )
}
```

### redux ja backend

#### 108 anekdootit ja backend, osa 1

Hae sovelluksen käynnistyessä anekdootit json-serverillä toteutetusta backendistä.

Backendin alustavan sisällön saat esim. [täältä](https://github.com/mluukkai/redux-anecdotes-v2/wiki).

#### 109 anekdootit ja backend, osa 2

Muuta uusien anekdoottien luomista siten, että anekdootit talletetaan backendiin.

#### 110 anekdootit ja backend, osa 3

Muuta myös äänestäminen siten, että anekdootit talletetaan backendiin. Jos teet talletuksen HTTP PUT -operaatiolla, niin muista että joudut korvaamaan tallettaessa koko olion.

### thunk

#### 111 anekdootit ja backend, osa 4

Muuta redux-storen alustus tapahtumaan _redux-thunk_-kirjaston avulla toteutettuun asynkroiseen actioniin.

#### 112 anekdootit ja backend, osa 5

Muuta myös uuden anekdootin luominen ja äänestäminen tapahtumaan _redux-thunk_-kirjaston avulla toteutettuihin asynkronisiin actioneihin.

#### 113 anekdootit ja backend, osa 6

Notifikaatioiden tekeminen on nyt hieman ikävää, sillä se edellyttää kahden actionin tekemistä ja _setTimeout_-funktion käyttöä:

```js
this.props.notifyWith(`you voted '${anecdote.content}'`)
setTimeout(() => {
  this.props.clearNotification()
}, 10000)
}
```

Tee asynkrooninen action creator, joka mahdollistaa notifikaation antamisen seuraavasti:

```js
this.props.notify(`you voted '${anecdote.content}'`, 10)
```

eli ensimmäisenä parametrina on renderöitävä teksti ja toisena notifikaation näyttöaika sekunneissa.

Ota paranneltu notifikaatiotapa käyttöön sovelluksessasi.

### router

Jatketaan anekdoottien parissa. Ota seuraaviin tehtäviin pohjaksi repositoriossa <https://github.com/mluukkai/routed-anecdotes> oleva reduxiton anekdoottisovellus.

#### 114 routed anecdotes, osa 1

Lisää sovellukseen React Router siten, että _Menu_-komponentissa olevia linkkejä klikkailemalla saadaan säädeltyä näytettävää näkymää.

Sovelluksen juuressa, eli polulla _/_ näytetään anekdoottien lista:

![]({{ "/assets/teht/40.png" | absolute_url }})

Pohjala oleva _Footer_-komponentti tulee näyttää aina.

Uuden anekdootin luominen tapahtuu esim. polulla _create_:

![]({{ "/assets/teht/41.png" | absolute_url }})

Huom: jos saat seuraavan virheilmoituksen

![]({{ "/assets/teht/39.png" | absolute_url }})

pääset siitä eroon sisällyttämällä kaiken Router-elementin sisälle tulevan _div_-elementtiin:

```bash
<Router>
  <div>
    ...
  </div>
</Router>
```

#### 115 routed anecdotes, osa 2

Toteuta sovellukseen yksittäisen anekdootin tiedot näyttävä näkymä:

![]({{ "/assets/teht/42.png" | absolute_url }})

Yksittäisen anekdootin sivulle navigoidaan klikkaamalla anekdootin nimeä

![]({{ "/assets/teht/43.png" | absolute_url }})

#### 116 routed anecdotes, osa 3

Luomislomakkeen oletusarvoinen toiminnallisuus on melko hämmentävä, sillä kun lomakkeen avulla luodaan uusi muistiinpano, mitään ei näytä tapahtuvan.

Paranna toiminnallisuutta siten, että luomisen jälkeen siirrytään automaattisesti kaikkien anekdoottien näkymään _ja_ käyttäjälle näytetään 10 sekunnin ajan onnistuneesta lisäyksestä kertova notifikaatio:

![]({{ "/assets/teht/44.png" | absolute_url }})

### inline-tyylit

Parannellaan edellisen tehtäväsarjan ulkoasua inlinetyylien avulla.

#### 117 styled anecdotes, osa 1

Tee notifikaatioista tyylikkäämpi:

![]({{ "/assets/teht/45.png" | absolute_url }})

Notifikaatiosi ei tarvitse näyttää samanlaiselta, tyyli on vapaa.

Googlaile tarvittaessa apua. Hyödyllisiä avainsanoja ovat ainakin _border_, _margin_ ja _padding_. [w3schoolsin](https://www.w3schools.com/css/default.asp) sivulta löytyy paljon esimerkkejä tyyleihin liittyen.

#### 118 styled anecdotes, osa 2

Paranna menun ulkoasua esim. seuraavasti

![]({{ "/assets/teht/46.png" | absolute_url }})

Kuten edellisessä tehtävässä, nytkin tyyli on vapaa.

Jos haluat erotella aktiivisena olevan sivun linkin tyylin menussa, kannattaa vaihtaa käytössä oleva komponentti [Link](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md) sen edistyksellisempään versioon, eli komponenttiin [NavLink](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/NavLink.md).

NavLink toimii Link-komponentin tavoin mutta sisältää muutamia käteviä lisäominaisuuksia kuten attribuutin [activeStyle](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/NavLink.md#activestyle-object), jonka kanssa useimmiten käytetään attribuuttia [exact](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/NavLink.md#exact-bool).

### ui-framework

Viimeistele anekdoottisovellus lisäämällä siihen tyylejä Bootstrapin tai jonkun muun UI-frameworkin avulla.

#### 119 styled anecdotes, osa 3

Ota käyttöön bootstrap (tai valitsemasi framework) ja renderöi anekdoottien lista [ListGroup](https://react-bootstrap.github.io/components/list-group/)-komponentin avulla:

![]({{ "/assets/teht/47.png" | absolute_url }})

#### 120 styled anecdotes, osa 4

Tutustu [grideihin](https://react-bootstrap.github.io/layout/grid/) ja muuta niiden avulla sovelluksen _about_-sivua siten, että oikeassa reunassa näytetään jonkun kuuluisan tietojenkäsittelijän kuva:

![]({{ "/assets/teht/48.png" | absolute_url }})

#### 121 styled anecdotes, osa 5

Toteuta loppufiilistelynä sovellukseen anekdoottien äänestäminen ja jos aikaa ja intoa riittää, lisää vielä vapaavalintaisia tyylejä.

## osa 7

Tämän osan tehtävissä jatketaan osissa 4 ja 5 tehtyä Bloglist-sovellusta. Suurin osa tämän osan tehtävistä on toisistaan riippumattomia  "featureita", eli tehtäviä ei tarvitse tehdä järjestyksessä, voit jättää osan aivan hyvin toteuttamatta.

Osassa on 22 tehtävää, arvostelussa tehtävien maksimiin tässä osassa lasketaan kuitenkin ainoastaan 16.

Useimmat tämän osan tehtävistä vaativat koodisi refaktoroimista. Tämä on tilanne käytännössä aina sovelluksia laajennettaessa, eli vaikka refaktorointi voi olla hankalaa ja ikävääkin, on kyseessä oleellinen taito.

Hyvä neuvo refaktorintiin niinkuin uudenkin koodin kirjoittamiseen on _pienissä askelissa eteneminen_, koodia ei kannata hajottaa totaalisesti refaktorointia tehdessä pitkäkti aikaa, se on käytännössä varma resepti hermojen menettämiseen.

### 122 käyttäjien näkymä

Tee sovellukseen näkymä, joka näyttää kaikkin käyttäjiin liittyvät perustietot: 

![]({{ "/assets/teht/53.png" | absolute_url }})

### 123 yksittäisen käyttäjän näkymä, osa 1

Tee sovellukseen yksittäisen käyttäjän näkymä, jolta selviää mm. käyttäjän lisäämät blogit

![]({{ "/assets/teht/54.png" | absolute_url }})

Näkymään päästään klikkaamalla nimeä kaikkien käyttäjien näkymästä

![]({{ "/assets/teht/55.png" | absolute_url }})

### 124 yksittäisen käyttäjän näkymä osa, 2

Merkkaa tämä tehtävä tehdyksi jos toteuttamasi yksittäisen käyttäjän näkymä toimii oikein myös siinä tilanteessa että menet urliin suoraan tai refreshaat selaimen ollessasi käyttäjän näkymässä.

### 125 blogin näkymä

Toteuta sovellukseen oma näkymä yksittäisille blogeille. Näkymä voi näyttää seuraavalta

![]({{ "/assets/teht/49.png" | absolute_url }})

Näkymään päästään klikkaamalla blogin nimeä kaikkien blogien näkymästä

![]({{ "/assets/teht/50.png" | absolute_url }})

### 126 navigointi

Tee sovellukseen navigaatiomenu

![]({{ "/assets/teht/56.png" | absolute_url }})

### 127 kommentit, osa 1

Tee sovellukseen mahdollisuus blogien kommentointiin:

![]({{ "/assets/teht/51.png" | absolute_url }})

Kommentit ovat anonyymejä, eli ne eivät liity järjestelmän käyttäjiin.

Tässä tehtävässä riittää, että fronend osaa näyttää blogilla olevat backendin kautta lisätyt kommentit.

Sopiva rajapinta kommentin luomiseen on osoitteeseen  _api/blogs/:id/comments_ tapahtuva HTTP POST -pyyntö. 

### 128 kommentit, osa 2

Laajenna sovellusta siten, että kommentointi onnistuu fronendista käsin:

![]({{ "/assets/teht/52.png" | absolute_url }})

### 129 tyylit, osa 1

Tee sovelluksesi ulkoasusta tyylikkäämpi jotain kurssilla esiteltyä tapaa käyttäen 

### 130 tyylit, osa 2

Jos käytät tyylien lisäämiseen yli tunnin aikaa, merkkaa myös tämä tehtävä tehdyksi.

### 131 redux, osa 1

Siirry käyttämään React-komponenttien tilan eli _staten_ sijaan Reduxia. Koska refaktorointi saattaa olla aika työläs, voit merkitä tehtävän tehdyksi, kun "puolet" ohjelman tilasta hallitaan reduxilla.

### 132 redux, osa 2

Korvaa kaikki turha React-komponenttien staten käyttö reduxin storella

### 133 redux, osa 3

Jos siirryit Redux-storen käyttöön, muuta palvelimen kanssa kommunikointi tapahtumaan Redux-thunkia hyväksikäyttäen

### 134 ESLint

Konfiguroi fronend käyttämään Lintiä

### 135 Webpack

Tee sovellukselle sopiva webpack-konfiguraatio

### 136 backendin testaus

Tee backendille testit joiden rivikattavuus on vähintään 50%

### 137 frontendin testaus

Tee fronendille testit joiden rivikattavuus on vähintään 50%

### 138 snapshot-testaus

Ota sovellukseessasi käyttöön [snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html)

### 139 headless-testaus

Tee Puppeteeria tai haluamaasi kirjastoa käyttäviä headless-testejä, testaa ainakin paria toiminnallisuutta

### 140 Tyypitarkastuksia

Lisää sovellukseen tyyppitarkastuksia Proptypeinä, Flown avulla tai Typescriptillä

### 141 Internet

Deployaa sovellus internetiin

### 142 Jatkuva tuotantoonvienti

Toteuta sovelluksellesi esim. [Travis CI](https://travis-ci.org/):n avulla jatkuva tuotantoonvienti, eli mekanismi, missä koodin pushaaminen githubiin aiheuttaa testien läpimennessä uuden version käynnistämisen internettiin.

### 143 Facebook

Koodaa parempi versio facebookista
