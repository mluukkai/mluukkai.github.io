---
layout: page
title: viikko 1
permalink: /viikko1/
---

## yleistä

Kurssilla tutustutaan javascriptilla tapahtuvaan moderniin websovelluskehitykseen. Pääpaino on React-kirjaston avulla toteutettavissa single page -sovelluksissa, ja niitä tukevissa node.js-kirjastolla toteutetuissa REST-rajapinnoissa.

Kurssilla käsitellään myös sovellusten testaamista, konfigurointia ja suoritusympäristöjen hallintaa sekä NoSQL-tietokantoja.

Osallistujilta edellytetään vahvaa ohjelmointiruutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta (esim. opintojakson Tietokantasovellus-suoritusta) sekä valmiutta omatoimiseen tiedonhakuun.

Kurssille osallistuminen ei edellytä käsiteltyjen tekniikoiden tai javascript-kielen hallintaa.

## web-sovelluksen toimintaperiaatteita

Tällä kurssilla suositellaan [Chrome](https://www.google.fi/chrome/browser/desktop/index.html)-selaimen käyttöä sillä se tarjoaa parhaan välineistön web-sovelluskehitystä ajatellen.

Avataan selaimella osoitteessa <https://fullstack-exampleapp.herokuapp.com/> oleva esimerkkisovellus.

<div class="important">
<h3>Web-sovelluskehityksen sääntö numero yksi</h3>  
Pidä selaimen developer-konsoli koko ajan auki
</div>
 
Konsoli avautuu macilla painamalla yhtä aikaa _alt_ _com_ ja _i_. Ennen kun jatkat eteenpäin, selvitä miten saat koneellasi konsolin auki ja muista pitää se auki *aina* kun teet web-sovelluksia.

Konsoli näyttää seuraavalta:
![]({{ "/assets/1/1.png" | absolute_url }})

Varmista, että välilehti _Network_ on avattuna ja aktivoi valinta _Disable cache_ kuten kuvassa on tehty.

### HTTP GET

Selain ja web-palvelin kommunikoivat keskenään [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)-protokollaa käyttäen ja avoinna oleva konsolin Network-tabi kertoo miten selain ja palvelin kommunikoivat.

Kun nyt reloadaat selaimen, kertoo konsoli, että tapahtuu kaksi asiaa: selain hakee web-palvelimelta sivun _fullstack-exampleapp.herokuapp.com/_ sisällön ja lataa kuvan _kuva.png_.

![]({{ "/assets/1/2.png" | absolute_url }})

Klikkaamalla näistä ensimmäistä, paljastuu tarkempaa tietoa siitä mistä on kyse:

![]({{ "/assets/1/3.png" | absolute_url }})

Ylimmästä osasta 'General' selviää, että selain teki [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)-metodilla pyynnön osoitteeseen _https://fullstack-exampleapp.herokuapp.com/_ ja että pyyntö oli onnistunut, sillä pyyntöön saatiin vastaus, jonka [Status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) on 200.

Pyyntöön ja palvelimen lähettämään vastaukseen liitty erinäinen määrä otsakkeita eli [headereita](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields). 

![]({{ "/assets/1/4.png" | absolute_url }})

Ylempänä oleva _response headers_ kertoo mm. vastauksen koon tavuina ja vastaushetken sekä sen. Tärkeä _Content-Type_ headeri kertoo että vastaus on utf-8 muodossa oleva teksti-tiedosto, jonka sisältö on muotoiltu HTML:llä. Näin selain tietää että sen, että kyseessä on normaali [HTML](https://en.wikipedia.org/wiki/HTML)-sivu joka tulee renderöidä käyttäjän selaimeen. 

Välilehti _Preview_ näyttää miltä pyyntöön vastauksena lähetetty data näyttää. Kyseessä on siis normaali HTML-sivu, jonka _body_-osassa määritellään selaimessa näytettävän sivun rakenne: 

![]({{ "/assets/1/5.png" | absolute_url }})

Sivu sisältää _div_-elementin, jonka sisällä on otsikko sekä tieto luotujen muistiinpanojen määrästä, linkki sivulle _muistiinpanot_ ja _img_-tagi.

img-tagin ansiosta selain tekee siis HTTP-pyynnön, jonka avulla se hakee kuvan palvelimelta. Pyynnön tiedot näyttävät seuraavalta:

![]({{ "/assets/1/6.png" | absolute_url }})

eli pyyntö on tehty osoitteeseen _https://fullstack-exampleapp.herokuapp.com/kuva.png_ ja se on tyypiltään HTTP GET. Vastaukseen liittyvät headerit kertovat että vastauksen koko on 89350 tavua ja vastauksen Content-type on _image/png_, eli kyseessä on png-tyyppinen kuva. Tämän tiedon ansiosta selain tietää miten kuva on sijoitettava HTML-sivulle.

### perinteinen web-sovellus

Esimerkkisovelluksen pääsivu toimii perinteisen web-sovelluksen tapaan. Mentäessä sivulle, selain hakee palvelimelta sivun muotoilun ja tekstuaalisen sisällön määrittelevän HTML-dokumentin. 

Palvelin on muodostanut dokumentin jollain tavalla. Dokumentti voi olla _staattista sisältöä_ eli palvelimen hakemistossa oleva tekstitiedosto. Dokumentti voi myös olla _dynaaminen_, eli palvelin voi muodostaa HTML-dokumentit esim. tietokannassa olevien tietojen perusteella. Esimerkkisovelluksessa sivun HTML-koodi on muodostettu dynaamisesti sillä se sisältää tiedon luotujen muistiinpanojen lukumäärästä.

Etusivun muodostama koodi näyttää seuraavalta:

```js
const getFronPageHtml = (noteCount) => {
  return(`
  <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack -esimerkkisovellus</h1>
          <p>muistiinpanoja luotu ${noteCount} kappaletta</p>
          <a href='/notes'>muistiinpanot</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>`)
} 

app.get('/', (req, res) => {
  const page = getFronPageHtml(notes.length)
  res.send(page)
})
```

Koodia ei tarvitse vielä ymmärtää, mutta käytännössä HTML-sivun sisältö on talletettu ns. template stringinä muuttujaan. Etusivun dynaamisesti muuttuva osa, eli muistiinpanojen lukumäärä korvataan template stringissä sen hetkisellä konkreettisella lukuarvolla.

Perinteisissä websovelluksissa selain on "tyhmä", se ainoastaan pyytää palvelimelta  HTML-muodossa olevia sisältöjä, kaikki sovelluslogiikka on palvelimessa. Palvelin voi olla tehty esim. kurssin [Web-palvelinohjelmointi, Java](https://courses.helsinki.fi/fi/tkt21007/119558639) tapaan Springillä, kuten [Tietokantasovelluksessa](http://tsoha.github.io/#/johdanto#top) PHP:llä. Esimerkissä on käytetty Node.js:n [Express](https://expressjs.com/)-sovelluskehystä. Tulemme käyttämään kurssilla Node.js:ää ja Expresiä web-palvelien toteuttamiseen. 

### selainpuolen logiikka

Pidä konsoli edelleen auki. Tyhjennä konsoloin näkymä painamalla vasemmalla olevaa &empty;-symbolia. 

Kun menet nyt muistiinpanojen sivulle, selain tekee 4 HTTP-pyyntöä:

![]({{ "/assets/1/7.png" | absolute_url }})

Kaikki pyynnöt ovat _eri tyyppisiä_. Ensimmäinen pyyntö on tyypiltään _document_
kyseessä on sivun HTML-koodi, joka näyttää seuraavalta:

![]({{ "/assets/1/8.png" | absolute_url }})

Kun vertaamme, selaimen näyttämää sivua ja pyynnön palauttamaa HTML-koodia, huomaamme, että koodi ei sisällä ollenkaan kolme muistiinpanoa sisältävää listaa.

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

    data.forEach(function(note){
      var li = document.createElement('li')
      
      ul.appendChild(li);
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementById("notes").appendChild(ul)
  }
}

xhttp.open("GET", "/data.json", true)
xhttp.send()
```

Koodin yksityiskohdat eivät ole tässä vaiheessa vielä oleellisia. 

Ladattuaan _script_-tagin sisältämän javascriptin selain suorittaa koodin. 

Kaksi viimeistä riviä määrittelevät, että selain tekee GET-tyyppisen HTTP-pyynnön osoitteeseen palvelimen osoitteeseen _/data.json_:

```js
xhttp.open("GET", "/data.json", true)
xhttp.send()
```

Kyseessä on neljäs Network tabin näyttämistä selaimen tekemistä pyynnöistä.

Voimme kokeilla mennä osoitteeseen <https://fullstack-exampleapp.herokuapp.com/data.json> suoraan selaimella:

![]({{ "/assets/1/9.png" | absolute_url }})

Osoitteesta löytyvät muistiinpanot [JSON][https://en.wikipedia.org/wiki/JSON]-muotoisena "raakadatana". Oletusarvoisesti selain ei osaa näyttää JSON-dataa kovin hyvin, mutta on olemassa lukuisia plugineja jotka hoitavat muotoilun. Asenna nyt chromeen esim. [JSONView]
(https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc)
ja lataa sivu uudelleen. Data on nyt miellyttävämmin muotoiltua:

![]({{ "/assets/1/10.png" | absolute_url }})

Ylläoleva javascript-koodi siis lataa muistiinpanot sisältävän JSON-muotoisen datan ja 
muodostaa datan avulla selaimeen "bulletlistan" muistiinpanojen sisällöstä:

Tämän saa aikaan seuraava koodi:

```js
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note){
      var li = document.createElement('li')
      
      ul.appendChild(li);
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementById("notes").appendChild(ul)
```

Koodi muodostaa ensin järjestämätöntä listaa edustavan [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)-tagin:

```js
    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')
```

ja lisää ul:n sisään yhden [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)-elementin kutakin muistiinpanoa kohti. Ainoastaan muistiinpanon _content_-kenttä tulee li-elementin sisällöksi, raakadatassa olevia aikaleimoja ei käytetä mihinkään.


```js
    data.forEach(function(note){
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

### tapahtumankäsittelijä ja takaisinkutsu

Koodin rakenne on hieman erikoinen:

```js
var xhttp = new XMLHttpRequest()
  
xhttp.onreadystatechange = function () {
  // koodi, joka käsittelee palvelimen vastauksen
}

xhttp.open("GET", "/data.json", true)
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

Tapahtumankäsittelijöihin liittyvä mekanismi koodin suorittamiseen on javascriptissä erittäin yleistä. Tapahtumankäsittelijöinä olevia javascript-funktioita kutsutaan [call back](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) eli takaisinkutsufunktioiksi sillä sovelluksen koodi ei kutsu niitä itse vaan suoritusympäristö, eli web-selain suorittaa funktion kutsumisen sopivana ajankohtana, eli kyseisen _tapahtuman_ tapahduttua. 

### DOM

[DOM](https://en.wikipedia.org/wiki/Document_Object_Model)

### CSS

HTML-koodin _head_ osio sisältää link-tagin, joka määrittelee sivulla käytettävän

### HTTP POST

## react




```js
const hello = (name) => {
  console.log(name)
}
hello('World')
```

