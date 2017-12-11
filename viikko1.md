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

Tällä kurssilla suositellaan Chrome-selaimen käyttöä sillä se tarjoaa parhaan välineistön web-sovelluskehitystä ajatellen.

Erään Chromessa olevan, hieman sovelluskehitystä haittaavan bugin takia kaikkein suositeltavinta on Chromen ns.
[canary-version](https://www.google.fi/chrome/browser/canary.html) käyttäminen. 

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

### selaimessa suoritettava sovelluslogiikka

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

### Document Object Model eli DOM

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

Selainten toiminta perustuu ideaan esittää html-elementit puurakenteena. 

Document Object Model eli [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) on ohjelmointirajapinta eli _API_, jonka mahdollistaa selaimessa esitettävien web-sivujen muokkaamisen ohjelmallisesti.

Edellisessä luvussa esittelemämme javascript-koodi käytti nimenomaan DOM:ia lisätäkseen sivulle  muistiinpanojen listan.

HTML-dokumentin

![]({{ "/assets/1/13b.png" | absolute_url }})

DOM:a havainnollistava kuva Wikipedian sivulta:

![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/DOM-model.svg/428px-DOM-model.svg.png)

### document-olio

HTML-dokumenttia esittävän DOM-puun ylimpänä solmuna on olio nimeltään _document_. Olioon pääsee käsiksi Console-välilehdeltä:

![]({{ "/assets/1/14.png" | absolute_url }})

Voimme suorittaa konsolista käsin DOM:in avulla erilaisia operaatioita selaimessa näytettävälle web-sivulle. 

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

Vaikka selaimen näyttävä sivu päivittyy, ei muutos ole lopullinen. Jos sivu uudelleenladataan, katoaa uusi muistiinpano sillä muutos ei mennyt palvelimelle asti. Selaimen lataama javascript luo muistiinpanojen listan aina palvelimelta osoitteesta <https://fullstack-exampleapp.herokuapp.com/data.json>  haettavan JSON-muotoisen raakadatan perusteella. 



### CSS

Muistiinpanojen sivun HTML-koodin _head_-osio sisältää _link_-tagin, joka määrittelee, että selaimen tulee ladata pavelimelta osoitteesta [main.css](https://fullstack-exampleapp.herokuapp.com/main.css) sivulla käytettävä [css](https://developer.mozilla.org/en-US/docs/Web/CSS)-tyylitiedosto 

Cascading Style Sheets eli CSS on kieli, jonka avulla web-sovellusten ulkoasu määritellään.

Ladattu css-tiedosto näyttää seuraavalta:

```css
.container {
  padding: 10px;
  border: 1px solid
}

.notes {
  color: blue;
}
```

Tiedosto määrittelee kaksi [luokkaselektoria](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors), joiden avulla valitaan tietty sivun alue ja määritellään alueelle sovellettavat tyylisäännöt.

Luokkaselekotori alkaa aina pisteellä ja sisältää luokan nimen. 

Luokat ovat [attribuuteja](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) joita voidaan liittää HTML-elementeille. 

Konsolin _Elements_-välilehti mahdollistaa class-attribuuttien tarkastelun:

![]({{ "/assets/1/16.png" | absolute_url }})

sovelluksen uloimmalle _div_-elementille on siis liitetty luokka _container_. Muistiinpanojen listan sisältävä _ul_-elementin sisällä oleva lista sisältää luokan _notes_.

CSS-säännön avulla on määritelty, että _container_-luokan sisältävä elementti ympäröidään yhden pikselin paksuisella [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border):illa. Elementille asetetaan myös 10 pikselin [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding), jonka ansiosta elementin sisältön ja elementin ulkorajan väliin jätetään hieman tilaa.

Toinen määritelty CSS-sääntö asettaa muistiinpanojen kirjainten värin siniseksi.

HTML-elementeillä on muitekin attribuutteja kuin luokkia. Muistiinpanot sisältävä _div_-elementti sisältää [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)-attribuutin. Javascript-koodi hyödyntää attribuuttia elementin etsimiseen.

Konsolin _Elements_-välilehdellä on mahdollista manipuloida elementtien tyylejä:
![]({{ "/assets/1/17.png" | absolute_url }})

Tehdyt muutokset eivät luonnollisestikaan jää voimaan kun selaimen sivu uudelleenladataan, eli jos muutokset halutaan pysyviksi, tulee ne konsolissa tehtävien kokeilujen jälkeen tallettaa palvelimella olevaan tyylitiedostoon.

### lomake ja HTTP POST

Tutkitaan seuraavaksi sitä, miten uusien muistiinpanojen luominen tapahtuu. Tätä varten muistiinpanojen sivu sisältää lomakkeen eli [formin](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form). 

![]({{ "/assets/1/18.png" | absolute_url }})

Kun lomakkeen painiketta painetaan, lähettää selain lomakkeelle syötetyn datan palvelimele. Avataan _Network_-tabi ja katsotaan miltä lomakkeen lähettäminen näyttää:

![]({{ "/assets/1/19.png" | absolute_url }})

Lomakkeen lähettäminen aiheuttaa yllättäen yhteensä viisi HTTP-pyyntöä. Näistä ensimmäinen vastaa lomakkeen lähetystapahtumaa. Tarkennetaan siihen:

![]({{ "/assets/1/20.png" | absolute_url }})

Kyseessä on siis HTTP POST -pyyntö ja se on tehty palvelimen osoitteeseen _new_note_. Palvelin vastaa pyyntöön HTTP-statuskoodilla 302. Kyseessä on ns. uudelleenohjauspyyntö, minkä avulla palvelin kehoittaa selainta tekemään automaattisesti uuden HTTP GET -pyynnön headerin _Location_ kertomaan paikkaan, eli osoitteeseen _notes_. 

Selain siis lataa uudelleen muistiinpanojen sivun. Sivunlataus saa aikaan myös kolme muuta HTTP-pyyntöä: tyylitiedostojen, javascriptin ja muistiinpanojen raakadatan lataamisen.

Network-välilehti näyttää myös lomakkeen mukana lähetetyn datan:

![]({{ "/assets/1/21.png" | absolute_url }})

Jos käytät normaalia Chrome-selainta, ei konsoli ehkä näytä lähetettävää dataa. Kyseessä on eräissä Chromen versioissa oleva [bugi](https://bugs.chromium.org/p/chromium/issues/detail?id=766715). Bugi on korjattu Chromen [canary-versiossa](https://www.google.fi/chrome/browser/canary.html) ja tulee korjaantumaan aikanaan myös "normaaliin" versioon. 

Lomakkeen lähettäminen tapahtuu HTTP POST -pyyntönä ja osoitteeseen _new_note_ form-tagiin määriteltyjen attribuuttien _action_ ja _method_ ansiosta:

![]({{ "/assets/1/22.png" | absolute_url }})

POST-pyynnöstä huolehtiva palvelimen koodi on yksinkertainen:

```js
app.post('/new_note', (req, res) => {
  notes.push( { 
    content: req.body.note,
    date: new Date()
  })

  return res.redirect('/notes')
})
```

POST-pyyntöihin liitettävä data lähetetään pyynnön mukana "runkona" eli [bodynä](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST). Palvelin saa POST-pyynnön datan pyytämällä sitä pyyntöä vastaavan olion _req_ kentästä _req.body_. 

Tekstikenttään kirjoitettu data on avaimen _notes_ alla, eli palvelin viittaa siihen _req.body.note_.

Palvelin luo uutta muistiinpano vastaavan olion ja laittaa sen muistiinpanot sisältävään taulukkoon:

```js
  notes.push( { 
    content: req.body.note,
    date: new Date()
  })
```  

Muistiinpano-olioilla on siis kaksi kenttää, varsinaisen sisällön kuvaava _content_ ja luomishetken kertova _data_.

Palvelin ei talleta muistiinpanoja tietokantaan, joten uudet muistiinpanot katoavat aina Herokun uudelleenkäynnistäessä palvelun.

## single page app

Esimerkkisovelluksemme pääsivu toimii perinteisten web-sivujen tapaan, kaikki sovelluslogiikka on palvelimella, selain ainoastaan renderöi palvelimen lähettämää HTML-koodia.

Muistiinpanoista huolehtivassa sivussa osa sovelluslogiikasta, eli olemassaolevien muistiinpanojen HTML-koodin generointi on siirretty selaimen vastuulle. Selain hoita tehtävän suorittamalla palvelimelta lataamansa Javascript-koodin. Selaimella suoritettava koodi hakee muistiinpanot palvelimelta JSON-muotoisena raakadatana.

Viime aikoina on noussut esiin tyyli tehdä web-sovelukset käyttäen [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) -tyyliä, missä sovelluksille ei enää tehdä esimerkkisovelluksemme tapaan erillisiä sivuja, palvelimen sille lähettämiä sivuja, vaan sovellus koostuu ainoastaan yhdestä palvelimen lähettämästä HTML-sivusta, jonka sisältöä manipuloidaan selaimessa suoritettavalla Javascriptillä.

Sovelluksemme muistiinpanosivu muistuttaa jo hiukan SPA-tyylistä sovellusta, sitä se ei kuitenkaan vielä ole, sillä vaikka muistiinpanojen renderöintilogiikka on toteutettu selaimessa, käyttää sivu vielä perinteista mekanisimia uusien muistiinpanojen luomiseen. Eli se lähettää uuden muistiinpanon tiedot ja palvelin pyytää _uudelleenohjauksen_ avulla selainta lataamaan muistiinpanojen sivun uudelleen. 

Osoitteesta <https://fullstack-exampleapp.herokuapp.com/spa> löytyy sovelluksen single page app -versio.

Sovellus näyttää ensivilkaisulta täsmälleen samalta kuin edellinen versio. 

HTML-koodi on lähes samanlainen, erona on ladattava javascript-tiedosto ja pieni muutos form-tagin määrittelyssä:

![]({{ "/assets/1/23.png" | absolute_url }})

Avaa nyt 'Network'-tabi ja tyhjennä se  &empty;-symbolilla. Kun luot uuden muistiinpanon, huomaat, että selain lähettää ainoastaan yhden pyynnön palvelimelle:

![]({{ "/assets/1/24.png" | absolute_url }})

Pyyntö on tyypiltään POST ja se sisältää JSON-muodossa olevan uuden muistiinpanon, johon kuuluu sekä sisältö, että aikaleima:

```js
{
  content: "single page app ei tee turhia sivun latauksia", 
  date: "2017-12-11T10:51:29.025Z"
}
```

Pyyntöön liitetty headeri _Content-Type_ kertoo palvelimelle, että pyynnön mukana tuleva data on JSON-muotoista:

![]({{ "/assets/1/25.png" | absolute_url }})

Ilman headeria, palvelin ei osaisi parsia pyynnön mukana tulevaa dataa oiken.

Palvelin vastaa kyselyyn statuskoodilla 201 [created](https://httpstatuses.com/201). Tällä kertaa palvelin ei pyydä uudelleenohjausta kuten aiemmassa versiossamme. Selain pysyy samalla sivulla ja muita HTTP-pyyntöjä ei suoriteta.

Ohjelman spa-versiossa lomakkeen tietoja ei lähetetä selaimen "normaalin" lomakkeiden lähetysmekanismin avulla, lähettämisen hoitaa selaimen lataamassa Javascript-tiedostossa määritelty koodi. Katsotaan hieman koodia vaikka yksityiskohdista ei tarvitse nytkään välittää liikaa.

```js
  var form = document.getElementById("notes_form")
  form.onsubmit = function (e) {
    e.preventDefault()

    var note = {
      content: e.target.elements[0].value,
      date: new Date()
    }

    notes.push(note)
    e.target.elements[0].value = ""
    redrawNotes()
    sendToServer(note)
  }
```

Koodi hakee sivulta lomake-elementin ja rekisteröi sille tapahtumankäsittelijän hoitamaan tilanteen, missä lomake "submitoidaan", eli lähetetään. Tapahtumankäsittelijä 
kutsuu heti metodia <code>e.preventDefault()</code> jolla se estää lomakkeen lähetyksen oletusarvoisen toiminnan. Oletusarvoinen toiminta aiheuttaisi lomakkeen lähettämisen ja sivun uuden lataamisen, sitä emme spa-sovelluksissa halua tapahtuvatn.

Tämän jälkeen se luo muistiinpanon, lisää sen muistiinpanojen listalle komennolla <code>notes.push(note)</code>, piirää ruudun sisällön eli muistiinpanojen listan uudelleen ja lähettää uuden muistiinpanon palvelimelle.

Palvelimelle muistiinpanon lähettävä koodi seuraavassa:
```js
var sendToServer = function (note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open("POST", '/new_note_spa', true)
  xhttpForPost.setRequestHeader("Content-type", "application/json")
  xhttpForPost.send(JSON.stringify(note));
}
```

Koodissa siis määritellään, että kyse on HTTP POST -pyynnöstä, määritellään headerin _Content-type_ avulla lähetettävän datan tyypiksi JSON, ja lähetetään data JSON-merkkijonona.

Sovelluksen koodi on nähtävissä osoitteessa <https://github.com/mluukkai/example_app>. Kannattaa huomata, että sovellus on tarkoitettu ainoastaan kurssin käsitteistöä demonstroivaksi esimerkiksi, koodi on osin tyyliltään huonoa ja siitä ei tulee ottaa mallia omia sovelluksia tehdessä.

## kirjastot 

Kurssin esimerkkisovellus on tehty ns. [vanilla Javascriptillä](https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34) eli käyttäen pelkkää DOM-apia ja Javascript-kieltä sivujen rakenteen manipulointiin. 

Pelkän Javascriptin ja DOM-apin käytön sijaan Web-ohjelmoinnissa hyödynnetään usein kirjastoja, jotka sisältävät DOM-apia helpommin käytettäviä tykaluja sivujen muokkaukseen. Eräs tälläinen kirjasto on edelleenkin hyvin suosittu [JQuery](https://jquery.com/). 

JQuery on kehitetty ainkana, jolloin web-sivut olivat vielä suurimmaksi osaksi perinteisiä, eli palvelin muodosti HTML-sivuja joiden toiminnallisuutta rikastettiin selaimessa JQueryllä kirjoitetun Javascript-koodin avulla. 

Single page app -tyylin noustua suosioon on ilmestynyt useita JQueryä "modernempia" tapoja sovellusten kehittämiseen. Googlen kehittämä [AngularJS](https://angularjs.org/) oli erittäin vielä muutama vuosi sitten erittäin suosittu. Angularin suosio kuitenkin romahti siinä vaiheessa kun Angular-tiimi [ilmoitti](https://jaxenter.com/angular-2-0-announcement-backfires-112127.html) lokakuussa 2014, että version 1 tuki lopetetaan ja Angular 2 ei tule olemaan taaksepäin yhteensopiva ykkösversion kanssa. Angular 2 ja uudemmat versiot eivät ole saaneet kovin innostunutta vastaanottoa. 

Nykyisin suosituin tapa toteuttaa web-sovellusten selainpuolen logiikka on Facebookin kehittämä [ReactJS](https://reactjs.org/)-kirjasto. Tulemme tutustumaan kurssin aikana Reactiin ja sen kanssa yleisesti käytettyyn [Redux](https://github.com/reactjs/redux)-kirjastoon.

Reactin asema näyttää tällä hetkellä vahvalta, mutta Javascript-maailma ei lepää koskaan. Viime aikoina huomioita on alkanut kiinnittää mm. uudempi tulokas [VueJS](https://vuejs.org/). 

## full stack -websovelluskehitys

Mitä tarkoitetaan kurssin nimellä _full stack -websovelluskehitys_? Full stack on hypen omainen termi, kaikki puhuvat siitä, mutta kukaan ei oikein tiedä mitä se tarkoittaa tai ainakaan mitään yhteneväistä määritelmää termille ei ole.

Käytännössä kaikki websovellukset sisältävät (ainakin) kaksi "kerrosta", ylempänä olevan selaimen ja alla olevan palvelimen. Palvelimen alapuolella on usein vielä tietokanta. Näin websovelluksen arkkitehtuuri on "stack", eli pino. Websovelluskehityksen yhteydessä puhutaan usein myös "frontista" ([frontend](https://en.wikipedia.org/wiki/Front_and_back_ends)) ja "backistä" ([backend](https://en.wikipedia.org/wiki/Front_and_back_ends)). 

Selain on fronend ja selaimessa suoritettava javascript on fronend-koodia. Palvelimella taas pyörii backend-koodi.

Tämän kurssin kontekstissa full stack -sovelluskehitys tarkoittaa sitä, että kiinnostus on kaikissa sovelluksen osissa, niin frontendissä kuin backendissäkin. 

Ohjelmoimme myös palvelinpuolta, eli backendia Javascriptilla, käyttäen [node.js](https://nodejs.org/en/)-suoritusympäristöä. Näin full stack -sovelluskehitys saa vielä uuden ulottuvuuden, käytämme samaa kieltä pinon kaikissa osissa. Full stack -sovelluskehitys ei välttämättä edellytä sitä että kaikissa sovelluksen kerroksissa on käytössä sama kieli (javascript). Termi on kuitenkin (todennäköisesti) lanseerattu vasta sen jälkeen kun Node.js mahdollisti Javascriptin käyttämisen kaikkialla.

Aiemmin on ollut yleisempää, että sovelluskehittäjät ovat erikoistuneet tiettyyn sovelluksen osaan, esim. backendiin. Tekniikat backendissa ja frontendissa ovat saattaneet olla hyvin erilaisia. Full stack -trendin myötä on tullut tavanomaiseksi että sovelluskehittäjä hallitsee riittävästi kaikilta sovelluksen tasoilta. Usein full stack -kehittäjän on myös omattava riittävä määrä konfiguraatio- ja ylläpito-osaamista jotta kehittäjä pystyy operoimaan sovellustaan esim. pilvipalveluissa.

## Javascript fatigue

Full stack -sovelluskehitys on monella tapaa haastavaa. Asioita tapahtuu monessa paikassa ja mm. debuggaaminen on oleellisti normaalia työpöytäsovellusta hankalampaa. Javascript ei toimi aina niinkuin sen olettaisi toimivan. Verkon yli tapahtuva kommunikointi edellyttää HTTP-protokollan tuntemusta. On tunnettava myös tietokantoja ja hallittava palvelinten konfigurointia ja ylläpitoa. Hyvä olisi myös hallita riittävästi CSS:ää, jotta sovellukset saataisiin edes siedettävän näköisiksi. 

Oman haasteensa tuo vielä se, että Javascript-maailma etenee koko ajan kovaa vauhtia eteenpäin. Kirjastot, työkalut ja itse kielikin ovat jatkuvan kehityksen alla. Osa alkaa kyllästyä nopeaan kehitykseen ja sitä kuvaamaan on lanseerttu termi [Javascript fatigue](https://auth0.com/blog/how-to-manage-javascript-fatigue/) eli Javascript-väsymys.

Jaavascript-väsymys tulee varmasti iskemään myös tällä kurssilla. Onneksi nykyään on olemassa muutamia tapoja loiventaa oppimiskäyrää, ja voimme aloittaa keskittymällä konfiguraation sijaan koodaamiseen. Konfiguraatioita ei voi välttää, mutta seuraavat pari viikkoa voimme edetä iloisin mielin vailla pahimpia konfiguraatiohelvettejä.

## react

```js
const hello = (name) => {
  console.log(name)
}
hello('World')
```

