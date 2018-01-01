---
layout: page
title: osa 1
permalink: /osa1/
---

## Yleistä

Kurssilla tutustutaan Javascriptilla tapahtuvaan moderniin websovelluskehitykseen. Pääpaino on React-kirjaston avulla toteutettavissa single page -sovelluksissa, ja niitä tukevissa Node.js:llä toteutetuissa REST-rajapinnoissa.

Kurssilla käsitellään myös sovellusten testaamista, konfigurointia ja suoritusympäristöjen hallintaa sekä NoSQL-tietokantoja.

## Oletetut esitiedot

Osallistujilta edellytetään vahvaa ohjelmointiruutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta (esim. opintojakson Tietokantasovellus-suoritusta) sekä valmiutta omatoimiseen tiedonhakuun.

Kurssille osallistuminen ei edellytä käsiteltyjen tekniikoiden tai Javascript-kielen hallintaa.

## Kurssimateriaali, suoritustapa

Kurssimateriaali on tarkoitettu luettavaksi "alusta loppuun". Seassa on tehtäviä, jotka on tarkoitettu tehtäviksi suunnilleen siinä kohdassa materiaalia. Toki tehtävät voi tehdä materiaalia lukemattakin, jos esitiedot ovat muuten riittävät.

Materiaali perustuu muutamien osasta osaan vaihtuvien koodiesimerkkien asteittaiseen laajentamiseen. Materiaali toiminee parhaiten, jos kirjoitat samalla koodin myös itse ja teet koodiin myös pieniä modifikaatioita.

Kurssi koostuu osista, joita ilmestyy viikoittain. On tarkoitus, että etenet seuraavaan osaan vasta, kun riittävä määrä (noin 80%) edellisen osan tehtävistä on tehty. Jokaisella osalla on myös hard deadline, esim. osan 1 deadline ei kuitenkaan ole vielä viikon 1 lopussa. Etenemiselle on siis jonkun verran joustoa, jotta ehdit tekemään kustakin osasta tarvittavan määrän tehtäviä.

Arvosana määräytyy tehtyjen tehtävien perusteella. Noin 50% tehtävistä tuo arvosanan 1 ja 90% arvosanan 5. Kurssin lopussa on koe, joka on suoritettava hyväksytysti. Koe ei kuitenkaan vaikuta arvosanaan.

## Alkutoimet

Tällä kurssilla suositellaan Chrome-selaimen käyttöä sillä se tarjoaa parhaan välineistön web-sovelluskehitystä ajatellen.

Kurssin tehtävät palautetaan GitHubiin, joten Git tulee olla asennettuna.

Asenna myös joku järkevä webkoodausta tukeva tekstieditori, enemmän kuin suositeltava valinta on [Visual studio code](https://code.visualstudio.com/). Myös [Atom](https://atom.io/) on tarkoitukseen toimiva.

Älä koodaa nanolla, notepadilla tai geditillä. Netbeanskaan ei ole omimmillaan Web-koodauksessa ja se on myös turhan raskas verrattuna esim. Visual Studio Codeen.

Asenna koneeseesi heti myös [Node.js](https://nodejs.org/en/). Materiaali on tehty versiolla 8.6, älä asenna mitään sitä vanhempaa versiota.

Noden myötä koneelle asentuu myös Node package manager [npm](https://www.npmjs.com/get-npm) jota tulemme tarvitsemaan kurssin aikana aktiivisesti.

Asennusohjeita on koottu [tänne](https://github.com/mluukkai/mluukkai.github.io/wiki/asennusohjeita). Sivu on kaikkien editoitavissa, eli tee muokkauksia ja lisäyksiä tarpeen vaatiessa.

## Osan 1 oppimistavoitteet

- Web-sovellusten toiminnan perusteet
  - HTML:n perusteet
  - HTTP-protokolla: metodit GET ja POST, statuskoodit, headerit
  - palvelimella suoritettavan koodin rooli
  - selaimessa suoritettavan javascript:in rooli
  - JSON-muotoinen data
  - DOM
  - sivujen ulkoasun muotoilun periaate CSS:llä
  - single page app -periaate
- Chrome developer konsolin peruskäyttö
- React
  - funktiona ja luokkana määriteltävät komponentit
  - tietojen ja funktioiden välittäminen lapsikomponentteihin propseina
  - komponentin tila
  - tilan päivittämisen periaatteet
  - tapahtumankäsittelyn perusteet
- Javascript
  - muuttujien määrittely
  - taulukko ja sen perusoperointi (mm. push, concat, forEach, join ja map)
  - literaalisyntaksilla määritellyt oliot
  - funktioiden määrittely
  - this:in käyttäytyminen
  - funktioita palauttavat funktiot
  - luokkasyntaksi
  - class propertynä määritellyt metodit

## Web-sovelluksen toimintaperiaatteita ##

Käymme aluksi läpi web-sovellusten toimintaperiaatteita tarkastelemalla osoitteessa <https://fullstack-exampleapp.herokuapp.com/> olevaa esimerkkisovellusta. Huom.
sovelluksen toinen versio on osoitteessa <https://exampleapp-ghqykidlgq.now.sh/>, voit käyttää kumpaa vaan.

Sovelluksen olemassaolon tarkoitus on ainoastaan havainnollistaa kurssin peruskäsitteistöä, sovellus ei ole missään tapauksessa esimerkki siitä _miten_ web-sovelluksia kannattaisi kehittää, päinvastoin, sovellus käyttää eräitä vanhentuneita tekniikoita sekä huonoja käytänteitä.

Kurssin suosittelemaa tyyliä noudattavan koodin kirjoittaminen alkaa luvusta [React](#react).

Käytä nyt ja _koko ajan_ tämän kurssin aikana Chrome-selainta.

Avataan selaimella [esimerkkisovellus](https://fullstack-exampleapp.herokuapp.com/).

<div class="important">
  <h3>Web-sovelluskehityksen sääntö numero yksi</h3>
  Pidä selaimen developer-konsoli koko ajan auki
</div>

Konsoli avautuu macilla painamalla yhtä aikaa _alt_ _cmd_ ja _i_.

Ennen kun jatkat eteenpäin, selvitä miten saat koneellasi konsolin auki (googlaa tarvittaessa) ja muista pitää se auki *aina* kun teet web-sovelluksia.

Konsoli näyttää seuraavalta:
![]({{ "/assets/1/1.png" | absolute_url }})

Varmista, että välilehti _Network_ on avattuna ja aktivoi valinta _Disable cache_ kuten kuvassa on tehty.

**HUOM:** konsolin tärkein välilehti on _Console_. Käytämme nyt johdanto-osassa kuitenkin ensin melko paljon välilehteä _Network_.

### HTTP GET

Selain ja web-palvelin kommunikoivat keskenään [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)-protokollaa käyttäen. Avoinna oleva konsolin Network-tabi kertoo miten selain ja palvelin kommunikoivat.

Kun nyt reloadaat selaimen, kertoo konsoli, että tapahtuu kaksi asiaa
- selain hakee web-palvelimelta sivun _fullstack-exampleapp.herokuapp.com/_ sisällön
- ja lataa kuvan _kuva.png_

![]({{ "/assets/1/2.png" | absolute_url }})

Jos ruutusi on pieni, saatat joutua isontamaan konsoli-ikkunaa, jotta saat selaimen tekemät haut näkyviin.

Klikkaamalla näistä ensimmäistä, paljastuu tarkempaa tietoa siitä mistä on kyse:

![]({{ "/assets/1/3.png" | absolute_url }})

Ylimmästä osasta _General_ selviää, että selain teki [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)-metodilla pyynnön osoitteeseen _https://fullstack-exampleapp.herokuapp.com/_ ja että pyyntö oli onnistunut, sillä pyyntöön saatiin vastaus, jonka [Status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) on 200.

Pyyntöön ja palvelimen lähettämään vastaukseen liittyy erinäinen määrä otsakkeita eli [headereita](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields):

![]({{ "/assets/1/4.png" | absolute_url }})

Ylempänä oleva _Response headers_ kertoo mm. vastauksen koon tavuina ja vastaushetken. Tärkeä headeri _Content-Type_ kertoo, että vastaus on [utf-8](https://en.wikipedia.org/wiki/UTF-8) muodossa oleva teksti-tiedosto, jonka sisältö on muotoiltu HTML:llä. Näin selain tietää, että kyseessä on normaali [HTML](https://en.wikipedia.org/wiki/HTML)-sivu, joka tulee renderöidä käyttäjän selaimeen.

Välilehti _Preview_ näyttää miltä pyyntöön vastauksena lähetetty data näyttää. Kyseessä on siis normaali HTML-sivu, jonka _body_-osassa määritellään selaimessa näytettävän sivun rakenne:

![]({{ "/assets/1/5.png" | absolute_url }})

Sivu sisältää _div_-elementin, jonka sisällä on otsikko sekä tieto luotujen muistiinpanojen määrästä, linkki sivulle _muistiinpanot_ ja kuvaa vastaava _img_-tagi.

img-tagin ansiosta selain tekee HTTP-pyynnön, jonka avulla se hakee kuvan _kuva.png_ palvelimelta. Pyynnön tiedot näyttävät seuraavalta:

![]({{ "/assets/1/6.png" | absolute_url }})

eli pyyntö on tehty osoitteeseen _https://fullstack-exampleapp.herokuapp.com/kuva.png_ ja se on tyypiltään HTTP GET. Vastaukseen liittyvät headerit kertovat että vastauksen koko on 89350 tavua ja vastauksen _Content-type_ on _image/png_, eli kyseessä on png-tyyppinen kuva. Tämän tiedon ansiosta selain tietää miten kuva on sijoitettava HTML-sivulle.

### Perinteinen web-sovellus

Esimerkkisovelluksen pääsivu toimii perinteisen web-sovelluksen tapaan. Mentäessä sivulle, selain hakee palvelimelta sivun strukturoinnin ja tekstuaalisen sisällön määrittelevän HTML-dokumentin.

Palvelin on muodostanut dokumentin jollain tavalla. Dokumentti voi olla _staattista sisältöä_ eli palvelimen hakemistossa oleva tekstitiedosto. Dokumentti voi myös olla _dynaaminen_, eli palvelin voi muodostaa HTML-dokumentit esim. tietokannassa olevien tietojen perusteella. Esimerkkisovelluksessa sivun HTML-koodi on muodostettu dynaamisesti sillä se sisältää tiedon luotujen muistiinpanojen lukumäärästä.

Etusivun muodostama koodi näyttää seuraavalta:

```js
const getFrontPageHtml = (noteCount) => {
  return (`
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class="container">
          <h1>Full stack -esimerkkisovellus</h1>
          <p>muistiinpanoja luotu ${noteCount} kappaletta</p>
          <a href="/notes">muistiinpanot</a>
          <img src="kuva.png" width="200" />
        </div>
      </body>
    </html>
  `)
}

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page)
})
```

Koodia ei tarvitse vielä ymmärtää, mutta käytännössä HTML-sivun sisältö on talletettu ns. template stringinä. Etusivun dynaamisesti muuttuva osa, eli muistiinpanojen lukumäärä (koodissa _noteCount_) korvataan template stringissä sen hetkisellä konkreettisella lukuarvolla (koodissa _notes.length_).

Perinteisissä websovelluksissa selain on "tyhmä", se ainoastaan pyytää palvelimelta HTML-muodossa olevia sisältöjä, kaikki sovelluslogiikka on palvelimessa. Palvelin voi olla tehty esim. kurssin [Web-palvelinohjelmointi, Java](https://courses.helsinki.fi/fi/tkt21007/119558639) tapaan Springillä tai, [Tietokantasovelluksessa](http://tsoha.github.io/#/johdanto#top) PHP:llä tai [Ruby on Railsilla](http://rubyonrails.org/). Esimerkissä on käytetty Node.js:n [Express](https://expressjs.com/)-sovelluskehystä. Tulemme käyttämään kurssilla Node.js:ää ja Expressiä web-palvelimen toteuttamiseen.

### Selaimessa suoritettava sovelluslogiikka

Pidä konsoli edelleen auki. Tyhjennä konsolin näkymä painamalla vasemmalla olevaa &empty;-symbolia.

Kun menet nyt muistiinpanojen sivulle, selain tekee 4 HTTP-pyyntöä:

![]({{ "/assets/1/7.png" | absolute_url }})

Kaikki pyynnöt ovat _eri tyyppisiä_. Ensimmäinen pyyntö on tyypiltään _document_
kyseessä on sivun HTML-koodi, joka näyttää seuraavalta:

![]({{ "/assets/1/8.png" | absolute_url }})

Kun vertaamme, selaimen näyttämää sivua ja pyynnön palauttamaa HTML-koodia, huomaamme, että koodi ei sisällä ollenkaan kolmea muistiinpanoa sisältävää listaa.

HTML-koodin _head_ osio sisältää _script_-tagin, jonka ansiosta selain lataa _main.js_-nimisen javascript-tiedoston palvelimelta.

Ladattu javascript-koodi näyttää seuraavalta

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note) {
      var li = document.createElement('li')

      ul.appendChild(li);
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementById('notes').appendChild(ul)
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Koodin yksityiskohdat eivät ole tässä vaiheessa vielä oleellisia.

Heti ladattuaan _script_-tagin sisältämän javascriptin selain suorittaa koodin.

Kaksi viimeistä riviä määrittelevät, että selain tekee GET-tyyppisen HTTP-pyynnön osoitteeseen palvelimen osoitteeseen _/data.json_:

```js
xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Kyseessä on alin Network tabin näyttämistä selaimen tekemistä pyynnöistä.

Voimme kokeilla mennä osoitteeseen <https://fullstack-exampleapp.herokuapp.com/data.json> suoraan selaimella:

![]({{ "/assets/1/9.png" | absolute_url }})

Osoitteesta löytyvät muistiinpanot [JSON](https://en.wikipedia.org/wiki/JSON)-muotoisena "raakadatana". Oletusarvoisesti selain ei osaa näyttää JSON-dataa kovin hyvin, mutta on olemassa lukuisia plugineja jotka hoitavat muotoilun. Asenna nyt chromeen esim. [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) ja lataa sivu uudelleen. Data on nyt miellyttävämmin muotoiltua:

![]({{ "/assets/1/10.png" | absolute_url }})

Ylläoleva javascript-koodi siis lataa muistiinpanot sisältävän JSON-muotoisen datan ja muodostaa datan avulla selaimeen "bulletlistan" muistiinpanojen sisällöstä:

Tämän saa aikaan seuraava koodi:

```js
const data = JSON.parse(this.responseText)
console.log(data)

var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content))
})

document.getElementById('notes').appendChild(ul)
```

Koodi muodostaa ensin järjestämätöntä listaa edustavan [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)-tagin:

```js
var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')
```

ja lisää ul:n sisään yhden [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)-elementin kutakin muistiinpanoa kohti. Ainoastaan muistiinpanon _content_-kenttä tulee li-elementin sisällöksi, raakadatassa olevia aikaleimoja ei käytetä mihinkään.


```js
data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content))
})
```

Avaa nyt konsolin _Console_-välilehti:

![]({{ "/assets/1/11.png" | absolute_url }})

Painamalla rivin alussa olevaa kolmiota saat laajennettua konsolissa olevan rivin:

![]({{ "/assets/1/12.png" | absolute_url }})

Konsoliin ilmestynyt tulostus johtuu siitä, että koodiin oli lisätty komento _console.log_:

```js
const data = JSON.parse(this.responseText)
console.log(data)
```

eli vastaanotettuaan datan palvelimelta, koodi tulostaa datan konsoliin.

Tulet tarvitsemaan komentoa _console.log_ kurssilla todella monta kertaa...

### Tapahtumankäsittelijä ja takaisinkutsu ###

Koodin rakenne on hieman erikoinen:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function () {
  // koodi, joka käsittelee palvelimen vastauksen
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

eli palvelimelle tehtävä pyyntö suoritetaan vasta viimeisellä rivillä. Palvelimen vastauksen käsittelyn määrittelevä koodi on kirjoitettu jo aiemmin. Mistä on kyse?

Rivillä
```js
xhttp.onreadystatechange = function () {
```

kyselyn tekevään <code>xhttp</code>-olioon määritellään _tapahtumankäsittelijä_ (event handler) tilanteelle _onreadystatechange_. Kun kyselyn tekevän olion tila muuttuu, kutsuu selain tapahtumankäsittelijänä olevaa funktiota. Funktion koodi tarkastaa, että [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState):n arvo on 4 (joka kuvaa tilannetta _The operation is complete_) ja, että vastauksen HTTP-statuskoodi on onnistumisesta kertova 200.

```js
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // koodi, joka käsittelee palvelimen vastauksen
  }
}
```

Tapahtumankäsittelijöihin liittyvä mekanismi koodin suorittamiseen on javascriptissä erittäin yleistä. Tapahtumankäsittelijöinä olevia javascript-funktioita kutsutaan [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)- eli takaisinkutsufunktioiksi sillä sovelluksen koodi ei kutsu niitä itse vaan suoritusympäristö, eli web-selain suorittaa funktion kutsumisen sopivana ajankohtana, eli kyseisen _tapahtuman_ tapahduttua.

### Document Object Model eli DOM ###

Voimme ajatella, että HTML-sivut muodostavat implisiittisen puurakenteen

<pre>
html
  head
    link
    script
  body
    div
      h1
      div
        ul
          li
          li
          li
      form
        input
        input
</pre>

Sama puumaisuus on nähtävissä konsolin välilehdellä _Elements_

![]({{ "/assets/1/13.png" | absolute_url }})

Selainten toiminta perustuu ideaan esittää HTML-elementit puurakenteena.

Document Object Model eli [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) on ohjelmointirajapinta eli _API_, jonka mahdollistaa selaimessa esitettävien web-sivujen muokkaamisen ohjelmallisesti.

Edellisessä luvussa esittelemämme javascript-koodi käytti nimenomaan DOM-apia lisätäkseen sivulle muistiinpanojen listan.

HTML-dokumentin

![]({{ "/assets/1/13b.png" | absolute_url }})

DOM:a havainnollistava kuva Wikipedian sivulta:

![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/DOM-model.svg/428px-DOM-model.svg.png)

### document-olio ja sivun manipulointi konsolista ###

HTML-dokumenttia esittävän DOM-puun ylimpänä solmuna on olio nimeltään _document_. Olioon pääsee käsiksi Console-välilehdeltä:

![]({{ "/assets/1/14.png" | absolute_url }})

Voimme suorittaa konsolista käsin DOM-apin avulla erilaisia operaatioita selaimessa näytettävälle web-sivulle hyödyntämällä _document_-olioa.

Lisätään nyt sivulle uusi muistiinpano suoraan konsolista.

Haetaan ensin sivulta muistiinpanojen lista, eli sivun ul-elementeistä ensimmäinen:
```js
lista = document.getElementsByTagName('ul')[0]
```

luodaan uusi li-elementti ja lisätään sille sopiva tekstisisältö:

```js
uusi = document.createElement('li')
uusi.textContent = 'Sivun manipulointi konsolista on helppoa'
```

liitetään li-elementti listalle:

```js
lista.appendChild(uusi)
```

![]({{ "/assets/1/15.png" | absolute_url }})

Vaikka selaimen näyttämä sivu päivittyy, ei muutos ole lopullinen. Jos sivu uudelleenladataan, katoaa uusi muistiinpano, sillä muutos ei mennyt palvelimelle asti. Selaimen lataama javascript luo muistiinpanojen listan aina palvelimelta osoitteesta <https://fullstack-exampleapp.herokuapp.com/data.json> haettavan JSON-muotoisen raakadatan perusteella.

### CSS ###

Muistiinpanojen sivun HTML-koodin _head_-osio sisältää _link_-tagin, joka määrittelee, että selaimen tulee ladata pavelimelta osoitteesta [main.css](https://fullstack-exampleapp.herokuapp.com/main.css) sivulla käytettävä [css](https://developer.mozilla.org/en-US/docs/Web/CSS)-tyylitiedosto

Cascading Style Sheets eli CSS on kieli, jonka avulla web-sovellusten ulkoasu määritellään.

Ladattu css-tiedosto näyttää seuraavalta:

```css
.container {
  padding: 10px;
  border: 1px solid;
}

.notes {
  color: blue;
}
```

Tiedosto määrittelee kaksi [luokkaselektoria](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors), joiden avulla valitaan tietty sivun alue ja määritellään alueelle sovellettavat tyylisäännöt.

Luokkaselektori alkaa aina pisteellä ja sisältää luokan nimen.

Luokat ovat [attribuuteja](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) joita voidaan liittää HTML-elementeille.

Konsolin _Elements_-välilehti mahdollistaa class-attribuuttien tarkastelun:

![]({{ "/assets/1/16.png" | absolute_url }})

sovelluksen uloimmalle _div_-elementille on siis liitetty luokka _container_. Muistiinpanojen listan sisältävä _ul_-elementin sisällä oleva lista sisältää luokan _notes_.

CSS-säännön avulla on määritelty, että _container_-luokan sisältävä elementti ympäröidään yhden pikselin paksuisella [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border):illa. Elementille asetetaan myös 10 pikselin [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding), jonka ansiosta elementin sisältön ja elementin ulkorajan väliin jätetään hieman tilaa.

Toinen määritelty CSS-sääntö asettaa muistiinpanojen kirjainten värin siniseksi.

HTML-elementeillä on muitakin attribuutteja kuin luokkia. Muistiinpanot sisältävä _div_-elementti sisältää [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)-attribuutin. Javascript-koodi hyödyntää attribuuttia elementin etsimiseen.

Konsolin _Elements_-välilehdellä on mahdollista manipuloida elementtien tyylejä:
![]({{ "/assets/1/17.png" | absolute_url }})

Tehdyt muutokset eivät luonnollisestikaan jää voimaan kun selaimen sivu uudelleenladataan, eli jos muutokset halutaan pysyviksi, tulee ne konsolissa tehtävien kokeilujen jälkeen tallettaa palvelimella olevaan tyylitiedostoon.

### Lomake ja HTTP POST ###

Tutkitaan seuraavaksi sitä, miten uusien muistiinpanojen luominen tapahtuu. Tätä varten muistiinpanojen sivu sisältää lomakkeen eli [formin](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

![]({{ "/assets/1/18.png" | absolute_url }})

Kun lomakkeen painiketta painetaan, lähettää selain lomakkeelle syötetyn datan palvelimelle. Avataan _Network_-tabi ja katsotaan miltä lomakkeen lähettäminen näyttää:

![]({{ "/assets/1/19.png" | absolute_url }})

Lomakkeen lähettäminen aiheuttaa yllättäen yhteensä _viisi_ HTTP-pyyntöä. Näistä ensimmäinen vastaa lomakkeen lähetystapahtumaa. Tarkennetaan siihen:

![]({{ "/assets/1/20.png" | absolute_url }})

Kyseessä on siis HTTP POST -pyyntö ja se on tehty palvelimen osoitteeseen <em>new\_note</em>. Palvelin vastaa pyyntöön HTTP-statuskoodilla 302. Kyseessä on ns. [uudelleenohjauspyyntö](https://en.wikipedia.org/wiki/URL_redirection) eli redirectaus, minkä avulla palvelin kehoittaa selainta tekemään automaattisesti uuden HTTP GET -pyynnön headerin _Location_ kertomaan paikkaan, eli osoitteeseen _notes_.

Selain siis lataa uudelleen muistiinpanojen sivun. Sivunlataus saa aikaan myös kolme muuta HTTP-pyyntöä: tyylitiedoston (main.css), javascript-koodin (main.js) ja muistiinpanojen raakadatan (data.json) lataamisen.

Network-välilehti näyttää myös lomakkeen mukana lähetetyn datan:

![]({{ "/assets/1/21.png" | absolute_url }})

Jos käytät normaalia Chrome-selainta, ei konsoli ehkä näytä lähetettävää dataa. Kyseessä on eräissä Chromen versioissa oleva [bugi](https://bugs.chromium.org/p/chromium/issues/detail?id=766715). Bugi on korjattu Chromen uusimpaan versioon.

Lomakkeen lähettäminen tapahtuu HTTP POST -pyyntönä ja osoitteeseen _new_note_ form-tagiin määriteltyjen attribuuttien _action_ ja _method_ ansiosta:

<img src="/assets/1/22.png" height="150">

POST-pyynnöstä huolehtiva palvelimen koodi on yksinkertainen:
[JÄIN MIETTIMÄÄN, PITIKÖ TÄMÄ KOODI NÄKYÄ SELAIMESSA. KATSOIN LÄPI MAIN.JS:N JA CONTENT.JS:N MUTTA EN LÖYTÄNYT. ELI ILMEISESTI TÄMÄ ON PUHTAASTI PALVELIMELLA OLEVAA KOODIA, JOKA EI NÄYKÄÄN SELAIMELLE. SEN VOISI EHKÄ MAINITA KUN TÄHÄN ASTI KAIKKI KOODI ON OLLUT SELAIMELLE NÄKYVÄÄ.]

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date()
  })

  return res.redirect('/notes')
})
```

POST-pyyntöihin liitettävä data lähetetään pyynnön mukana "runkona" eli [bodynä](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST). Palvelin saa POST-pyynnön datan pyytämällä sitä pyyntöä vastaavan olion _req_ kentästä _req.body_.

Tekstikenttään kirjoitettu data on avaimen _note_ alla, eli palvelin viittaa siihen _req.body.note_.

Palvelin luo uutta muistiinpanoa vastaavan olion ja laittaa sen muistiinpanot sisältävään taulukkoon nimeltään _notes_:

```js
notes.push({
  content: req.body.note,
  date: new Date()
})
```

Muistiinpano-olioilla on siis kaksi kenttää, varsinaisen sisällön kuvaava _content_ ja luomishetken kertova _date_.

Palvelin ei talleta muistiinpanoja tietokantaan, joten uudet muistiinpanot katoavat aina Herokun uudelleenkäynnistäessä palvelun.

## Single page app ##

Esimerkkisovelluksemme pääsivu toimii perinteisten web-sivujen tapaan, kaikki sovelluslogiikka on palvelimella, selain ainoastaan renderöi palvelimen lähettämää HTML-koodia.

Muistiinpanoista huolehtivassa sivussa osa sovelluslogiikasta, eli olemassaolevien muistiinpanojen HTML-koodin generointi on siirretty selaimen vastuulle. Selain hoitaa tehtävän suorittamalla palvelimelta lataamansa Javascript-koodin. Selaimella suoritettava koodi hakee ensin muistiinpanot palvelimelta JSON-muotoisena raakadatana ja lisää sivulle muistiinpanoja edustavat HTML-elementit [DOM-apia](document-object-model-eli-dom) hyödyntäen.

Viime aikoina on noussut esiin tyyli tehdä web-sovelukset käyttäen [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) -tyyliä, missä sovelluksille ei enää tehdä esimerkkisovelluksemme tapaan erillisiä, palvelimen sille lähettämiä sivuja, vaan sovellus koostuu ainoastaan yhdestä palvelimen lähettämästä HTML-sivusta, jonka sisältöä manipuloidaan selaimessa suoritettavalla Javascriptillä.

Sovelluksemme muistiinpanosivu muistuttaa jo hiukan SPA-tyylistä sovellusta, sitä se ei kuitenkaan vielä ole, sillä vaikka muistiinpanojen renderöintilogiikka on toteutettu selaimessa, käyttää sivu vielä perinteistä mekanisimia uusien muistiinpanojen luomiseen. Eli se lähettää uuden muistiinpanon tiedot lomakkeen avulla ja palvelin pyytää _uudelleenohjauksen_ avulla selainta lataamaan muistiinpanojen sivun uudelleen.

Osoitteesta <https://fullstack-exampleapp.herokuapp.com/spa> löytyy sovelluksen single page app -versio.

Sovellus näyttää ensivilkaisulta täsmälleen samalta kuin edellinen versio.

HTML-koodi on lähes samanlainen, erona on ladattava javascript-tiedosto (_spa.js_) ja pieni muutos form-tagin määrittelyssä:

![]({{ "/assets/1/23.png" | absolute_url }})

Avaa nyt _Network_-tabi ja tyhjennä se &empty;-symbolilla. Kun luot uuden muistiinpanon, huomaat, että selain lähettää ainoastaan yhden pyynnön palvelimelle:

![]({{ "/assets/1/24.png" | absolute_url }})

Pyyntö kohdistuu osoitteeseen _new_note_spa_, on tyypiltään POST ja se sisältää JSON-muodossa olevan uuden muistiinpanon, johon kuuluu sekä sisältö (_content_), että aikaleima (_date_):

```js
{
  content: "single page app ei tee turhia sivun latauksia",
  date: "2017-12-11T10:51:29.025Z"
}
```

Pyyntöön liitetty headeri _Content-Type_ kertoo palvelimelle, että pyynnön mukana tuleva data on JSON-muotoista:

![]({{ "/assets/1/25.png" | absolute_url }})

Ilman headeria, palvelin ei osaisi parsia pyynnön mukana tulevaa dataa oiken.

Palvelin vastaa kyselyyn statuskoodilla [201 created](https://httpstatuses.com/201). Tällä kertaa palvelin ei pyydä uudelleenohjausta kuten aiemmassa versiossamme. Selain pysyy samalla sivulla ja muita HTTP-pyyntöjä ei suoriteta.

Ohjelman single page app -versiossa lomakkeen tietoja ei lähetetä selaimen "normaalin" lomakkeiden lähetysmekanismin avulla, lähettämisen hoitaa selaimen lataamassa Javascript-tiedostossa määritelty koodi. Katsotaan hieman koodia vaikka yksityiskohdista ei tarvitse nytkään välittää liikaa.

```js
var form = document.getElementById('notes_form')
form.onsubmit = function (e) {
 e.preventDefault()

  var note = {
    content: e.target.elements[0].value,
    date: new Date()
  }

  notes.push(note)
  e.target.elements[0].value = ''
  redrawNotes()
  sendToServer(note)
}
```

Komennolla <code>document.getElementById('notes_form')</code> koodi hakee sivulta lomake-elementin ja rekisteröi sille tapahtumankäsittelijän hoitamaan tilanteen, missä lomake "submitoidaan", eli lähetetään. Tapahtumankäsittelijä kutsuu heti metodia <code>e.preventDefault()</code> jolla se estää lomakkeen lähetyksen oletusarvoisen toiminnan. Oletusarvoinen toiminta aiheuttaisi lomakkeen lähettämisen ja sivun uuden lataamisen, sitä emme single page -sovelluksissa halua tapahtuvan.

Tämän jälkeen se luo muistiinpanon, lisää sen muistiinpanojen listalle komennolla <code>notes.push(note)</code>, piirtää ruudun sisällön eli muistiinpanojen listan uudelleen ja lähettää uuden muistiinpanon palvelimelle.

Palvelimelle muistiinpanon lähettävä koodi seuraavassa:
```js
var sendToServer = function (note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true)
  xhttpForPost.setRequestHeader('Content-type', 'application/json')
  xhttpForPost.send(JSON.stringify(note));
}
```

Koodissa siis määritellään, että kyse on HTTP POST -pyynnöstä, määritellään headerin _Content-type_ avulla lähetettävän datan tyypiksi JSON, ja lähetetään data JSON-merkkijonona.

Sovelluksen koodi on nähtävissä osoitteessa <https://github.com/mluukkai/example_app>. Kannattaa huomata, että sovellus on tarkoitettu ainoastaan kurssin käsitteistöä demonstroivaksi esimerkiksi, koodi on osin tyyliltään huonoa ja siitä ei tulee ottaa mallia omia sovelluksia tehdessä.

## Kirjastot

Kurssin esimerkkisovellus on tehty ns. [vanilla Javascriptillä](https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34) eli käyttäen pelkkää DOM-apia ja Javascript-kieltä sivujen rakenteen manipulointiin.

Pelkän Javascriptin ja DOM-apin käytön sijaan Web-ohjelmoinnissa hyödynnetään yleensä kirjastoja, jotka sisältävät DOM-apia helpommin käytettäviä työkaluja sivujen muokkaukseen. Eräs tälläinen kirjasto on edelleenkin hyvin suosittu [JQuery](https://jquery.com/).

JQuery on kehitetty aikana, jolloin web-sivut olivat vielä suurimmaksi osaksi perinteisiä, eli palvelin muodosti HTML-sivuja joiden toiminnallisuutta rikastettiin selaimessa JQueryllä kirjoitetun Javascript-koodin avulla.

Single page app -tyylin noustua suosioon on ilmestynyt useita JQueryä "modernimpia" tapoja sovellusten kehittämiseen. Googlen kehittämä [AngularJS](https://angularjs.org/) oli vielä muutama vuosi sitten erittäin suosittu. Angularin suosio kuitenkin romahti siinä vaiheessa kun Angular-tiimi [ilmoitti](https://jaxenter.com/angular-2-0-announcement-backfires-112127.html) lokakuussa 2014, että version 1 tuki lopetetaan ja Angular 2 ei tule olemaan taaksepäin yhteensopiva ykkösversion kanssa. Angular 2 ja uudemmat versiot eivät ole saaneet kovin innostunutta vastaanottoa.

Nykyisin suosituin tapa toteuttaa web-sovellusten selainpuolen logiikka on Facebookin kehittämä [React](https://reactjs.org/)-kirjasto. Tulemme tutustumaan kurssin aikana Reactiin ja sen kanssa yleisesti käytettyyn [Redux](https://github.com/reactjs/redux)-kirjastoon.

Reactin asema näyttää tällä hetkellä vahvalta, mutta Javascript-maailma ei lepää koskaan. Viime aikoina huomioita on alkanut kiinnittää mm. uudempi tulokas [VueJS](https://vuejs.org/).

## Full stack -websovelluskehitys

Mitä tarkoitetaan kurssin nimellä _full stack -websovelluskehitys_? Full stack on hypen omainen termi, kaikki puhuvat siitä, mutta kukaan ei oikein tiedä mitä se tarkoittaa tai ainakaan mitään yhteneväistä määritelmää termille ei ole.

Käytännössä kaikki websovellukset sisältävät (ainakin) kaksi "kerrosta", ylempänä, eli lähempänä loppukäyttäjää olevan selaimen ja alla olevan palvelimen. Palvelimen alapuolella on usein vielä tietokanta. Näin websovelluksen arkkitehtuuri on pino eli _stack_.

Websovelluskehityksen yhteydessä puhutaan usein myös "frontista" ([frontend](https://en.wikipedia.org/wiki/Front_and_back_ends)) ja "backistä" ([backend](https://en.wikipedia.org/wiki/Front_and_back_ends)). Selain on frontend ja selaimessa suoritettava javascript on frontend-koodia. Palvelimella taas pyörii backend-koodi.

Tämän kurssin kontekstissa full stack -sovelluskehitys tarkoittaa sitä, että fokus on kaikissa sovelluksen osissa, niin frontendissä kuin backendissäkin.

Ohjelmoimme myös palvelinpuolta, eli backendia Javascriptilla, käyttäen [Node.js](https://nodejs.org/en/)-suoritusympäristöä. Näin full stack -sovelluskehitys saa vielä uuden ulottuvuuden, käytämme samaa kieltä pinon kaikissa osissa. Full stack -sovelluskehitys ei välttämättä edellytä sitä,että kaikissa sovelluksen kerroksissa on käytössä sama kieli (javascript). Termi on kuitenkin (todennäköisesti) lanseerattu vasta sen jälkeen kun Node.js mahdollisti Javascriptin käyttämisen kaikkialla.

Aiemmin on ollut yleisempää, että sovelluskehittäjät ovat erikoistuneet tiettyyn sovelluksen osaan, esim. backendiin. Tekniikat backendissa ja frontendissa ovat saattaneet olla hyvin erilaisia. Full stack -trendin myötä on tullut tavanomaiseksi että sovelluskehittäjä hallitsee riittävästi kaikkia sovelluksen tasoja ja tietokantaa. Usein full stack -kehittäjän on myös omattava riittävä määrä konfiguraatio- ja ylläpito-osaamista, jotta kehittäjä pystyy operoimaan sovellustaan esim. pilvipalveluissa.

## Javascript fatigue

Full stack -sovelluskehitys on monella tapaa haastavaa. Asioita tapahtuu monessa paikassa ja mm. debuggaaminen on oleellisesti normaalia työpöytäsovellusta hankalampaa. Javascript ei toimi aina niinkuin sen olettaisi toimivan ja sen suoritusympäristöjen asynkroninen toimintamalli aiheuttaa monenlaisia haasteita. Verkon yli tapahtuva kommunikointi edellyttää HTTP-protokollan tuntemusta. On tunnettava myös tietokantoja ja hallittava palvelinten konfigurointia ja ylläpitoa. Hyvä olisi myös hallita riittävästi CSS:ää, jotta sovellukset saataisiin edes siedettävän näköisiksi.

Oman haasteensa tuo vielä se, että Javascript-maailma etenee koko ajan kovaa vauhtia eteenpäin. Kirjastot, työkalut ja itse kielikin ovat jatkuvan kehityksen alla. Osa alkaa kyllästyä nopeaan kehitykseen ja sitä kuvaamaan on lanseerattu termi [Javascript](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) [fatigue](https://auth0.com/blog/how-to-manage-javascript-fatigue/) eli [Javascript](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f)-väsymys.

Javascript-väsymys tulee varmasti iskemään myös tällä kurssilla. Onneksi nykyään on olemassa muutamia tapoja loiventaa oppimiskäyrää, ja voimme aloittaa keskittymällä konfiguraation sijaan koodaamiseen. Konfiguraatioita ei voi välttää, mutta seuraavat pari viikkoa voimme edetä iloisin mielin vailla pahimpia konfiguraatiohelvettejä.

### Tehtäviä web-sovelluksen perusteista

Ennen reactiin siirtymistä [tehtävät 1-6](../tehtavat#web-sovellusten-perusteet)

## React

Alamme nyt tutustua kurssin ehkä tärkeimpään teemaan, [React](https://reactjs.org/)-kirjastoon. Tehdään nyt yksinkertainen React-sovellus ja tutustutaan samalla Reactin peruskäsitteistöön.

Ehdottomasti helpoin tapa päästä alkuun on asentaa [create-react-app](https://github.com/facebookincubator/create-react-app). Asennetaan create-react-app, luodaan sovellus nimeltään _viikko1_ ja käynnistetään se:

<pre>
$ create-react-app viikko1
$ cd viikko1
$ npm start
</pre>

Chromen pitäisi aueta automaattisesti. Avaa konsoli **välittömästi**. Avaa myös tekstieditori siten, että näet koodin ja web-sivun samaan aikaan ruudulla:

![]({{ "/assets/1/26.png" | absolute_url }})

Sovelluksessa on hieman valmista koodia, mutta yksinkertaistetaan koodi siten, että tiedoston _index.js_ sisällöksi tulee:

```react
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

Voit poistaa tiedostot _App.js_, _App.css_, _App.test.js_, _logo.svg_ ja _registerServiceWorkes.js_

### Komponentti

Tiedosto _index.js_ määrittelee nyt React [komponentin](https://reactjs.org/docs/components-and-props.html) nimeltään _App_ ja viimeisen rivin komento

```react
ReactDOM.render(<App />, document.getElementById('root'))
```

renderöi komponentin sisällön tiedoston _public/index.html_ määrittelemään _div_-elementtiin, jonka _id:n_ arvona on 'root'

Tiedosto _public/index.html_ on oleellisesti ottaen tyhjä, voit kokeilla lisätä sinne HTML:ää. Reactilla ohjelmoitaessa yleensä kuitenkin kaikki renderöitävä sisältö määritellään Reactin komponenttien avulla.

Tarkastellaan vielä tarkemmin komponentin määrittelevää koodia:

```react
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

Kuten arvata saattaa, komponentti renderöityy _div_-tagina, jonka sisällä on _p_-tagin sisällä oleva teksti _Hello world_.

Teknisesti ottaen komponentti on määritelty Javascript-funktiona. Seuraava siis on funktio (joka ei saa yhtään parametria):

```react
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

joka sijoitetaan vakioarvoiseen muuttujaan _App_

```js
const App = ...
```

Javascriptissa on muutama tapa määritellä funktioita. Käytämme nyt javascriptin hieman uudemman version [EcmaScript 6:n](http://es6-features.org/#Constants) eli ES6:n [nuolifunktiota](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (arrow functions).

Koska funktio koostuu vain yhdestä lausekkeesta, on käytössämme lyhennysmerkintä, joka vastaa oikeasti seuraavaa koodia:

```react
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )}
```

eli funktio palauttaa sisältämänsä lausekkeen arvon.

Komponentin määrittelevä funktio voi sisältää mitä tahansa javascript-koodia. Muuta komponenttisi seuraavaan muotoon ja katso mitä konsolissa tapahtuu:

```react
const App = () => {
  console.log('Hello from komponentti')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )}
```

Komponenttien sisällä on mahdollista renderöidä myös dynaamista sisältöä.

Muuta komponentti muotoon:

```react
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>{a} plus {b} is {a + b}</p>
    </div>
  )
}
```

Aaltosulkeiden sisällä oleva javascript-koodi evaluoidaan ja evaluoinnin tulos upotetaan määriteltyyn kohtaan komponentin tuottamaa HTML-koodia.

### JSX

Näyttää siltä, että React-komponentti palauttaa HTML-koodia. Näin ei kuitenkaan ole. React-komponenttien ulkoasu kirjoitetaan yleensä [JSX](https://reactjs.org/docs/introducing-jsx.html):ää käyttäen. Vaikka JSX näyttää HTML:ltä, kyseessä on kuitenkin tapa kirjoittaa javascriptiä. React komponenttien palauttama JSX käännetään konepellin alla javascriptiksi.

Käännösvaiheen jälkeen ohjelmamme näyttää seuraavalta:

```js
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const now = new Date();
  const a = 10;
  const b = 20;
  return React.createElement(
    'div', null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  );
};

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
```

Käännöksen hoitaa [Babel](https://babeljs.io/repl/). Create-react-app:illa luoduissa projekteissa käännös on konfiguroitu tapahtumaan automaattisesti. Tulemme tutustumaan aiheeseen tarkemmin myöhemmin kurssilla.

Reactia olisi myös mahdollista kirjoittaa "suoraan javascriptinä" käyttämättä JSX:ää. Kukaan täysijärkinen ei kuitenkaan niin tee.

Käytännössä JSX on melkein kuin HTML:ää sillä erotuksella, että mukaan voi upottaa helposti dynaamista sisältöä kirjoittamalla sopivaa javascriptiä aaltosulkeiden sisälle. Idealtaan JSX on melko lähellä monia palvelimella käytettäviä templating-kieliä kuten Java Springin yhteydessä käytettävää thymeleafia.

## Monta komponenttia

Muutetaan sovellusta seuraavasti (yläreunan importit jätetään nyt ja jatkossa pois):

```react
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Olemme määritelleet uuden komponentin _Hello_, jota käytetään komponentista _App_. Komponenttia voidaan luonnollisesti käyttää monta kertaa:

```react
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      <Hello />
      <Hello />
    </div>
  )
}
```

Komponenttien tekeminen Reactissa on helppoa ja komponentteja yhdistelemällä monimutkaisempikin sovellus on mahdollista pitää kohtuullisesti ylläpidettävänä. Reactissa filosofiana onkin koostaa sovellus useista, pieneen asiaan keskittyvistä uudelleenkäytettävistä komponenteista.

Jatkamme komponentteihin tutustumista.

## props: tiedonvälitys komponenttien välillä

Komponenteille on mahdollista välittää dataa [propsien](https://reactjs.org/docs/components-and-props.html) avulla.

Muutetaan komponenttia _Hello_ seuraavasti

```react
const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}</p>
    </div>
  )
}
```

komponentin määrittelevällä funktiolla on nyt parametri _props_. Parametri saa arvokseen olion, jonka kenttinä ovat kaikki eri "propsit", jotka komponentin käyttäjä määrittelee.

Propsit määritellään seuraavasti:

```react
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" />
      <Hello name="Pekka" />
    </div>
  )
}
```

Propseja voi olla mielivaltainen lukumäärä ja niiden arvot voivat olla "kovakoodattuja" tai javascript-lausekkeiden tuloksia. Jos propsin arvo muodostetaan javascriptillä, tulee se olla aaltosulkeissa.

Seuraavassa on määritelty, että komponentti _Hello_ käyttää kahta propsia:

```react
const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const nimi = 'Pekka'
  const ika = 10
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" age={26 + 10} />
      <Hello name={nimi} age={ika} />
    </div>
  )
}
```

Komponentti _App_ lähettää propseina muuttujan arvoja, summalausekkeen evaluoinnin tuloksen ja normaalin merkkinonon.

### Muutama huomio

React on konfiguroitu antamaan varsin hyviä virheilmoituksia. Kannattaa kuitenkin edetä ainakin alussa **todella pienin askelin** ja varmistaa, että jokainen muutos toimii halutulla tavalla.

**Konsolin tulee olla koko ajan auki**. Jos selain ilmoittaa virheestä, ei kannata kirjoittaa sokeasti lisää koodia ja toivoa ihmettä tapahtuvaksi vaan tulee yrittää ymmärtää virheen syy ja esim. palata edelliseen toimivaan tilaan:

![]({{ "/assets/1/27.png" | absolute_url }})

Kannattaa myös muistaa, että React-koodissakin on mahdollista ja kannattavaa lisätä koodin sekaan sopivia konsoliin tulostavia <code>console.log()</code>-komentoja. Tulemme hieman [myöhemmin](#react-sovellusten-debuggaus) tutustumaan muutamiin muihinkin tapoihin debugata Reactia.

Kannattaa pitää mielessä, että **React-komponenttien nimien tulee alkaa isolla kirjaimella**. Jos yrität määritellä komponentin seuraavasti

```react
const footer = () => {
  return (
    <div>greeting app created by <a href="https://github.com/mluukkai">mluukkai</a></div>
  )
}
```

ja ottaa sen käyttöön

```react
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" age={26 + 10} />
      <footer />
    </div>
  )
}
```

sivulle ei kuitenkaan tule mitään, sillä React luo sivulle ainoastaan tyhjän _div_-elementin. Jos muutat komponentin nimen alkamaan isolla kirjaimella, kaikki toimii taas.

Kannattaa pitää mielessä, että React-komponentin sisällön tulee (yleensä) sisältää **yksi juurielementti**. Eli jos yrittäisimme määritellä komponentin _App_ ilman uloimmaistaa _div_-elementtiä:

```react
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name="Arto" age={26 + 10} />
    <footer />
  )
}
```

seurauksena on virheilmoitus:

![]({{ "/assets/1/27a.png" | absolute_url }})

Reactin versiosta 0.16 asti juurielementin käyttö ei ole ollut enää ainoa toimiva vaihtoehto, myös _taulukollinen_ komponentteja on validi tapa:

```react
const App = () => {
  return (
    [
      <h1>Greetings</h1>,
      <Hello name="Arto" age={26 + 10} />,
      <footer />
    ]
  )
}
```

Määritellessä sovelluksen juurikomponenttia, tämä ei kuitenkaan ole järkevää ja näyttää koodissakin hirveältä.

### React-tehtävät, osa 1

Tee nyt [tehtävät 7 ja 8](../tehtavat#kokoelmien renderöinti)

## Javascriptiä

Kurssin aikana on websovelluskehityksen rinnalla tavoite ja tarve oppia riittävässä määrin Javascriptiä.

Javascript on kehittynyt viime vuosina nopeaan tahtiin, ja käytämme kurssilla kielen uusimpien versioiden piirteitä, joista osa ei ole vielä olemassa kielen standardoiduissa versiossa. Javascript-standardin virallinen nimi on [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). Tämän hetken tuorein version on kesäkuussa 2017 julkaistu [ES8](https://www.ecma-international.org/publications/standards/Ecma-262.htm), toiselta nimeltään ECMAScript 2017.

Selaimet eivät vielä osaa kaikkia Javascriptin uusimpien versioiden ominaisuuksia. Tämän takia selaimessa suoritetaan useimmiten koodia joka on käännetty tai englanniksi _transpiled_ uudemmasta javascriptin versiosta johonkin vanhempaan, laajemmin tuettuun versioon.

Tällä hetkellä johtava tapa tehdä transpilointi on [Babel](https://babeljs.io/). Create-react-app:in avulla luoduissa React-sovelluksissa on valmiiksi konfiguroitu automaattinen transpilaus. Katsomme myöhemmin kurssilla tarkemmin miten transpiloinnin konfigurointi tapahtuu.

[Node.js](https://nodejs.org/en/) on melkein missä vaan, mm. palvelimilla toimiva, Googlen [chrome V8](https://developers.google.com/v8/)-javascriptmoottoriin perustuva javascriptsuoritusympäristö. Harjoitellaan hieman Javascriptiä Nodella. Tässä oletetaan, että koneellasi on Node.js:stä vähintään versio _v8.6.0_. Noden tuoreet versiot osaavat suoraan javascriptin uusia versioita, joten koodin transpilaus ei ole tarpeen.

Koodi kirjoitetaan <em>.js-</em>päätteiseen tiedostoon, ja suoritetaan komennolla <code>node tiedosto.js</code>

Koodia on mahdollisuus kirjoittaa myös Node.js-konsoliin, joka aukeaa kun kirjoitat komentorivillä _node_ tai myös selaimen developer toolin konsoliin. Chromen uusimmat versiot osaavat tuoraan transpiloimatta [melko hyvin](http://kangax.github.io/compat-table/es6/) javascriptin uusiakin piirteitä.

Javascript muistuttaa nimensä ja syntaksinsa puolesta läheisesti Javaa. Perusmekanismeiltaan kielet kuitenkin poikkeavat radikaalisti. Java-taustalta tultaessa Javascriptin käyttäytyminen saattaa aiheuttaa hämmennystä, varsinkin jos kielen piirteistä ei viitsitä ottaa selvää.

Tietyissä piireissä on myös ollut suosittua yrittää "simuloida" Javascriptilla eräitä Javan piirteitä ja ohjelmointitapoja. En suosittele.

### Muuttujat

Javascriptissä on kolme tapaa määritellä muuttujia:

```js
const x = 1
let y = 5

console.log(x, y)  // tulostuu 1, 5
y += 10
console.log(x, y)  // tulostuu 1, 15
y = 'teksti'
console.log(x, y)  // tulostuu 1, teksti
x = 4              // aiheuttaa virheen
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) ei oikeastaan määrittele muuttujaa vaan _vakion_, jonka arvoa ei voi enää muuttaa. [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) taas määrittelee normaalin muuttujan. Javascriptissa on myös mahdollista määritellä muuttujia avainsanan [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) avulla. Älä käytä tällä kurssilla varia, käytä aina const:ia tai let:iä!

Esimerkistä näemme myös, että muuttujalla voi vaihtaa tyyppiä suorituksen aikana, _y_ tallettaa aluksi luvun ja lopulta merkkijonon.

Lisää aiheesta esim. youtubessa [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)

### Taulukot

[Taulukko](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) ja muutama esimerkki sen käytöstä

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length)  // tulostuu 4
console.log(t[1])      // tuostuu -1

t.forEach((luku) => {
  console.log(luku)    // tulostuu 1, -1, 3 ja 5 omille riveilleen
})

t[6] = 99

console.log(t)         // tulostuu [ 1, -1, 3, 5, <2 empty items>, 99 ]
```

Huomattavaa esimerkissä on se, että taulukon sisältöä voi muuttaa vaikka sen on määritelty _const_ iksi. Koska taulukko on olio, viittaa muuttuja koko ajan samaan olioon. Olion sisältö muuttuu sitä mukaa kun taulukkoon lisätään uusia alkioita.

Eräs tapa käydä taulukon alkiot läpi on esimerkissä käytetty _forEach_, joka saa parametrikseen nuolisyntaksilla määritellyn _funktion_

```js
(luku) => {
  console.log(luku)
}
```

forEach kutsuu funktiota _jokaiselle taulukon alkiolle_ antaen taulukon alkion aina parametrina. forEachin parametrina oleva funktio voi saada myös [muita parametreja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

Taulukoille on määritelty runsaasti hyödyllisiä operaatioita, tutustumme niihin tarkemmin laskareissa. Katsotaan kuitenkin jo nyt pieni esimerkki operaation [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) käytöstä.

```js
const t = [1, 2, 3, 4]

const m1 = t.map((luku) => luku * 2)
console.log(m1) // tulostuu 2, 4, 6, 8

const m2 = t.map((luku) => '<li>' + luku + '</li>')
console.log(m2) // tulostuu [ '<li>1</li>', '<li>2</li>', '<li>3</li>', '<li>4</li>' ]
```

Map siis muodostaa taulukon perusteella uuden taulukon, jonka jokainen alkio muodostetaan map:in parametrina olevan funktion avulla. Kuten tulemme kurssin [osassa2](/osa2) näkemään, mapia käytetään Reactissa todella usein.

### Oliot

Javasriptissa on muutama tapa määritellä olioita. Erittäin yleisesti käytetään [olioliteraaleja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), eli määritellään olio luettelemalla sen kentät (englanniksi property) aaltosulkeiden sisällä:

```js
const olio1 = {
  nimi: 'Arto Hellas',
  ika: 35,
  koulutus: 'Filosofian tohtori'
}

const olio2 = {
  nimi: 'Full Stack -websovelluskehitys',
  taso: 'aineopinto',
  laajuus: 5
}

const olio3 = {
  nimi: {
   etunimi: 'Jami',
    sukunimi: 'Kousa'
  },
  arvosanat: [2, 3, 5, 3],
  laitos: 'TKTL'
}
```

Kentät voivat olla mielivaltaista javascriptin tyyppiä.

Olioiden kenttiin viitataan pistenotaatiolla, tai kulmasulkeilla:

```js
console.log(olio1.nimi)          // tulostuu Arto Hellas
const kentanNimi = 'ika'
console.log(olio1[kentanNimi])   // tulostuu 35
```

Olioille voidaan lisätä kenttiä myös lennossa joko pistenotaation tai kulmasulkeiden avulla:

```js
olio1.osoite = 'Tapiola'
olio1['salainen numero'] = 12341
```

Jälkimäinen lisäyksistä on pakko tehdä kulmasulkeiden avulla, sillä pistenotaatiota käytettäessä 'salainen numero' ei kelpaa kentän nimeksi.

Javascriptissä olioilla voi luonnollisesti olla myös metodeja. Palaamme aiheeseen funktioiden käsittelyn jälkeen.

Olioita on myös mahdollista määritellä ns. konstruktorifunktioiden avulla, jolloin saadaan aikaan hieman monien ohjelmointikielten, esim. Javan luokkia (class) muistuttava mekanismi. Javascriptissä ei kuitenkaan ole luokkia samassa mielessä kuin olio-ohjelmointikielissä. Kieleen on kuitenkin lisätty versiosta ES6 alkaen _luokkasyntaksi_, joka helpottaa tietyissä tilanteissa olio-ohjelmointikielimäisten luokkien esittämistä. Palaamme asiaan hetken kuluttua.

Reactissa konstruktorifunktioihin perustuvalle olioiden määrittelyyn ei ole kovin usein tarvetta, joten sivuutamme sen ainakin toistaiseksi.

### Funktiot

Olemme jo tutustuneet ns. nuolifunktioiden määrittelyyn. Täydellinen (tai "pitkän kaavan" mukaan menevä) tapa nuolifunktion määrittelyyn on seuraava

```js
const summa = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

ja funktiota kutsutaan kuten olettaa saattaa

```js
const vastaus = summa(1,5)
console.log(vastaus)
```

Jos parameteja on vain yksi, voidaan sulut jättää määrittelystä pois:

```js
const nelio = p => {
  console.log(p)
  return p * p
}
```

Jos funktio sisältää ainoastaan yhden lausekkeen, ei aaltosulkeita tarvita. Tällöin funktio palauttaa ainoan lausekkeensa arvon. Eli edellinen voitaisiin ilmaista lyhyemmin seuraavasti:

```js
const nelio = p => p * p
```

Tämä muoto on erityisen kätevä käsiteltäessä taulukkoja esim. map-metodin avulla:

```js
const t = [1, 2, 3]
const tnelio = t.map(p => p * p)
// tnelio on nyt [1, 4, 9]
```

Nuolifunktio on tullut javascriptiin vasta muutama vuosi sitten version [ES6](http://es6-features.org/) myötä. Tätä ennen ja paikoin nykyäänkin funktioden määrittely tapahtui avainsanan _function_ avulla.

Määrittelytapoja on kaksi, funktiolle voidaan antaa [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function) tyyppisessä määrittelyssä _nimi_ jonka avulla funktioon voidaan viitata:

```js
function tulo(a, b) {
  return a * b
}

const vastaus = tulo(2, 6)
```

Toinen tapa on tehdä määrittely [funktiolausekkeena](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). Tällöin funktiolle ei tarvitse antaa nimeä ja määrittely voi sijaita muun koodin seassa:

```js
const keskiarvo = function(a, b) {
  return (a + b) / 2
}

const vastaus = keskiarvo(2, 5)
```

### Tehtäviä javascriptistä

Tee nyt [tehtävät 9-11](../tehtavat#javascriptin-alkeet)

### Olioiden metodit ja this

Kaikille kolmelle tavalle määritellä funktio on oma paikkansa.

Nuolifunktiot ja avainsanan _function_ avulla määritellyt funktiot kuitenkin poikkeavat radikaalisti siitä miten ne käyttytyvät avainsanan _this_  suhteen.

Voimme liittää oliolle metodeja määrittelemällä niille kenttiä, jotka ovat funktioita:

```js
const arto = {
  nimi: 'Arto Hellas',
  ika: 35,
  koulutus: 'Filosofian tohtori',
  tervehdi: function () {
    console.log('hello, my name is', this.nimi)
  }
}

arto.tervehdi()  // tulostuu hello, my name is Arto Hellas
```

metodeja voidaan liittää olioille myös niiden luomisen jälkeen:

```js
const arto = {
  nimi: 'Arto Hellas',
  ika: 35,
  koulutus: 'Filosofian tohtori',
  tervehdi: function () {
    console.log('hello, my name is', this.nimi)
  }
}

arto.vanhene = function() {
  this.ika += 1
}

console.log(arto.ika)  // tulostuu 35
arto.vanhene()
console.log(arto.ika)  // tulostuu 36
```

Muutetaan olioa hiukan

```js
const arto = {
  nimi: 'Arto Hellas',
  tervehdi: function () {
    console.log('hello, my name is', this.nimi)
  },
  laskeSumma: function (a, b) {
    console.log(a + b)
  }
}

arto.laskeSumma(1, 4)   // tulostuu 5

const viiteSummaan = arto.laskeSumma
viiteSummaan(10, 15)   // tulostuu 25
```

Oliolla on nyt metodi _laskeSumma_, joka osaa laskea parametrina annettujen lukujen summan. Metodia voidaan kutsua normaaliin tapaan olion kautta <code>arto.laskeSumma(1, 4)</code> tai tallettamalla _metodiviite_ muuttujaan ja kutsumalla metodia muuttujan kautta <code>viiteSummaan(10, 15)</code>.

Jos yritämme samaa metodille _tervehdi_, aiheutuu ongelmia:

```js
const arto = {
  nimi: 'Arto Hellas',
  tervehdi: function () {
    console.log('hello, my name is', this.nimi)
  },
  laskeSumma: function (a, b) {
    console.log(a + b)
  }
}

arto.tervehdi()        // tulostuu hello, my name is Arto Hellas

const viiteTervehdykseen = arto.tervehdi
viiteTervehdykseen()   // tulostuu hello, my name is undefined
```

Kutsuttaessa metodia viitteen kautta, on metodi kadottanut tiedon siitä mikä oli alkuperäinen _this_. Toisin kuin melkein kaikissa muissa kielissä, javascriptissa [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this):n arvo määrittyy sen mukaan _miten oliota on kutsuttu_. Kutsuttaessa metodia viitteen kautta, _this_:in arvoksi tulee ns. [globaali objekti](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) ja lopputulos ei ole yleensä ollenkaan se mitä sovelluskehittäjä olettaa.

Thisin kadottaminen aiheuttaa Reactilla ja Node.js:lla ohjelmoidessa monia potentiaalisia ongelmia. Eteen tulee erittäin usein tilanteita, missä Reactin/Noden (oikeammin ilmaistuna selaimen Javascript-moottorin) tulee kutsua joitain käyttäjän määrittelemien olioiden metodeja. Tälläinen tilanne tulee esim. jos pyytetään Artoa tervehtimään sekunnin kuluttua metodia [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) hyväksikäyttäen.

```js
const arto = {
  nimi: 'Arto Hellas',
  tervehdi: function () {
    console.log('hello, my name is', this.nimi)
  }
}

setTimeout(arto.tervehdi, 1000)
```

Javascriptissa this:in arvo siis määräytyy siitä miten metodia on kutsuttu. setTimeoutia käytettäessä metodia kutsuu Javascript-moottori ja this viittaa Timeout-olioon.

On useita mekanismeja, joiden avulla alkuperäinen _this_ voidaan säilyttää, eräs näistä on metodin [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) käyttö:

```js
setTimeout(arto.tervehdi.bind(arto), 1000)
```

Komento <code>arto.tervehdi.bind(arto)</code> luo uuden funktion, missä se on sitonut _this_:in tarkottamaan Artoa riippumatta siitä missä metodia kutsutaan.

[Nuolifunktioiden](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) avulla on mahdollista ratkaista eräitä thisiin liittyviä ongelmia. Olioiden metodeina niitä ei kuitenkaan kannata käyttää, sillä silloin _this_ ei toimi ollenkaan. Palaamme nuolifunktioiden this:in käyttäytymiseen myöhemmin.

Jos haluat ymmärtää paremmin javascriptin _this_:in toimintaa, löytyy internetistä runsaasti materiaalia aiheesta. Esim. [egghead.io](https://egghead.io):n 20 minuutin screencastsarja [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) on erittäin suositeltava!

### Luokat

Kuten aiemmin mainittiin, Javascriptissä ei ole olemassa olio-ohjelmointikielten luokkamekanismia. Javascriptissa on kuitenkin ominaisuuksia, jotka mahdollistavat olio-ohjelmoinnin [luokkien](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) "simuloinnin". Emme mene nyt sen tarkemmin Javascriptin olioiden taustalla olevaan [prototyyppiperintämekanismiin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain).

Tutustumme kuitenkin pikaisesti ES6:n myötä javascriptiin tulleeseen _luokkasyntaksiin_, joka helpottaa oleellisesti luokkien (tai luokan kaltaisten asioiden) määrittelyä Javascriptissa.

Seuraavassa on määritelty "luokka" Henkilö ja sille kaksi Henkilö-olioa:

```js
class Henkilo {
  constructor(nimi, ika) {
    this.nimi = nimi
    this.ika = ika
  }
  tervehdi() {
    console.log('hello, my name is', this.nimi)
  }
}

const arto = new Henkilo('Arto Hellas', 35)
arto.tervehdi()

const jami = new Henkilo('Jami Kousa', 21)
jami.tervehdi()
```

Syntaksin osalta luokat ja niistä luodut oliot muistuttavat erittäin paljon esim. Javan olioita. Käyttäytymiseltäänkin ne ovat aika lähellä Javan olioita. Perimmiltään kyseessä on kuitenkin edelleen Javascriptin [prototyyppiperintään](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance) perustuvista olioista. Molempien olioiden todellinen tyyppi on _Object_ sillä javascriptissä ei perimmiltään ole muita tyyppejä kuin kuin [Boolean, Null, Undefined, Number, String, Symbol ja Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)

Luokkasyntaksin tuominen javascriptiin oli osin kiistelty lisäys, ks. esim. [Not Awesome: ES6 Classes](https://github.com/joshburgess/not-awesome-es6-classes) tai [Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)

ES6:n luokkasyntaksia käytetään kuitenkin paljon Reactissa ja Node.js:ssä ja siksi mekin käytämme sitä sopivissa määrin. Olio-ohjelmointimainen luokkahierarkioiden luominen ei kuitenkaan ole Reactin eikä tämän kurssin suositeltavan hengen mukaista. Reactia ohjelmoitaessa pyritään enemmän funktionaaliseen ohjelmointityyliin.

### Javascript-materiaalia

Javascriptistä löytyy verkosta suuret määrät sekä hyvää että huonoa materiaalia. Tällä sivulla lähes kaikki Javascriptin ominaisuuksia käsittelevät linkit ovat [Mozillan javascript -materiaaliin](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

Mozillan sivuilta kannattaa lukea oikeastaan välittömästi [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript).

Jos haluat tutustua todella syvällisesti Javascriptiin, löytyy internetistä ilmaiseksi mainio kirjasarja [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)

[egghead.io](https://egghead.io):lla on tarjolla runsaasti laadukkaita screencasteja Javascriptista, Reactista ym. kiinnostavasta. Valitettavasti materiaali on osittain maksullista.

## Paluu Reactin äärelle

Palataan jälleen Reactin pariin.

Aiemmassa esimerkissämme käytimme funktionaalisia komponentteja, eli määrittelimme kaikki komponentit nuolifunktioiden avulla, esim:

```react
const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}
```

Toinen tapa komponenttien määrittelyyn on käyttää luokkasyntaksia. Tällöin komponentti määritellään luokaksi, joka perii [React.Component](https://reactjs.org/docs/react-component.html)-luokan.

Muutetaan esimerkkisovelluksen komponentti _Hello_ luokaksi seuraavasti:

```react
class Hello extends React.Component {
  render() {
    return (
      <div>
        <p>Hello {this.props.name}, you are {this.props.age} years old</p>
      </div>
    )
  }
}
```

Luokkakomponenttien tulee määritellä ainakin metodi _render_, joka palauttaa komponentin ulkoasun määrittelevät React-elementit eli käytännössä JSX:n.

Luokkakomponentissa viitataan komponentin _propseihin_ this-viitteen kautta.
Eli koska komponenttia käytetään seuraavasti

```html
<Hello name="Arto" age={36} />
```

päästään nimeen ja ikään käsiksi luokkamuotoisen komponentin sisällä viittaamalla _this.props.name_ ja _this.props.age_. Huomaa ero funktionaaliseen komponenttiin!

Luokkakomponenteille voidaan tarvittaessa määritellä muitakin metodeja ja "oliomuuttujia", eli kenttiä.

Voisimme esim. määritellä metodin seuraavasti:

```react
class Hello extends React.Component {
  bornYear() {
    const yearNow = 1900 + new Date().getYear()
    return yearNow - this.props.age
  }
  render() {
    return (
      <div>
        <p>
          Hello {this.props.name}, you are {this.props.age} years old <br />
          So you were propably born {this.bornYear()}
        </p>
      </div>
    )
  }
}
```

Metodia kutsutaan render:in sisältä käyttäen _this_-viitettä syntaksilla <code>this.bornYear()</code>.

Tässä tilanteessa ei kuitenkaan ole varsinaisesti mitään hyötyä määritellä apufunktiota _bornYear_ metodiksi, joten parempi olisi määritellä se metodin _render_ sisäisenä apumetodina:

```react
class Hello extends React.Component {
  render() {
    const bornYear = () => {
      const yearNow = 1900 + new Date().getYear()
      return yearNow - this.props.age
    }

    return (
      <div>
        <p>
          Hello {this.props.name}, you are {this.props.age} years old <br />
          So you were propably born {bornYear()}
        </p>
      </div>
    )
  }
}
```

Huomaa, että nyt metodia _ei_ kutsuta viitteen _this_ kautta sillä, vaan syntaksilla <code>bornYear()</code>, sillä metodi ei ole komponentin eli _this_:in tasolla määritelty. Metodia _bornYear_ ei nyt voi kutsua mistään muualta kuin metodin _render_ sisältä, sillä se ei näy renderin ulkopuolelle.

Ennen kuin siirrymme eteenpäin, tarkastellaan erästä pientä, mutta käyttökelpoista ES6:n mukanaan tuomaa uutta piirrettä javascriptissä, eli sijoittamisen yhteydessä tapahtuvaa [destrukturointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Jouduimme äskeisessä koodissa viittaamaan propseina välitettyyn dataan hieman ikävästi muodossa _this.props.name_ ja _this.props.age_. Näistä _this.props.age_ pitää toistaa metodissa _render_ kahteen kertaan.

Koska _this.props_ on nyt olio

```js
this.props = {
  name: 'Arto Hellas',
  age: 35
}
```

voisimme suoraviivaistaa metodia _render_ siten, että sijoittaisimme kenttien arvot muuttujiin _name_ ja _age_ joita voisimme sitten hyödyntää

```react
render() {
  const name = this.props.name
  const age = this.props.age
  const bornYear = () => 1900 + new Date().getYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old <br />
        So you were propably born {bornYear()}
      </p>
    </div>
  )
}
```

Huomaa, että olemme myös hyödyntäneet nuolifunktion kompaktimpaa kirjoitustapaa metodin _bornYear_ määrittelyssä.

Destrukturointi tekee asian vielä helpommaksi, sen avulla voimme "kerätä" olion oliomuuttujien arvot suoraan omiin yksittäisiin muuttujiin:

```react
class Hello extends React.Component {
  render() {
    const {name, age} = this.props
    const bornYear = () => 1900 + new Date().getYear() - age

    return (
      <div>
        <p>
          Hello {name}, you are {age} years old <br />
          So you were propably born {bornYear()}
        </p>
      </div>
    )
  }
}
```

Eli koska

```js
this.props = {
  name: 'Arto Hellas',
  age: 35
}
```

saa <code> const {name, age} = this.props</code> aikaan sen, että _name_ saa arvon 'Arto Hellas' ja _age_ arvon 35.

Komponentti _Hello_ on oikeastaan luonteeltaan sellainen, että sitä ei ole järkevää määritellä luokkasyntaksilla. Reactin best practice onkin käyttää funktioiden avulla määriteltyjä komponentteja aina kuin mahdollista.

### Sivun uudelleenrenderöinti

Toistaiseksi tekemämme sovellukset ovat olleet sellaisia, että kun niiden komponentit on kerran renderöity, niiden ulkoasua ei ole enää voinut muuttaa. Entä jos haluaisimme toteuttaa laskurin, jonka arvo kasvaa esim. ajan kuluessa tai nappien painallusten yhteydessä?

Aloitetaan seuraavasta rungosta:

```react
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter.value}</div>
  )
}

const counter = {
  value: 1
}

ReactDOM.render(
  <App counter={counter} />,
  document.getElementById('root')
)
```

Sovelluksen juurikomponentille siis annetaan viite laskuriin. Juurikomponentti renderöi arvon ruudulle. Entä laskurin arvon muuttuessa? Jos lisäämme ohjelmaan esim. komennon

```react
counter.value += 1
```

ei komponenttia kuitenkaan renderöidä uudelleen. Voimme saada komponentin uudelleenrenderöitymään kutsumalla uudelleen metodia _ReactDOM.render_, esim. seuraavasti

```react
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter.value}</div>
  )
}

const counter = {
  value: 1
}

const renderoi = () => {
  ReactDOM.render(
    <App counter={counter} />,
    document.getElementById('root')
  )
}

renderoi()
counter.value += 1
renderoi()
counter.value += 1
renderoi()
```

Copypastea vähentämään on komponentin renderöinti kääritty funktioon _renderoi_.

Nyt komponentti renderöityy kolme kertaa, saaden ensin arvon 1, sitten 2 ja lopulta 3. 1 ja 2 tosin ovat ruudulla niin vähän aikaa, että niitä ei ehdi havaita.

Hieman mielenkiintoisempaan toiminnallisuuteen pääsemme tekemällä renderöinnin ja laskurin kasvatuksen toistuvasti sekunnin välein käyttäen [SetInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  renderoi()
  counter.value += 1;
}, 1000)
```

_ReactDOM.render_-metodin toistuva kutsuminen ei kuitenkaan ole suositeltu tapa päivittää komponentteja. Tutustutaan seuraavaksi järkevämpään tapaan.

### Tilallinen komponentti

Muutetaan esimerkkisovelluksen komponentti _App_ luokkaperustaiseksi:

```react
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 1
    }
  }

  render() {
    return (
      <div>{this.state.counter}</div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

Komponentilla on nyt metodin _render_ lisäksi _konstruktori_. Komponentin konstruktori saa parametrikseen sille välitettävät muuttujat parametrin _props_ välityksellä, konstruktorin ensimmäisen rivin on oltava kutsu <code>super(props)</code>.

Luokkiin perustuvalla komponenteilla voi olla _tila_, joka talletetaan muuttujaan _state_.

Konstruktori määrittelee komponentin alkutilan olevan:

```js
{
  counter: 1
}
```

Eli tila sisältää kentän _counter_, jonka arvo on 1. React-komponenttien tilaa, eli muuttujaa _this.state_ **ei saa päivittää suoraan**, tilan päivitys on tehtävä **aina** funktion [setState](https://reactjs.org/docs/faq-state.html#what-does-setstate-do) avulla. Metodin kutsuminen päivittää tilan _ja_ aiheuttaa komponentin uuden renderöinnin (ellei sitä ole estetty [osassa 2](/osa2) esiteltävällä tavalla). Uudelleenrenderöinnin yhteydessä myös kaikki komponentin sisältämät alikomponentit renderöidään.

Muutetaan komponenttia _App_ siten, että konstruktorissa käynnistetään ajastin, joka kutsuu funktiota _setState_ toistuvasti sekunnin välein korottaen laskurin arvoa aina yhdellä:

```render
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }

    setInterval(() => {
      this.setState({ counter: this.state.counter + 1 })
    }, 1000);
  }
  render() {
    return (
      <div>{this.state.counter}</div>
    )
  }
}
```

### Tapahtumankäsittely

Mainitsimme jo alun johdanto-osassa muutamaan kertaan _tapahtumankäsittelijät_, eli funktiot, jotka on rekisteröity kutsuttavaksi tiettyjen tapahtumien eli eventien yhteydessä. Esim. käyttäjän interaktio sivun elementtien kanssa aiheuttaa joukon erinäisiä tapahtumia.

Muutetaan sovellusta siten, että laskurin kasvaminen tapahtuukin käyttäjän painaessa [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)-elementin avulla toteutettua nappia.

Button-elementit tukevat mm. [hiiritapahtumia](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) (mouse events), joista yleisin on [click](https://developer.mozilla.org/en-US/docs/Web/Events/click).

Reactissa funktion rekisteröiminen tapahtumankäsittelijäksi tapahtumalle _click_ [tapahtuu](https://reactjs.org/docs/handling-events.html) seuraavasti:

```react
const funktio = () => { /* koodi */ }

//...

<button onClick={funktio}>
  plus
</button>
```

Eli laitetaan _button_:in onClick-attribuutin arvoksi aaltosulkeissa oleva viite koodissa määriteltyyn funktioon.

Tapahtumankäsittelijäfunktio voidaan määritellä suoraan onClick-määrittelyn yhteydessä:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
  }

  render() {
    return (
      <div>
        <div>{this.state.counter}</div>
        <button onClick={() => console.log('clicked')}>
          plus
        </button>
      </div>
    )
  }
}
```

Nyt jokainen napin _plus_ painallus tulostaa konsoliin _clicked_.

Muuttamalla tapahtumankäsittelijä seuraavaan muotoon

```html
<button onClick={() => this.setState({ counter: this.state.counter + 1 })}>
  plus
</button>
```

saamme halutun toiminnallisuuden.

Lisätään sovellukseen myös nappi laskurin nollaamiseen:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
  }

  render() {
    return (
      <div>
        <div>{this.state.counter}</div>
        <div>
          <button onClick={() => this.setState({ counter: this.state.counter + 1 })}>
            plus
          </button>
          <button onClick={() => this.setState({ counter: 0 })}>
            zero
          </button>
        </div>
      </div>
    )
  }
}
```

Sovelluksemme on valmis!

### Metodien käyttö ja _this_

Tapahtumankäsittelijöiden määrittely suoraan JSX-templatejen sisällä ei useimmiten ole kovin viisasta. Eriytetään nappien tapahtumankäsittelijä omaksi metodeikseen:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
  }

  kasvataYhdella() {
    this.setState({ counter: this.state.counter + 1 })
  }

  nollaa() {
    this.setState({ counter: 0 })
  }

  render() {
    return (
      <div>
        <div>{this.state.counter}</div>
        <div>
          <button onClick={this.kasvataYhdella}>
            plus
          </button>
          <button onClick={this.nollaa}>
            zero
          </button>
        </div>
      </div>
    )
  }
}
```

Komponentin määrittelemälle luokalle on nyt lisätty metodit _kasvataYhdella_ ja _nollaa_. Metodeihin _viitataan_ nappeja vastaavista React-elementeistä:

```jsx
<button onClick={this.kasvataYhdella}>
```

Kun testaamme nyt sovellusta, törmäämme ongelmaan. Virheilmoitus on erittäin hyvä:

![]({{ "/assets/1/28.png" | absolute_url }})

Eli törmäämme jo [aiemmin mainittuun](#olioiden-metodit-ja-this) ongelmaan alkuperäisen _this_:in kadottamisesta.

Kun selaimen javascriptin runtime kutsuu takaisinkutsufunktiota, _this_ ei enää viittaa komponenttiin _App_ vaan on arvoltaan _undefined_ eli määrittelemätön:

![]({{ "/assets/1/29.png" | absolute_url }})

Ongelmaan on useita erilaisia ratkaisuja. Eräs näistä on jo [aiemmin mainittu](#olioiden-metodit-ja-this) _bindaaminen_, eli esim. komennolla <code>this.kasvataYhdella.bind(this)</code> voimme muodostaa uuden funktion, jonka koodi on alkuperäisen funktion koodi missä _this_ on sidottu viittaamaan parametrina olevaan arvoon, eli komponenttiin itseensä.

Eli sovellus toimii taas jos koodi muotetaan muotoon:

```html
<button onClick={this.kasvataYhdella.bind(this)}>
  plus
</button>
<button onClick={this.nollaa.bind(this)}>
  zero
</button>
```

Jos samaa metodia joudutaan kutsumaan useasta kohtaa koodia, on hieman ikävää kirjoittaa toistuvasti metodin bindattu muoto React-elementtien sekaan.

Yksi mahdollisuus onkin suorittaa bindaukset konstruktorissa:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
    this.kasvataYhdella = this.kasvataYhdella.bind(this)
    this.nollaa = this.nollaa.bind(this)
  }
```

Nyt riittää viitata metodeihin "normaalisti", ilman bindiä:

```html
<button onClick={this.kasvataYhdella}>
  plus
</button>
<button onClick={this.nollaa}>
  zero
</button>
```

Teknisesti ottaen konstruktorissa korvataan kenttään _kasvataYhdella_ alunperin määritelty metodi uudella metodilla, jolla on alkuperäisen metodin koodi siten, että _this_ on pysyväti bindattu komponenttiin.

Ehkä paras ratkaisu _this_-ongelman estämiseen on käyttää tulevaan javascript-standardiin ehdotettua [class properties](https://babeljs.io/docs/plugins/transform-class-properties/) -ominaisuutta, jonka avulla voimme määritellä this:in suhteen hyvin käyttäytyviä metodeja seuraavasti:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
  }

  kasvataYhdella = () => {
    this.setState({ counter: this.state.counter + 1 })
  }

  nollaa = () => {
    this.setState({ counter: 0 })
  }

  render() {
    // ...
  }
```

Näin jokainen _App_-komponentti saa kentät _kasvataYhdella_ ja _nollaa_ jotka ovat funktioita, joiden _this_ on sidottu komponenttiin riippumatta siitä miten ja kenen toimesta metodia kutsutaan.

Syy miksi nuolifunktiolla määritelty metodi toimii _this_:in suhteen samaan tapaan kuin esim. Javassa, on se, että nuolifunktioilla on ns. _leksikaalinen (lexical) this_, eli nuolifunktion _this_ määräytyy sen määrittelykontekstin _this_:in mukaan. Kun metodi määritellään class propertynä, on määrittelykontekstina _App_-komponentti. Tarkempaa selitystä esim. [täällä](https://medium.com/@reasoncode/javascript-es6-arrow-functions-and-lexical-this-f2a3e2a5e8c4).

Käytämme kurssilla jatkossa tätä tapaa komponenttien metodien määrittelemiseen.

[class propertyt](https://babeljs.io/docs/plugins/transform-class-properties/) siis eivät ole vielä mukana uusimmassa javascript-standardissa eli kesäkuussa 2017 ilmestyneessä ES8:ssa. Voimme kuitenkin käyttää ominaisuutta create-react-app:illa luoduissa sovelluksissa, sillä [babel](https://babeljs.io/) osaa kääntää (eli transpiloida) ominaisuuden selainten ymmärtämään muotoon.

Node.js ei oletusarvoisesti vielä tue ominaisuutta, eli kääntämätöntä koodia joka sisältää class propertyjä ei voi vielä suorittaa Node.js:llä.

### Huomio funktion setState käytöstä

Käytimme metodia _setState_ kahteen kertaan:

```js
kasvataYhdella = () => {
  this.setState({ counter: this.state.counter + 1 })
}

nollaa = () => {
  this.setState({ counter: 0 })
}
```

Näistä ensimmäinen tapa <code>this.setState({ counter: this.state.counter + 1 })</code> ei ole kaikissa tilanteissa suositeltava, sillä React ei takaa että metodin _setState_ kutsut tapahtuvat [siinä järjestyksessä missä ne on kirjoitettu koodiin](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous).

Jos halutaan määritellä uusi tila olemassaolevan tilan perusteella, on varmempi kutsua _setState_:a seuraavasti:

```js
this.setState((prevState) => ({
  counter: prevState.counter
}));
```

Nyt metodin parametrina on funktio, jonka parametrina on edellinen tila _prevState_ ja tilan päivitys tapahtuu varmuudella kutsuhetken edellisen tilan perusteella.

Emme nyt viitsi käyttää tätä monimutkaisempa muotoa, sillä emme välitä vaikka sovelluksessamme ilmenisikin silloin tällöin pieni epäkonsistenssi (on epäselvää olisiko se sovelluksessamme edes teoriassa mahdollista).

Asia tulee kuitenkin ehdottomasti pitää mielessä, _setState_:n vääränlainen käyttö saattaa aiheuttaa hankalasti löydettävän, harvoin toistuvan bugin.

### Funktio joka palauttaa funktion ###

Metodit _kasvataYhdella_ ja _nollaa_ toimivat melkein samalla tavalla, ne asettavat uuden arvon laskurille. Kannattaakin tehdä yksittäinen metodi, joka sopii molempiin käyttötarkoituksiin:

```react
asetaArvoon = (arvo) => {
  this.setState({ counter: arvo })
}

render() {
  //...
  <button onClick={this.asetaArvoon(this.state.counter+1)}>
    Plus
  </button>
  <button onClick={this.asetaArvoon(0)}>
    Zero
  </button>
  //...
}
```

Huomaamme kuitenkin että muutos hajottaa sovelluksemme täysin:

![]({{ "/assets/1/30.png" | absolute_url }})

Mistä on kyse? Tapahtumankäsittelijäksi on tarkoitus määritllä viite _funktioon_. Kun koodissa on

```react
<button onClick={this.asetaArvoon(0)}>
```

tapahtumankäsittelijäksi tulee määriteltyä funktiokutsu. Sekin on monissa tilanteissa ok, mutta ei nyt, nimittäin kun React suorittaa metodin _render_, se suorittaa kutsun <code>this.asetaArvoon(0)</code>. Kutsu aiheuttaa metodin _setState_ kutsun. Tämä taas aiheuttaa uuden _render_-kutsun jne...

Tässä tilanteessa meidän onkin käytettävä yleistä Javascriptin ja yleisemminkin funktionaalisen ohjelmoinnin kikkaa, eli määritellä _funktio joka palauttaa funktion_:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
  }

  asetaArvoon = (arvo) => {
    return () => {
      this.setState({ counter: arvo })
    }
  }

  render() {
    return (
      <div>
        <div>{this.state.counter}</div>
        <div>
          <button onClick={this.asetaArvoon(this.state.counter + 1)}>
            Plus
          </button>
          <button onClick={this.asetaArvoon(0)}>
            Zero
          </button>
        </div>
      </div>
    )
  }
}
```

Jos et ole aiemmin törmännyt tekniikkaan, siihen totutteluun voi mennä tovi.

Olemme siis määritelleen komponentin metodin seuraavasti:

```js
asetaArvoon = (arvo) => {
  return () => {
    this.setState({ counter: arvo })
  }
}
```

Kun _render_-metodissa määritellään tapahtumankäsittelijä kutsumalla <code>this.asetaArvoon(0)</code>, on lopputuloksena

```js
() => {
  this.setState({ counter: 0 })
}
```

eli juuri oikeanlainen tilan nollaamisen aiheuttava funktio!

Plus-napin tapahtumankäsittelijä määritellään kutsumalla <code>this.asetaArvoon(this.state.counter + 1)</code>. Kun komponentti renderöidään ensimmäisen kerran, _this.state.counter_ on saanut konstruktorissa arvon 1, eli plus-napin tapahtumankäsittelijäksi tulee metodukutsun <code>this.asetaArvoon(1 + 1)</code> tulos, eli funktio

```js
() => {
  this.setState({ counter: 2 })
}
```

Vastaavasti, kun laskurin tila on esim 41, tulee plus-napin tapahtumakuuntelijaksi

```js
() => {
  this.setState({ counter: 42 })
}
```

Tarkastellaan vielä hieman metodia _asetaArvoon_:

```js
asetaArvoon = (arvo) => {
  return () => {
    this.setState({ counter: arvo })
  }
}
```

Koska metodi itse sisältää ainoastaan yhden komennon, eli _returnin_, joka palauttaa funktion, voidaan hyödyntää nuolifunktion tiiviimpää muotoa:

```js
asetaArvoon = (arvo) =>
  () => {
    this.setState({ counter: arvo })
  }
```

Usein tälläisissä tilanteissa kaikki kirjoitetaan samalle riville, jolloin tuloksena on "kaksi nuolta sisältävä funktio":

```js
asetaArvoon = (arvo) => () => this.setState({ counter: arvo })
```

Kaksinuolisen funktion voi ajatella funktiona, jota lopullisen tuloksen saadakseen täytyy voi kutsua kaksi kertaa.

Ensimmäisellä kutsulla "konfiguroidaan" varsinainen funktio, sijoittamalla osalle parametreista arvo. Eli kutsu <code>asetaArvoon(5)</code> sitoo muuttujan _arvo_ arvon 5 ja funktiosta "jää jäljelle" seuraava funktio:

```js
() => this.setState({ counter: 5 })
```

Tässä näytetty tapa soveltaa funktioita palauttavia funktioita on oleellisesti sama asia mistä funktionaalisessa ohjelmoinnissa käytetään termiä [currying](http://www.datchley.name/currying-vs-partial-application/). Termi currying ei ole lähtöisin funktionaalisen ohjelmoinnin piiristä vaan sillä on juuret [syvällä matematiikassa](https://en.wikipedia.org/wiki/Currying)

Jo muutamaan kertaan mainittu termi _funktionaalinen ohjelmointi_ ei ole välttämättä kaikille tässä vaiheessa tuttu. Asiaa avataan hiukan kurssin kuluessa, sillä React tukee ja osin edellyttää funktionaalisen tyylin käyttöä.

### Tilan vieminen alikomponenttiin

Reactissa suositaan pieniä komponentteja, joita on mahdollista uusiokäyttää monessa osissa sovellusta ja jopa useissa eri sovelluksissa. Refaktoroidaan koodiamme vielä siten, että yhden komponentin sijaan koostamme laskurin näytöstä ja kahdesta painikkeesta.

Tehdään ensin näytöstä vastaava komponentti _Display_.

Reactissa parhaana käytänteenä on sijoittaa tila [mahdollisimman ylös](https://reactjs.org/docs/lifting-state-up.html) komponenttihierarkiassa, mielellään sovelluksen juurikomponenttiin.

Eli jätetään sovelluksen tila, eli laskimen arvo komponenttiin _App_ ja välitetään tila _props_:ien avulla komponentille _Display_:

```react
const Display = (props) => <div>{props.counter}</div>
```

Kyseessä on siis todella yksinkertainen komponentti joka kannattaa ehdottomasti määritellä funktion avulla eli funktionaalisena komponenttina.

Voimme hyödyntää aiemmin mainittua [destrukturointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) myös metodien parametreissa. Eli koska olemme kiinnostuneita _props_:in kentästä _counter_, on edellinen mahdollista yksinkertaistaa seuraavaan muotoon:

```react
const Display = ({ counter }) => <div>{counter}</div>
```

Komponentin käyttö on suoraviivaista, riittää että sille välitetään laskurin tila eli _this.state.counter_:

```react
class App extends React.Component {
  // ...
  render() {
    return (
      <div>
        <Display counter={this.state.counter}/>
        <div>
          <button onClick={this.asetaArvoon(this.state.counter+1)}>
            Plus
          </button>
          <button onClick={this.asetaArvoon(0)}>
            Zero
          </button>
        </div>
      </div>
    )
  }
}
```

Kaikki toimii edelleen. Kun nappeja painetaan ja _App_ renderöityy uudelleen, renderöityvät myös kaikki sen alikomponentit, siis myös _Display_ automaattisesti uudelleen.

Tehdään seuraavaksi napeille tarkoitettu komponentti _Button_. Napille on välitettävä propsien avulla tapahtumankäsittelijä sekä napin teksti:

```react
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

ja hyödynnetään taas destrukturointia ottamaan _props_:in tarpeelliset kentät suoraan:

```react
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

Komponentin _App_ metodi _render_ muuttuu nyt muotoon:

```react
render() {
  return (
    <div>
      <Display counter={this.state.counter}/>
      <div>
        <Button
          handleClick={this.asetaArvoon(this.state.counter + 1)}
          text="Plus"
        />
        <Button
          handleClick={this.asetaArvoon(this.state.counter - 1)}
          text="Minus"
        />
        <Button
          handleClick={this.asetaArvoon(0)}
          text="Zero"
        />
      </div>
    </div>
  )
}
```

Koska meillä on nyt uudelleenkäytettävä nappi, sovellukselle on lisätty uutena toiminnallisuutena nappi, jolla laskurin arvoa voi vähentää.

Tapahtumankäsittelijä välitetään napeille propsin _handleClick_ välityksellä. Propsin nimellä ei ole sinänsä merkitystä, mutta valinta ei ollut täysin sattumanvarainen, esim. Reactin [tutoriaali](https://reactjs.org/tutorial/tutorial.html) suosittelee tätä konventiota.

### Monimutkaisemman tilan päivittäminen

Tarkastellaan sovellusta, jonka tila on hieman monimutkaisempi:

```react
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      vasen: 0,
      oikea: 0
    }
  }

  klikVasen = () => {
    this.setState({
      vasen: this.state.vasen + 1
    })
  }

  klikOikea = () => {
    this.setState({
      oikea: this.state.oikea + 1
    })
  }

  render() {
    return (
      <div>
        <div>
          {this.state.vasen}
          <button onClick={this.klikVasen}>vasen</button>
          <button onClick={this.klikOikea}>oikea</button>
          {this.state.oikea}
        </div>
      </div>
    )
  }
}
```

Tilassa on siis kaksi kenttää, _vasen_ ja _oikea_ jotka laskevat vastaavien nappien painalluksia.

Kun tilaa päivitetään riittää asettaa ainoastaan muuttuvan kentän arvo sillä React [lomittaa](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-are-merged) tai "mergeää" muutokset olemassaolevaan tilaan.

Eli kun päivitämme esim. vasemman napin painalluksia, riittää seuraava koodi

```js
klikVasen = () => {
  this.setState({
    vasen: this.state.vasen + 1
  })
}
```

tilassa oleva kenttä _oikea_ jää muutoksen yhteydessä ennalleen.

### Taulukon käsittelyä

Tehdään sovellukseen vielä laajennus, lisätään tilaan taulukko _kaikki_ joka muistaa kaikki näppäimenpainallukset.

```react
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      vasen: 0,
      oikea: 0,
      kaikki: []
    }
  }

  klikVasen = () => {
    this.setState({
      vasen: this.state.vasen + 1,
      kaikki: this.state.kaikki.concat('v')
    })
  }

  klikOikea = () => {
    this.setState({
      oikea: this.state.oikea + 1,
      kaikki: this.state.kaikki.concat('o')
    })
  }

  render() {
    const kaikki = () => this.state.kaikki.join(' ')
    return (
      <div>
        <div>
          {this.state.vasen}
          <button onClick={this.klikVasen}>vasen</button>
          <button onClick={this.klikOikea}>oikea</button>
          {this.state.oikea}
          <div>{kaikki()}</div>
        </div>
      </div>
    )
  }
}
```

eli kun esim. nappia _vasen_ painetaan, lisätään tilan taulukkoon kirjain _v_:

```js
klikVasen = () => {
  this.setState({
    vasen: this.state.vasen + 1,
    kaikki: this.state.kaikki.concat('v')
  })
}
```

Tilan kenttä _kaikki_ saa nyt arvokseen entisen tilan, mihin on liitetty _v_ metodilla [concat](
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), joka toimii siten, että se ei muuta olemassaolevaa taulukkoa vaan luo _uuden taulukon_, mihin uusi alkio on lisätty.


Javascriptissa on myös mahdollista lisätä taulukkoon metodilla [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) ja sovellus näyttäisi tässä tilanteessa toimivan myös jos lisäys tapahtuisi komennolla

```js
kaikki: this.state.kaikki.push('v')
```

mutta älä tee niin. React komponentin tilaa, eli muuttujaa _this.state_ ei saa muuttaa suoraan!

**Jos tilan kentissä on monimutkaisempia olioita, älä muuta niitä vaan tee muutos aina kopioon!**

Katsotaan vielä tarkemmin, miten kaikkien painallusten historia renderöidään ruudulle:

```react
render() {
  const historia = () => this.state.kaikki.join(' ')
  return (
    <div>
      <div>
        {this.state.vasen}
        <button onClick={this.klikVasen}>vasen</button>
        <button onClick={this.klikOikea}>oikea</button>
        {this.state.oikea}
        <div>{historia()}</div>
      </div>
    </div>
  )
}
```

Metodiin _render_ on nyt määritelty apufunktio:

```react
const historia = () => this.state.kaikki.join(' ')
```

Taulukon [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)-metodilla muodostetaan taulukosta merkkijono, joka sisältää taulukon alkiot erotettuna välilyönnillä.

### Ehdollinen renderöinti

Muutetaan apufunktiota hiukan:

```react
const historia = () => {
  if (this.state.kaikki.length === 0) {
    return (
      <div>
        <em>sovellusta käytetään nappeja painelemalla</em>
      </div>
    )
  }
  return (
    <div>
      näppäilyhistoria: {this.state.kaikki.join(' ')}
    </div>
  )
}
```

Nyt funktion palauttama sisältö riippuu siitä, onko näppäimiä jo painettu. Jos ei, eli taulukko <code>this.state.kaikki</code> on tyhjä, palauttaa metodi "käyttöohjeen" sisältävän elementin

```html
<div>
  <em>sovellusta käytetään nappeja painelemalla</em>
</div>
```

ja muussa tapauksessa näppäilyhistorian:

```html
<div>
  näppäilyhistoria: {this.state.kaikki.join(' ')}
</div>
```

Komponentin _App_ ulkoasun muodostomat React-elementit siis ovat erilaisia riippuen sovelluksen tilasta, eli komponentissa on _ehdollista renderöintiä_.

Reactissa on monia muitakin tapoja [ehdolliseen renderöintiin](https://reactjs.org/docs/conditional-rendering.html). Katsotaan niitä tarkemmin [seuraavassa osassa](/osa2).

Näppäilyhistorian esittäminen alkaa olla jo sen verran monimutkainen operaatio, että se kannattaisi eristää omaksi komponentikseen. Jätämme sen kuitenkin tekemättä.

## Funktionaalinen vai luokkasyntaksiin perustuva komponentti?

Olemme nyt esitelleet kaksi eri tapaa komponenttien määrittelemiseen. Kumpaa tulisi käyttää? Useimpien vastauksena on, [käytä funktionaalista komponenttia aina kun se on mahdollista](https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc)

Jos komponentti tarvitsee tilaa, on luokkasyntaksin käyttäminen välttämätöntä. Kannattaa kuitenkin muistaa, että Reactin filosofian mukaista on sijoittaa tila [mahdollisimman ylös](https://reactjs.org/docs/lifting-state-up.html) komponenttihierarkiaan, mielellään ainoastaan sovelluksen juurikomponenttiin. Näin tilallisten komponenttien potentiaalinen tarvekin on vähäisempi.

Joskus komponenttien on käytettävä osassa 2 esiteltäviä [osa2/#komponenttien-lifecycle-metodit], myös niissä tapauksissa on pakko käyttää luokkiin perustuvia komponentteja.

Yleisohjeena on siis se, että käytä funktionaalisia komponentteja ellet aivan pakosti tarvitse jotain luokkasyntaksin omaavien komponenttien ominaisuuksia.

Internetistä löytyy kyllä aiheesta päinvastaisiakin mielipitetiä, esim. [7 Reasons to Outlaw React’s Functional Components](https://medium.freecodecamp.org/7-reasons-to-outlaw-reacts-functional-components-ff5b5ae09b7c)

## React-sovellusten debuggaus

Ohjelmistokehittäjän elämä koostuu pääosin debuggaamisesta (ja olemassaolevan koodin lukemisesta). Silloin tällöin syntyy toki muutama rivi uuttakin koodia, mutta suuri osa ajasta ihmetellään miksi joku on rikki tai miksi joku asia ylipäätään toimii. Hyvät debuggauskäytänteet ja työkalut ovatkin todella tärkeitä.

Onneksi React on debuggauksen suhteen jopa harvinaisen kehittäjäystävällinen kirjasto.

Muistutetaan vielä tärkeimmästä web-sovelluskehitykseen liittyvästä asiasta:

<div class="important">
  <h3>Web-sovelluskehityksen sääntö numero yksi</h3>
  <div>Pidä selaimen developer-konsoli koko ajan auki.</div>
  <br />
  <div>Välilehdistä tulee olla auki nimenomaan <em>Console</em> jollei ole erityistä syytä käyttää jotain muuta välilehteä.
  </div>
</div>

Pidä myös koodi ja web-sivu **koko ajan** molemmat yhtä aikaa näkyvillä.

Jos ja kun koodi ei käänny, eli selaimessa alkaa näkyä punaista

![]({{ "/assets/1/31.png" | absolute_url }})

älä kirjota enää lisää koodia vaan selvitä ongelma **välittömästi**. Koodauksen historia ei tunne tilannetta, missä kääntymätön koodi alkaisi ihmeen omaisesti toimia kirjoittamalla suurta määrää lisää koodia, en usko että sellaista ihmettä nähdään tälläkään kurssilla.

Vanha kunnon printtaukseen perustuva debuggaus kannattaa aina. Eli jos esim. komponentissa

```react
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

olisi jotain ongelmia, kannattaa komponentista alkaa printtailla konsoliin. Pystyäksemme printtaamaan, tulee funktio muuttaa pitempään muotoon ja kenties propsit vastaanottaa ilman destrukturointia:

```react
const Button = (props) => {
  console.log(props)
  const { handleClick, text } = props
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}
```

näin selviää heti onko esim. joku propsia vastaava attribuutti nimetty väärin komponenttia käytettäessä.

Koodin suorituksen voi pysäyttää chromen developer konsolin debuggeriin kirjoittamalla mihin tahansa kohtaa koodia komennon [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger).

Koodi pysähtyy kun suoritus etenee sellaiseen pisteeseen, että komento _debugger_ suoritetaan:

![]({{ "/assets/1/32.png" | absolute_url }})

Menemällä välilehdelle _Console_ on helppo tutkia muuttujien tilaa:

![]({{ "/assets/1/33.png" | absolute_url }})

Kun bugi selviää, voi komennon _debugger_ poistaa ja uudelleenladata sivun.

Debuggerissa on mahdollista suorittaa koodia tarvittaessa rivi riviltä _Source_ välilehden oikealta laidalta.

Debuggeriin pääsee myös ilman komentoa _debugger_ lisäämällä _Source_-välilehdellä sopiviin kohtiin koodia _breakpointeja_. Haluttujen muuttujien arvojen tarkkailu on mahdollista määrittelemällä ne _Watch_-osassa:

![]({{ "/assets/1/34.png" | absolute_url }})

Chromeen kannattaa asentaa [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) -lisäosa, joka tuo konsoliin uuden tabin _React_:

![]({{ "/assets/1/35.png" | absolute_url }})

Uuden konsolitabin avulla voidaan tarkkailla sovelluksen React-elementtejä ja niiden tilaa (eli this.state:a) ja propseja.

### Hyödyllistä materiaalia

Internetissä on todella paljon Reactiin liittyvää materiaalia, tässä muutamia linkkejä:
- Reactin [docs](https://reactjs.org/docs/hello-world.html) kannattaa ehdottomasti käydä läpi, ei välttämättä kaikkea nyt, osa on ajankohtaista vasta kurssin myöhemmissä osissa
  - Reactin sivuilla oleva [tutoriaali](https://reactjs.org/tutorial/tutorial.html) sen sijaan on aika huono
- [Egghed.io](https://egghead.io):n kursseista [Start learning React](https://egghead.io/courses/start-learning-react) on laadukas ja hieman uudempi [The Beginner's guide to React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) myös kohtuullisen hyvä, molemmat sisältävät myös asiaa jotka tulevat tällä kurssilla vasta myöhemmissä osissa

### React-tehtävät, osa 2

Tee nyt [tehtävät 12-](../tehtavat#lisää-reactia)
