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

## alkutoimet

node, git, chrome, ...

## viikon 1 oppimistavoitteet

- ...

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

Pyyntöön ja palvelimen lähettämään vastaukseen liittyy erinäinen määrä otsakkeita eli [headereita](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields).

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
const getFrontPageHtml = (noteCount) => {
  return(`
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
    </html>`)
}

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page)
})
```

Koodia ei tarvitse vielä ymmärtää, mutta käytännössä HTML-sivun sisältö on talletettu ns. template stringinä muuttujaan. Etusivun dynaamisesti muuttuva osa, eli muistiinpanojen lukumäärä korvataan template stringissä sen hetkisellä konkreettisella lukuarvolla.

Perinteisissä websovelluksissa selain on "tyhmä", se ainoastaan pyytää palvelimelta HTML-muodossa olevia sisältöjä, kaikki sovelluslogiikka on palvelimessa. Palvelin voi olla tehty esim. kurssin [Web-palvelinohjelmointi, Java](https://courses.helsinki.fi/fi/tkt21007/119558639) tapaan Springillä, kuten [Tietokantasovelluksessa](http://tsoha.github.io/#/johdanto#top) PHP:llä. Esimerkissä on käytetty Node.js:n [Express](https://expressjs.com/)-sovelluskehystä. Tulemme käyttämään kurssilla Node.js:ää ja Expresiä web-palvelimen toteuttamiseen.

### selaimessa suoritettava sovelluslogiikka

Pidä konsoli edelleen auki. Tyhjennä konsolin näkymä painamalla vasemmalla olevaa &empty;-symbolia.

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

Ladattuaan _script_-tagin sisältämän javascriptin selain suorittaa koodin.

Kaksi viimeistä riviä määrittelevät, että selain tekee GET-tyyppisen HTTP-pyynnön osoitteeseen palvelimen osoitteeseen _/data.json_:

```js
xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Kyseessä on neljäs Network tabin näyttämistä selaimen tekemistä pyynnöistä.

Voimme kokeilla mennä osoitteeseen <https://fullstack-exampleapp.herokuapp.com/data.json> suoraan selaimella:

![]({{ "/assets/1/9.png" | absolute_url }})

Osoitteesta löytyvät muistiinpanot [JSON](https://en.wikipedia.org/wiki/JSON)-muotoisena "raakadatana". Oletusarvoisesti selain ei osaa näyttää JSON-dataa kovin hyvin, mutta on olemassa lukuisia plugineja jotka hoitavat muotoilun. Asenna nyt chromeen esim. [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc)

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

### tapahtumankäsittelijä ja takaisinkutsu

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

Tapahtumankäsittelijöihin liittyvä mekanismi koodin suorittamiseen on javascriptissä erittäin yleistä. Tapahtumankäsittelijöinä olevia javascript-funktioita kutsutaan [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) eli takaisinkutsufunktioiksi sillä sovelluksen koodi ei kutsu niitä itse vaan suoritusympäristö, eli web-selain suorittaa funktion kutsumisen sopivana ajankohtana, eli kyseisen _tapahtuman_ tapahduttua.

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

Edellisessä luvussa esittelemämme javascript-koodi käytti nimenomaan DOM:ia lisätäkseen sivulle muistiinpanojen listan.

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

Vaikka selaimen näyttävä sivu päivittyy, ei muutos ole lopullinen. Jos sivu uudelleenladataan, katoaa uusi muistiinpano sillä muutos ei mennyt palvelimelle asti. Selaimen lataama javascript luo muistiinpanojen listan aina palvelimelta osoitteesta <https://fullstack-exampleapp.herokuapp.com/data.json> haettavan JSON-muotoisen raakadatan perusteella.



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

Luokkaselektori alkaa aina pisteellä ja sisältää luokan nimen.

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
  notes.push({
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
  notes.push({
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

Sovelluksemme muistiinpanosivu muistuttaa jo hiukan SPA-tyylistä sovellusta, sitä se ei kuitenkaan vielä ole, sillä vaikka muistiinpanojen renderöintilogiikka on toteutettu selaimessa, käyttää sivu vielä perinteistä mekanisimia uusien muistiinpanojen luomiseen. Eli se lähettää uuden muistiinpanon tiedot ja palvelin pyytää _uudelleenohjauksen_ avulla selainta lataamaan muistiinpanojen sivun uudelleen.

Osoitteesta <https://fullstack-exampleapp.herokuapp.com/spa> löytyy sovelluksen single page app -versio.

Sovellus näyttää ensivilkaisulta täsmälleen samalta kuin edellinen versio.

HTML-koodi on lähes samanlainen, erona on ladattava javascript-tiedosto ja pieni muutos form-tagin määrittelyssä:

![]({{ "/assets/1/23.png" | absolute_url }})

Avaa nyt 'Network'-tabi ja tyhjennä se &empty;-symbolilla. Kun luot uuden muistiinpanon, huomaat, että selain lähettää ainoastaan yhden pyynnön palvelimelle:

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

Koodi hakee sivulta lomake-elementin ja rekisteröi sille tapahtumankäsittelijän hoitamaan tilanteen, missä lomake "submitoidaan", eli lähetetään. Tapahtumankäsittelijä kutsuu heti metodia <code>e.preventDefault()</code> jolla se estää lomakkeen lähetyksen oletusarvoisen toiminnan. Oletusarvoinen toiminta aiheuttaisi lomakkeen lähettämisen ja sivun uuden lataamisen, sitä emme spa-sovelluksissa halua tapahtuvan.

Tämän jälkeen se luo muistiinpanon, lisää sen muistiinpanojen listalle komennolla <code>notes.push(note)</code>, piirää ruudun sisällön eli muistiinpanojen listan uudelleen ja lähettää uuden muistiinpanon palvelimelle.

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

## kirjastot

Kurssin esimerkkisovellus on tehty ns. [vanilla Javascriptillä](https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34) eli käyttäen pelkkää DOM-apia ja Javascript-kieltä sivujen rakenteen manipulointiin.

Pelkän Javascriptin ja DOM-apin käytön sijaan Web-ohjelmoinnissa hyödynnetään usein kirjastoja, jotka sisältävät DOM-apia helpommin käytettäviä työkaluja sivujen muokkaukseen. Eräs tälläinen kirjasto on edelleenkin hyvin suosittu [JQuery](https://jquery.com/).

JQuery on kehitetty aikana, jolloin web-sivut olivat vielä suurimmaksi osaksi perinteisiä, eli palvelin muodosti HTML-sivuja joiden toiminnallisuutta rikastettiin selaimessa JQueryllä kirjoitetun Javascript-koodin avulla.

Single page app -tyylin noustua suosioon on ilmestynyt useita JQueryä "modernimpia" tapoja sovellusten kehittämiseen. Googlen kehittämä [AngularJS](https://angularjs.org/) oli vielä muutama vuosi sitten erittäin suosittu. Angularin suosio kuitenkin romahti siinä vaiheessa kun Angular-tiimi [ilmoitti](https://jaxenter.com/angular-2-0-announcement-backfires-112127.html) lokakuussa 2014, että version 1 tuki lopetetaan ja Angular 2 ei tule olemaan taaksepäin yhteensopiva ykkösversion kanssa. Angular 2 ja uudemmat versiot eivät ole saaneet kovin innostunutta vastaanottoa.

Nykyisin suosituin tapa toteuttaa web-sovellusten selainpuolen logiikka on Facebookin kehittämä [ReactJS](https://reactjs.org/)-kirjasto. Tulemme tutustumaan kurssin aikana Reactiin ja sen kanssa yleisesti käytettyyn [Redux](https://github.com/reactjs/redux)-kirjastoon.

Reactin asema näyttää tällä hetkellä vahvalta, mutta Javascript-maailma ei lepää koskaan. Viime aikoina huomioita on alkanut kiinnittää mm. uudempi tulokas [VueJS](https://vuejs.org/).

## full stack -websovelluskehitys

Mitä tarkoitetaan kurssin nimellä _full stack -websovelluskehitys_? Full stack on hypen omainen termi, kaikki puhuvat siitä, mutta kukaan ei oikein tiedä mitä se tarkoittaa tai ainakaan mitään yhteneväistä määritelmää termille ei ole.

Käytännössä kaikki websovellukset sisältävät (ainakin) kaksi "kerrosta", ylempänä olevan selaimen ja alla olevan palvelimen. Palvelimen alapuolella on usein vielä tietokanta. Näin websovelluksen arkkitehtuuri on "stack", eli pino. Websovelluskehityksen yhteydessä puhutaan usein myös "frontista" ([frontend](https://en.wikipedia.org/wiki/Front_and_back_ends)) ja "backistä" ([backend](https://en.wikipedia.org/wiki/Front_and_back_ends)).

Selain on frontend ja selaimessa suoritettava javascript on frontend-koodia. Palvelimella taas pyörii backend-koodi.

Tämän kurssin kontekstissa full stack -sovelluskehitys tarkoittaa sitä, että kiinnostus on kaikissa sovelluksen osissa, niin frontendissä kuin backendissäkin.

Ohjelmoimme myös palvelinpuolta, eli backendia Javascriptilla, käyttäen [node.js](https://nodejs.org/en/)-suoritusympäristöä. Näin full stack -sovelluskehitys saa vielä uuden ulottuvuuden, käytämme samaa kieltä pinon kaikissa osissa. Full stack -sovelluskehitys ei välttämättä edellytä sitä että kaikissa sovelluksen kerroksissa on käytössä sama kieli (javascript). Termi on kuitenkin (todennäköisesti) lanseerattu vasta sen jälkeen kun Node.js mahdollisti Javascriptin käyttämisen kaikkialla.

Aiemmin on ollut yleisempää, että sovelluskehittäjät ovat erikoistuneet tiettyyn sovelluksen osaan, esim. backendiin. Tekniikat backendissa ja frontendissa ovat saattaneet olla hyvin erilaisia. Full stack -trendin myötä on tullut tavanomaiseksi että sovelluskehittäjä hallitsee riittävästi kaikilta sovelluksen tasoilta. Usein full stack -kehittäjän on myös omattava riittävä määrä konfiguraatio- ja ylläpito-osaamista jotta kehittäjä pystyy operoimaan sovellustaan esim. pilvipalveluissa.

## Javascript fatigue

Full stack -sovelluskehitys on monella tapaa haastavaa. Asioita tapahtuu monessa paikassa ja mm. debuggaaminen on oleellisesti normaalia työpöytäsovellusta hankalampaa. Javascript ei toimi aina niinkuin sen olettaisi toimivan. Verkon yli tapahtuva kommunikointi edellyttää HTTP-protokollan tuntemusta. On tunnettava myös tietokantoja ja hallittava palvelinten konfigurointia ja ylläpitoa. Hyvä olisi myös hallita riittävästi CSS:ää, jotta sovellukset saataisiin edes siedettävän näköisiksi.

Oman haasteensa tuo vielä se, että Javascript-maailma etenee koko ajan kovaa vauhtia eteenpäin. Kirjastot, työkalut ja itse kielikin ovat jatkuvan kehityksen alla. Osa alkaa kyllästyä nopeaan kehitykseen ja sitä kuvaamaan on lanseerattu termi [Javascript](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) [fatigue](https://auth0.com/blog/how-to-manage-javascript-fatigue/) eli [Javascript](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f)-väsymys.

Javascript-väsymys tulee varmasti iskemään myös tällä kurssilla. Onneksi nykyään on olemassa muutamia tapoja loiventaa oppimiskäyrää, ja voimme aloittaa keskittymällä konfiguraation sijaan koodaamiseen. Konfiguraatioita ei voi välttää, mutta seuraavat pari viikkoa voimme edetä iloisin mielin vailla pahimpia konfiguraatiohelvettejä.

## React

Alamme nyt tutustua kurssin ehkä tärkeimpään teemaan, [React](https://reactjs.org/)-kirjastoon.

Tehdään nyt yksinkertainen React-sovellus ja tutustutaan samalla Reactin peruskäsitteistöön.

Ehdottomasti helpoin tapa päästä alkuun on asentaa [create-react-app](https://github.com/facebookincubator/create-react-app).

Luodaan sovellus nimeltään _viikko1_ ja käynnistetään se:

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

Voit poistaa tiedostot _App.css_, _App.test.js_, _logo.svg_ ja _registerServiceWorkes.js_
Jätä tiedosto _App.js_, tulemme tarvitsemaan sitä myöhemin.

### komponentti

Tiedosto _index.js_ määrittelee nyt React [komponentin](https://reactjs.org/docs/components-and-props.html) nimeltään _App_.

Komento

```react
ReactDOM.render(<App />, document.getElementById('root'))
```

Renderöi komponentin sisällön tiedoston _public/index.html_ määrittelemään _div_-elementtiin, jonka _id:n_ arvona on 'root'

Tiedosto _public/index.html_ on oleellisesti ottaen tyhjä, voit kokeilla lisätä sinne HTML:ää. Reactilla ohjelmoitaessa yleensä kuitenkin kaikki renderöitävä sisältä määritellään reactin komponenttien avulla.

Tarkastellaan vielä tarkemmin komponentin määrittelevää koodia:

```react
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

Kuten arvata saattaa, komponentti renderöityy _div_-tagina, jonka sisällä on _p_-tagin sisällä oleva teksti _Hello world_.

Teknisesti ottaen komponentti on määritelty Javascript-funktiona. Seuraava siis on funktio:

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

Javascriptissa on muutama tapa määritellä funktioita. Käytämme nyt javascriptin hieman uudemman version [EcmaScript 6:n](http://es6-features.org/#Constants) eli ES6:n [nuolifunktiota](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

Koska funktio koostuu vain yhdestä lausekkeesta, on käytössämme lyhennysmerkintä, joka vastaa oikeasti seuraavaa koodia:

```react
const App = () => {
  return(
    <div>
      <p>Hello world</p>
    </div>
  )}
```

eli funktio palauttaa sisältämänsä lausekkeen arvon.

Komponenttifunktio voi sisältää mitä tahansa javascript-koodia. Muuta komponenttisi seuraavaan muotoon ja katso mitä konsolissa tapahtuu:

```react
const App = () => {
  console.log('Hello from komponentti')
  return(
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
  return(
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>{a} plus {b} is {a + b}</p>
    </div>
  )
}
```

Aaltosulkeiden sisällä oleva javascript-koodi evaluoidaan ja evaluoinnin tulos upotetaan määriteltyyn kohtaan komponentin HTML-koodia.

### JSX

Näyttää siltä, että React-komponetti palauttaa HTML-koodia. Näin ei kuitenkaan ole. React-komponenttien ulkoasu kirjoitetaan yleensä [JSX](https://reactjs.org/docs/introducing-jsx.html):ää käyttäen. Vaikka JSX näyttää HTML:ltä, kyseessä on kuitenkin tapa kirjoittaa javascriptiä. React komponenttien palauttaman JSX:n javascriptiksi.

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

Käännöksen hoitaa [Babel](https://babeljs.io/repl/). Create-react-app:illa luoduissa projekteissa käännös tapahtuu konepellin alla. Tulemme tutustumaan aiheeseen tarkemmin myöhemmin kurssilla.

Reactia olisi myös mahdollista kirjoittaa "suoraan javascriptinä" käyttämättä JSX:ää. Kukaan täysijärkinen ei kuitenkaan niin tee.

Käytännössä JSX on melkein kuin HTML:ää sillä erotuksella, että mukaan voi upottaa helposti dynaamista sisältöä kirjoittamalla sopivaa javascriptiä aaltosulkeiden sisälle. Käytännössä JSX on melko lähellä monia palvelimella käytettäviä templating-kieliä kuten Java Springin yhteydessä käytettävää thymeleafia.

## monta komponenttia

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

Olemme määritelleet uuden komponentin _Hello_ jota käytetään komponentista _App_. Komponenttia voidaan luonnollisesti käyttää monta kertaa:

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

Komonenttien tekeminen Reactissa on helppoa ja komponentteja yhdistelemällä monimutkaisempikin sovellus on mahdollista pitää kohtuullisesti ylläpidettävänä. Reactissa filosofiana onkin koostaa sovellus useista, pieneen asiaan keskittyvistä uudelleenkäytettävistä komponenteista.

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

### Muutama huomio

React on konfiguroitu antamaan varsin hyviä virheilmoituksia. Kannattaa kuitenkin edetä ainakin alussa **todella pienin askelin** ja varmistaa, että jokainen muutos toimii halutulla tavalla.

Konsolin tulee olla **koko ajan auki**. Jos selain ilmoittaa virheestä, ei kannata kirjoittaa sokeasti lisää koodia ja toivoa ihmettä tapahtuvaksi vaan tulee yrittää ymmärtää virheen syy ja esim. palata edelliseen toimivaan tilaan:

![]({{ "/assets/1/27.png" | absolute_url }})

Kannattaa myös muistaa, että React-koodissakin on mahdollista ja kannattavaa lisätä koodin sekaan sopivia <code>console.log()</code>-komentoja. Tulemme hieman myöhemmin tutustumaan muutamiin muihinkin tapoihin debugata reactia.

React-komponenttien nimien tulee alkaa isolla kirjaimella. Jos yrität määritellä komponentin seuraavasti

```react
const footer = () => {
  return(
    <div>greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a></div>
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

### react-tehtävät, osa 1

## Javascriptiä

Kurssin aikana on websovelluskehityksen rinnalla tavoite ja tarve oppia riittävässä määrin Javascriptiä.

Javascript on kehittynyt viime vuosina nopeaan tahtiin, ja käytämme kurssilla kielen uusimpien versioiden piirteitä, joista osa ei ole vielä olemassa kielen standardoiduissa versiossa. Javascript-standardin virallinen nimi on [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). Tämän hetken tuorein version on kesäkuussa 2017 julkaistu [ES8](https://www.ecma-international.org/publications/standards/Ecma-262.htm), toiselta nimeltään ECMAScript 2017.

Selaimet eivät vielä osaa kaikkia Javascriptin uusimpien versioiden ominaisuuksia. Tämän takia selaimessa suoritetaan useimmiten koodia joka on käännetty tai englanniksi _transpiled_ uudemmasta javascriptin versiosta johonkin vanhempaan, paremmin tuettuun versioon.

Tällä hetkellä johtava tapa tehdä transpilointi on [Babel](https://babeljs.io/). Create-react-app:in avulla luoduissa React-sovelluksissa on valmiiksi konfiguroitu automaattinen transpilaus. Katsomme myöhemmin kurssilla, tarkemmin miten transpiloinnin konfigurointi tapahtuu.

[NodeJS](https://nodejs.org/en/) on melkein missä vaan, mm. palvelimilla toimiva, Googlen [chrome V8](https://developers.google.com/v8/)-javascriptmoottoriin perustuva javascriptsuoritusympäristö. Harjoitellaan hieman Javascriptiä Nodella. Tässä oletetaan, että koneellasi on NodeJS:stä vähintään versio _v8.6.0_. Noden tuoreet versiot osaavat suoraan javascriptin uusia versioita, joten koodin transpilaus ei ole tarpeen.

Koodi kirjoitetaan <em>.js-</em>päätteiseen tiedostoon, ja suoritetaan komennolla <code>node tiedosto.js</code>

Javascript muistuttaa nimensä ja syntaksinsa puolesta läheisesti Javaa. Perusmekanismeiltaan kielet kuitenkin poikkeavat radikaalisti. Java-taustalta tultaessa Javascriptin käyttäytyminen saattaa aiheuttaa hämmennystä, varsinkin jos kielen piirteistä ei viitsitä ottaa selvää.

Tietyissä piireissä on myös ollut suosittua yrittää "simuloida" Javascriptilla eräitä Javan piirteitä ja ohjelmointitapoja. En suosittele.

### muuttujat

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

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) ei oikeastaan määrittele muuttujaa vaan _vakion_, jonka arvoa ei voi enää muuttaa. [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) taas määrittelee normaalin muuttujan. Javascriptissa on myös mahdollista määritellä  muuttujia avainsanan [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) avulla. Älä käytä tällä kurssilla varia, käytä aina const:ia tai let:iä! 

Esimerkistä näemme myös, että muuttujalla voi vaihtaa tyyppiä suorituksen aikana, _y_ tallettaa aluksi luvun ja lopulta merkkijonon.

### taulukot

[Taulukko](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) ja muutama esimerkki sen käytöstä

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length)  // tulostuu 4
console.log(t[2])      // tuostuu -1

t.forEach((luku) => {
  console.log(luku)    // tulostuu 1, -1, 3 ja 5 omille riveilleen
})

t[6] = 99

console.log(t)         // tulostuu [ 1, -1, 3, 5, <2 empty items>, 99 ]
```

Huomattavaa esimerkissä on se, että taulukon sisältöä voi muuttaa vaikka sen on määritelty _const_ iksi. Koska taulukko on olio, viittaa muuttuja koko ajan samaan olioon. Olion sisältö muuttuu sitä mukaa kun talukkoon lisätään uusia alkioita.

Eräs tapa käydä taulukon alkiot läpi on esimerkissä käytetty _forEach_, joka saa parametrikseen nuolisyntaksilla määritellyn _funktion_

```js
(luku) => {
  console.log(luku)    // tulostuu 1, -1, 3 ja 5 omille riveilleen
}
```

forEach kutsuu funktiota jokaiselle taulukon alkiolle antaen taulukon alkion aina parametrina. forEachin parametrina oleva funktio voi saada myös [muita parametreja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

Taulukoille on määritelty runsaasti hyödyllisiä operaatioita, tutustumme niihin tarkemmin laskareissa. Katsotaan kuiten jo nyt pieni esimerkki operaation [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) käytöstä.

```js
const t = [1, 2, 3, 4]

const m1 = t.map((luku) => luku * 2)
console.log(m1) // tulostuu 2, 4, 6, 8

const m2 = t.map((luku) => '<li>' + luku + '</li>')
console.log(m2) // tulostuu [ '<li>1</li>', '<li>2</li>', '<li>3</li>', '<li>4</li>' ]
```

Map siis muodostaa taulukon perusteella uuden taulukon, jonka jokainen alkio muodostetaan map:in parametrina olevan funktion avulla. Kuten tulemme pian näkemään, mapia käytetään Reactissa todella usein.

### oliot

Javasriptissa on muutama tapa määritellä olioita. Erittäin yleisesti käytetään [olioliteraaleja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), eli määritellään olio luettelemalla sen kentät (englanniksi property) aaltosulkeiden sisällä:

```js
const olio1 = {
  nimi: 'Arto Hellas',
  ika: 35,
  koulutus: 'Filosofian tohtori'
}

const olio2 = {
  nimi: 'Full Stact -websovelluskehitys',
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

Kentät voivat olla mielivaltaista javascriptin tyyppiä. Olioiden kenttiin viitataan pistenotaatiolla.

Olioille voidaan lisätä kenttiä myös lennossa joko pistenotaation tai kulmasulkeiden avulla:

```js
olio1.osoite = 'Tapiola'
olio1['salainen numero'] = 12341
```

Jälkimäinen lisäysksistä on pakko tehdä kulmasulkeiden avulla, sillä pistenotaatiota käytettäessä 'salainen numero' ei kelpaa kentän nimeksi.

Javascriptissä olioilla voi luonnollisesti olla myös metodeja. Palaamme aiheeseen funktioiden käsittelyn jälkeen.

Olioita on myös mahdollista määritellä ns. konstruktorifunktioiden avulla, jolloin saadaan aikaan hieman monien ohjelmointikielten, esim. Javan luokkia (class) muistuttava mekansimi. Javascriptissä ei kuitenkaan ole luokkia samassa mielessä kuin olio-ohjelmointikieleissä. Kieleen on kuitenkin lisätty versiosta ES6 alkaen _luokkasyntaksi_, joka helpottaa tietyissä tilanteissa olio-ohjelmointikielimäisten luokkien esittämistä. Palaamme asiaan hetken kuluttua.

Reactissa konstruktorifunktioihin perustuvalle olioiden määrittelyyn ei ole kovin usein tarvetta, joten sivuutamme sen ainakin toistaiseksi.

### funktiot

Olemme jo tutustuneet ns. nuolifunktioiden määrittelyyn. Täydellinen tapa nuolifunktion määrittelyyn on seuraava

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

### olioiden metodit ja this

Kaikille kolmelle tavalle määritellä funktio on oma paikkansa.

Nuolifunktiot ja avainsanan _function_ avulla määritellyt funktiot kuitenkin poikkeavat radikaalisti siitä miten ne käyttytyvät _this_ avainsanan suhteen.

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

Oliolla on nyt metodi, joka osaa laskea summan. Metodia voidaan kutsua normaaliin tapaan olion kautta <code>arto.laskeSumma(1, 4)</code> tai tallettamalla _metodiviite_ muuttujaan ja kutsumalla metodia muuttujan kautta <code>viiteSummaan(10, 15)</code>.

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

Kutsuttaessa metodia viitteen kautta, on metodi kadottanut tiedon siitä mikä oli alkuperäinen _this_. Toisin kuin melkein kaikissa muissa kielissä [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this):n arvo määrittyy sen mukaan miten oliota on kutsuttu. Kutsuttaessa metodia viitteen kautta, _this_:in arvoksi tulee ns [globaali objekti](https://developer.mozilla.org/en-US/docs/Glossary/Global_object).

Thisin menettäminen aiheuttaa Reactilla ja Nodella ohjelmoidessa monia potentiaalisia ongelmia. Eteen tulee erittäin usein tilanteita, missä Reactin/Noden (oikeammin ilmaistuna selaimen Javascript-moottorin) tulee kutsua joitan käyttäjän olioiden metodeja. Tälläinen tilanne tulee esim. jos pyytetään Artoa tervehtimään sekunnin kuluttua metodia [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) hyväksikäyttäen.

```js
const arto = {
  nimi: 'Arto Hellas',
  tervehdi: function () {
    console.log('hello, my name is', this.nimi)
  },
}

setTimeout(arto.tervehdi, 1000)
```

Javascriptissa this:in arvo siis määräytyy siitä miten metodia on kutsuttu. setTimeoutia käytettäessä metodia kutsuu Javascript-moottori ja this viittaa Timeout-olioon.

On useita mekanismeja, joiden avulla alkuperäinen _this_ voidaan säilyttää, eräs näistä on [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

```js
setTimeout(arto.tervehdi.bind(arto), 1000)
```

Komento <code>arto.tervehdi.bind(arto)</code> luo uuden funktion, missä se on sitonut _this_:in tarkottamaan Artoa riippumatta siitä missä metodia kutsutaan.

[Nuolifunktioiden](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) avulla on mahdollista ratkaista eräitä thisiin liittyviä ongelmia. Olioiden metodeina niitä ei kuitenkaan kannata käyttää, sillä silloin _this_ ei toimi ollenkaan. Palaamme nuolifunktioiden this:in käyttäytymiseen myöhemmin.

Jos haluat ymmärtää paremmin javascriptin _this_:in toimintaa, löytyy internetistä runsaasti materiaalia aiheesta. Esim. [egghead.io](https://egghead.io):n 20 minuutin screencastsarja [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) on erittäin suositeltava!

### luokat

Kuten aiemmin mainittiin, Javascriptissä ei ole olemassa olio-ohjelmointikielten luokkamekanismia. Javascriptissa on kuitenkin ominaisuuksia, jotka mahdollistavat olio-ohjelmoinnin [luokkien](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) "simuloinnin". Emme mene nyt sen tarkemmin Javascriptin olioiden taustalla olevaan _prototyyppiperintämekanismiin_.

Tutustumme kuitenkin pikaisesti ES6:n myötä javascriptiin tulleeseen _luokkasyntaksiin_, joka helpottaa oleellisesti luokkien (tai luokan kaltaisten asioiden) määrittelyä Javascriptissa.

Seuraavassa on määritelyt "luokka" Henkilö ja sille kaksi Henkilö-olioa:

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

ES6:n luokkasyntaksia käytetään kuitenkin paljon Reactissa ja NodeJS:ssä ja siksi mekin käytämme sitä sopivissa määrin. Olio-ohjelmointimainen luokkahierarkioiden luominen ei kuitenkaan ole Reactin eikä tämän kurssin suositeltavan hengen mukaista. Reactia ohjelmoitaessa pyritään enemmän funktionaaliseen ohjelmointityyliin.

### Javascript-materiaalia

Javascriptistä löytyy suuret määrät sekä hyvää että huonoa materiaalia verkosta. Tällä sivulla lähes kaikki linkit ovat [Mozillan javascript -materiaaliin](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Jo ennen seuraavien tehtävien tekemistä Mozillan sivuilta kannattaa lukea välittömästi [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)


Jos haluat tutustua todella syvällisesti Javascriptiin, löytyy internetistä ilmaiseksi mainio kirjasarja [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)

[egghead.io](https://egghead.io):lla on tarjolla runsaasti laadukkaita screencasteja Javascriptista, Reactista ym. kiinnostavasta. Valitettavasti materiaali on osittain maksullista.

### tehtäviä javascriptistä

## paluu Reactin äärelle

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

Muutetaan esimerkkisovelluksen komponentti _Hello_ seuraavasti:

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

Luokkakomponenttien tulee määritellä ainakin metodi _render_ joka palauttaa komponentin ulkoasun. Luokkakomponentissa viitataan komponentin _propseihin_ this-viitteen kautta.
Eli koska komponenttia käytetään seuraavasti

```react
<Hello name='Arto' age={36} />
```

Päästään nimeen ja ikään käsiksi luokkamuotoisen komponentin sisällä viittaamalla _this.props.name_ ja _this.props.age_. Huomaa ero luokkamuotoiseen komponenttiin.


Luokkakomponenteille voidaan tarvittaessa määritellä muitakin metodeja ja "oliomuuttujua", eli kenttiä.

Voisimme esim. määritellä apumuuttujan seuraavasti:

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

Ennen kuin siirrymme eteenpäin, tarkastellaan erästä pientä, mutta käyttökelpoista ES6:n uutta piirrettä javascriptissä, eli sijoittamisen yhteydessä tapahtuvaa [destruktorointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

Jouduimme äskeisessä koodissa viittaamaan propseina välitettyyn dataan hieman ikävästi muodossa _this.props.name_ ja _this.props.age_. Näistä _this.props.age_ pitää toistaa metodissa _render_ kahteen kertaan.

Koska _this.props_ on nyt olio

```js
this.props = {
  name: 'Arto Hellas',
  age: 35
}
```

voisimme suoraviivaistaa metodia _render_ siten, että sijoittaisimme kenttien arvot muuttujiin _name_ ja _age_ joita voisimme sitten hyödyntää

```js
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

Huomaa, että olemme myös hyödyntäneet nuolifunktion kompaktimpaa kirjoitustapaa.

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

Toistaiseksi tekemämme sovellukset ovat olleet sellaisia, että kun niiden komponentit on kerran renderöity, niiden tilaa ei ole enää voinut muuttaa. Entä jos haluaisimme toteuttaa laskurin, jonka arvo kasvaa esim. ajan kuluessa tai nappien painallusten yhteydessä?

Aloitetaan seuraavasta rungosta:

```react
const App = (props) => {
  const {counter} = props
  return(
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
  return(
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

Hieman mielenkiintoisempaan toiminnallisuuteen pääsemme tekemällä renderöinnin ja laskurin kasvatuksen toistuvasti sekunnin välein käyttäen [SetInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)-

```js
setInterval(() => {
  renderoi()
  counter.value += 1;
}, 1000)
```

_ReactDOM.render_-metodin toistuva kutsuminen ei kuitenkaan ole suositeltu tapa päivittää komponentteja. Tutustutaan seuraavaksi järkevämpään tapaan.

### tilallinen komponentti

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

Eli tila sisältää kentän _counter_, jonka arvo on 1. React-komponettien tilaa, eli muuttujaa _this.state_ **ei saa päivittää suoraan**, tilan päivitys on tehtävä aina funktion [setState](https://reactjs.org/docs/faq-state.html#what-does-setstate-do) avulla. Metodin kutsuminen päivittää tilan _ja_ aiheuttaa komponentin uuden renderöinnin. Uudelleenrenderöinnin yhteydessä myös kaikki komponentin sisältämät alikomponentit renderöidään.

Muutetaan komponenttia _App_ siten, että konstruktorissa käynnistetään ajastin joka kutsuu funktiota _setState_ kolmen sekunnin kuluttua ja asettaa laskurin, eli _this.state.counter_:in arvoksi 1000.

```render
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }

    setTimeout(() => {
      this.setState({counter: 1000})
    }, 3000);
  }
  render() {
    return (
      <div>{this.state.counter}</div>
    )
  }
}
```

Tehdään sovelluksesta vielä edistyneempi versio, missä metodia _setState_ kutsutaan toistuvasti sekunnin välein päivittäen laskurin arvoa aina yhdellä.

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

### tapahtumankäsittely

Mainitsimme jo alun johdanto-osassa muutamaan kertaan _tepahtumankäsittelijät_, eli funktiot, jotka on rekisteröity kutsuttavaksi tiettyjen tapahtumien eli eventien yhteydessä. Esim. käyttäjän interaktio sivun elementtien kanssa aiheuttaa joukon erinäisiä tapahtumia.

Muutetaan sovellusta siten, että laskurin kasvaminen tapahtuukin käyttäjän painaessa [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)-elementin avulla toteutettua nappia.

Button-elementit tukevat mm. [hiiritapahtumia](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), joista yleisin on [click](https://developer.mozilla.org/en-US/docs/Web/Events/click).

Reactissa funktion rekisteröiminen tapahtumankäsittelijäksi [tapahtuu](https://reactjs.org/docs/handling-events.html) tapahtumalle _click_ tapahtuu seuraavasti:

```react
const funktio = () => { /* koodi */ }

//...

<button onClick={funktio}>
  plus
</button>
```
Tapahtumankäsittelijäfunktio voidaan myös määritellä suoraan onClick-määrittelyn yhteydessä:

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

```react
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

Sovelluksemme on valmis!

### metodien käyttö ja _this_

Tapahtumankäsittelijöiden määrittely suoraan JSX-templatejen _return_-lauseiden sisällä ei ole yleensä kovin viisasta. Eriytetään nappien tapahtumankäsittelijä omaksi metodeikseen: 

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

![]({{ "/assets/1/29.png" | absolute_url }})

Eli törmäämme Javascriptin luokkien yhteydessä mainitsemaamme ongelmaan alkuperäisen _this_:in kadottamisesta.

Kun javascriptin runtime kutsuu takaisinkutsufunktiota, _this_ ei enää viittaa komponenttiin _App_ vaan on arvoltaan _undefined_ eli määrittelemätön:

![]({{ "/assets/1/6.png" | absolute_url }})

Ongelmaan on useita erilaisia ratkaisuja. Eräs näistä on aiemminkin mainitsemamme _bindaaminen_, eli esim. komennolla <code>this.kasvataYhdella.bind(this)</code> voimme muodostaa uuden funktion, jonka koodi on alkuperäisen funktion koodi missä _this_ on sidottu viittaamaan parametrina olevaan arvoon, eli komponenttiin itseensä. Eli sovellus toimii taas kun koodi muotetaan muotoon:

```react
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

```react
    <button onClick={this.kasvataYhdella}>
      plus
    </button>
    <button onClick={this.nollaa}>
      zero
    </button>  
```

Tenkisesti ottaen konstruktorissa korvataan kenttään _kasvataYhdella_ alunperin määritelty metodi uudella metodilla, jolla on alkuperäisen oodi siten, että _this_ on pysyväti bindattu olioon itseensä.

paras käyttää vielä standardoimatonta [class properties](https://babeljs.io/docs/plugins/transform-class-properties/) -featurea

```react
  kasvataYhdella = () => {
    this.setState({ counter: this.state.counter + 1 })
  }

  nollaa = () => {
    this.setState({ counter: 0 })
  }
```

### huomio funktion setState käytöstä

älä kutsu noin...

### refaktorointi

```react
    asetaArvoon = (arvo) => {
      this.setState({ counter: arvo })
    }

    <button onClick={this.asetaArvoon(this.state.counter + 1)}>
      Plus
    </button>
```react

funktio joka palauttaa funktion...

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
```react

suoraviivastus

```react
  asetaArvoon = (arvo) => () => this.setState({ counter: arvo })
```

### tilan vienti alikomponenttiin

### debuggaus

- konsoli auki AINA
- console.log
- komento debug
- debuggeri
- react dev tool

### hyödyllistä materiaalia

### react-tehtävät, osa 2
