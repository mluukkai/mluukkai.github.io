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

#### 4

Tee kaavio tilanteesta, missä käyttäjä luo uuden muistiinpanon, eli kirjoittaa tekstikenttään jotain ja painaa nappia _tallenna_

Kirjoita tarvittaessa pavelimella tai  selaimessa tapahtuvat operaatiot sopivina kommentteina kaavion sekaan.

#### 5

Tee kaavio tilanteesta, missä käyttäjä menee selaimella osoitteeseen <https://fullstack-exampleapp.herokuapp.com/spa> eli muistiinpanojen [single page app](../osa1/#single-page-app)-versioon

#### 6

Tee kaavio tilanteesta, missä käyttäjä luo uuden muistiinpanin single page -versiossa.

### react alkeet ###

### javascriptin alkeet ###

### lisää reactia ###