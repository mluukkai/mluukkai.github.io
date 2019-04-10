---
mainImage: ../../images/part-1.svg
part: 1
letter: b
---

<div class="content">

<!-- Kurssin aikana on websovelluskehityksen rinnalla tavoite ja tarve oppia riittävässä määrin Javascriptiä. -->

During the course along with web development we have a goal and need to learn a sufficient amount of Javascript.

<!-- Javascript on kehittynyt viime vuosina nopeaan tahtiin, ja käytämme kurssilla kielen uusimpien versioiden piirteitä. Javascript-standardin virallinen nimi on [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). Tämän hetken tuorein versio on kesäkuussa 2017 julkaistu [ES9](https://www.ecma-international.org/ecma-262/9.0/index.html), toiselta nimeltään ECMAScript 2018. -->

Javascript has advanced rapidly the last few year and in this course we are using features from the newer versions. The official name of the Javascript standard is [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). At this moment the latest version is the one released in June of 2017 with the name [ES9](https://www.ecma-international.org/ecma-262/9.0/index.html), otherwise known as ECMAScript 2018.

<!-- Selaimet eivät vielä osaa kaikkia Javascriptin uusimpien versioiden ominaisuuksia. Tämän takia selaimessa suoritetaan useimmiten koodia joka on käännetty (englanniksi <i>transpiled</i>) uudemmasta Javascriptin versiosta johonkin vanhempaan, laajemmin tuettuun versioon. -->

Browsers do not yet support all of Javascript's newest features. Due to this fact a lot of code run in browsers has been <i>transpiled</i> from a newer version of Javascript to an older, more compatible version.

<!-- Tällä hetkellä johtava tapa tehdä transpilointi on [Babel](https://babeljs.io/). Create-react-app:in avulla luoduissa React-sovelluksissa on valmiiksi konfiguroitu automaattinen transpilaus. Katsomme kurssin [osassa 7](/osa7) tarkemmin miten transpiloinnin konfigurointi tapahtuu. -->

Today's leading way to do the transpiling is using [Babel](https://babeljs.io/). Transpilation is automatically configured in React applications created with create-react-app. We will take a closer look at the configuration of the transpilation in [part 7](/part7) of this course.

<!-- [Node.js](https://nodejs.org/en/) on melkein missä vaan, mm. palvelimilla toimiva, Googlen [chrome V8](https://developers.google.com/v8/)-javascriptmoottoriin perustuva Javascript-suoritusympäristö. Harjoitellaan hieman Javascriptiä Nodella. Tässä oletetaan, että koneellasi on Node.js:stä vähintään versio <i>v8.10.0</i>. Noden tuoreet versiot osaavat suoraan Javascriptin uusia versioita, joten koodin transpilaus ei ole tarpeen. -->

[Node.js](https://nodejs.org/en/) is a Javascript runtime environment based on Google's [chrome V8](https://developers.google.com/v8/) Javascript engine and works practically anywhere from servers to mobile phones. Let's practice writing some Javascript using Node. It is expected that the version of Node.js installed on your machine is at least version <i>v8.10.0</i>. The latest verisons of Node already understand the latest versions of Javascript, so the code does not need to be transpiled.

<!-- Koodi kirjoitetaan <i>.js</i>-päätteiseen tiedostoon, ja suoritetaan komennolla <em>node tiedosto.js</em> -->

The code is written into files ending with <i>.js</i> and are run by issuing the command <em>node name_of_file.js</em>

<!-- Koodia on mahdollisuus kirjoittaa myös Node.js-konsoliin, joka aukeaa kun kirjoitat komentorivillä _node_ tai myös selaimen developer toolin konsoliin. Chromen uusimmat versiot osaavat suoraan transpiloimatta [melko hyvin](http://kangax.github.io/compat-table/es2016plus/) Javascriptin uusiakin piirteitä. -->

It is also possible to write Javascript code into the Node.js console, which is opened by typing _node_ in the command-line, as well as into the browser's developer tool console. The newest revisions of Chrome handle the newer features of Javascript [pretty well](http://kangax.github.io/compat-table/es2016plus/) without transpiling the code.

<!-- Javascript muistuttaa nimensä ja syntaksinsa puolesta läheisesti Javaa. Perusmekanismeiltaan kielet kuitenkin poikkeavat radikaalisti. Java-taustalta tultaessa Javascriptin käyttäytyminen saattaa aiheuttaa hämmennystä, varsinkin jos kielen piirteistä ei viitsitä ottaa selvää. -->

Javascript is sort of reminiscent both in name and syntax to Java. But when it comes to core mechanism  of the language they could not be more different. Coming from a Java background the behavior of Javascript can seem a bit alien, especially if one cannot bother to look up the features of the language.

<!-- Tietyissä piireissä on myös ollut suosittua yrittää "simuloida" Javascriptilla eräitä Javan piirteitä ja ohjelmointitapoja. En suosittele. -->

In certain circles it has also been popular to attempt "simulating" Java features and design patterns in Javascript. I do not recommend doing this.

<!-- ### Muuttujat -->

### Variables

<!-- Javascriptissä on muutama tapa määritellä muuttujia: -->

In Javascript there are a few way to go about defining variables:

```js
const x = 1
let y = 5

console.log(x, y)   // tulostuu 1, 5
y += 10
console.log(x, y)   // tulostuu 1, 15
y = 'teksti'
console.log(x, y)   // tulostuu 1, teksti
x = 4               // aiheuttaa virheen
```

<!-- [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) ei oikeastaan määrittele muuttujaa vaan <i>vakion</i>, jonka arvoa ei voi enää muuttaa. [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) taas määrittelee normaalin muuttujan. -->

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) does not actually define a variable but a <i>constant</i> for which the value can no longer be changed. On the other hand [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) defines a normal variable.

<!-- Esimerkistä näemme myös, että muuttujan tallettaman tiedon tyyppi voi vaihtaa tyyppiä suorituksen aikana, _y_ tallettaa aluksi luvun ja lopulta merkkijonon. -->

In the example we also see that the type of the data assigned to the variable can change during execution. At the start _y_ stores an integer and at the end a string.

<!-- Javascriptissa on myös mahdollista määritellä muuttujia avainsanan [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) avulla. Var oli pitkään ainoa tapa muuttujien määrittelyyn, const ja let tulivat kieleen mukaan vasta versiossa ES6. Var toimii tietyissä tilanteissa [eri](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) [tavalla](http://www.jstips.co/en/javascript/keyword-var-vs-let/) kuin useimpien muiden kielien muuttujien määrittely. Tällä kurssilla varin käyttö ei ole suositeltavaa eli käytä aina const:ia tai let:iä! -->

It is also possible to define variables in Javascript using the keyword [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). Var was for a long time the only way to define variables. Const and let were only recently added in version ES6. In specific situations var work in a [different](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) [way](http://www.jstips.co/en/javascript/keyword-var-vs-let/) compared to variable definitions in most languages. During this course the use of var is ill advised and you should stick with using const or let!

<!-- Lisää aiheesta esim. youtubessa [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8) -->

You can find more on this topic on e.g. YouTube - [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)

<!-- ### Taulukot -->

### Arrays

<!-- [Taulukko](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) ja muutama esimerkki sen käytöstä -->

An [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and a couple of examples of its use

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // tulostuu 4
console.log(t[1])     // tulostuu -1

t.forEach(value => {
  console.log(value)  // tulostuu 1, -1, 3, 5 omille riveilleen
})                    
```

<!-- Huomattavaa esimerkissä on se, että taulukon sisältöä voi muuttaa vaikka sen on määritelty _const_:ksi. Koska taulukko on olio, viittaa muuttuja koko ajan samaan olioon. Olion sisältö muuttuu sitä mukaa kuin taulukkoon lisätään uusia alkioita. -->

Notable in this example is the fact that the contents of the array can be modified even though it is defined as a _const_. Because the array is an object the variable always points to the same object. The content of the array changes as new items are added to it.

<!-- Eräs tapa käydä taulukon alkiot läpi on esimerkissä käytetty _forEach_, joka saa parametrikseen nuolisyntaksilla määritellyn <i>funktion</i> -->

One way of iterating through the items of the array is using _forEach_ as seen in the example. _forEach_ receives a <i>function</i> defined using the arrow syntax as a parameter.

```js
value => {
  console.log(value)
}
```

<!-- forEach kutsuu funktiota <i>jokaiselle taulukon alkiolle</i> antaen taulukon yksittäisen alkion aina parametrina. forEachin parametrina oleva funktio voi saada myös [muita parametreja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). -->

forEach calls the function <i>for each of the items in the array</i> always passing the individual item as a parameter. The function as the parameter of forEach may also receive [other parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

<!-- Edellisessä esimerkissä taulukkoon lisättiin uusi alkio metodilla [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Reactin yhteydessä sovelletaan usein funktionaalisen ohjelmoinnin tekniikoita, jonka eräs piirre on käyttää <i>muuttumattomia</i> (engl. [immutable](https://en.wikipedia.org/wiki/Immutable_object)) tietorakenteita. React-koodissa kannattaakin mielummin käyttää metodia [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), joka ei lisää alkiota taulukkoon vaan luo uuden taulukon, jossa on lisättävä alkio sekä vanhan taulukon sisältö: -->

In the previous example a new item was added to the array using the method [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of [immutable](https://en.wikipedia.org/wiki/Immutable_object) data structures. In React code it is preferable to use the method [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), which does not add the item to the array, but creates a new array in which the content of the old array as well as the new item is included.

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // tulostuu [1, -1, 3]
console.log(t2) // tulostuu [1, -1, 3, 5]
```

<!-- Metodikutsu _t.concat(5)_ ei siis lisää uutta alkiota vanhaan taulukkoon, vaan palauttaa uuden taulukon, joka sisältää vanhan taulukon alkioiden lisäksi uuden alkion. -->

The method call _t.concat(5)_ does not add a new item to the old array, but returns a new array, which besides containing the items of the old array also contains the new item.

<!-- Taulukoille on määritelty runsaasti hyödyllisiä operaatioita. Katsotaan pieni esimerkki metodin [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) käytöstä. -->

There are plenty of useful methods defined for arrays. Let's look at a short example of using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method.

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // tulostuu [2, 4, 6]
```

<!-- Map muodostaa taulukon perusteella <i>uuden taulukon</i>, jonka jokainen alkio luodaan map:in parametrina olevan funktion avulla, esimerkin tapauksessa kertomalla alkuperäinen luku kahdella. -->

Based on the old array, map creates a <i>new array</i>, for which the function given as a parameter is used to create the items, in the case of this example the original value is multiplied by two.

<!-- Map voi muuttaa taulukon myös täysin erilaiseen muotoon: -->

Map can also transform the array into something completely different:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// tulostuu [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]
```

<!-- Eli lukuja sisältävästä taulukosta tehdään map-metodin avulla HTML-koodia sisältävä taulukko. Tulemmekin kurssin [osassa2](/osa2) näkemään että mapia käytetään Reactissa todella usein. -->

Here an array filled with integer values is transformed into an array containing HTML using the map method. In [part2](/part2) of this course we will see that map is used quite frequently in React.

<!-- Taulukon yksittäisiä alkioita on helppo sijoittaa muuttujiin [destrukturoivan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) sijoituslauseen avulla: -->

Individual items of an array are easy to assign to variables with the help of [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // tulostuu 1, 2
console.log(rest)           // tulostuu [3, 4 ,5]
```

<!-- Eli muuttujiin _first_ ja _second_ tulee sijoituksen ansiosta taulukon kaksi ensimmäistä lukua. Muuttujaan _rest_ "kerätään" sijoituksesta jäljellejääneet luvut omaksi taulukoksi. -->

Thanks to the assignment the variables _first_ and _second_ will receive the first two integers of the array as their values. The remaining integers are "collected" into an array of their own, which is then assigned to the variable _rest_.

<!-- ### Oliot -->
### Objects

<!-- Javascriptissä on muutama tapa määritellä olioita. Erittäin yleisesti käytetään [olioliteraaleja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), eli määritellään olio luettelemalla sen kentät (englanniksi property) aaltosulkeiden sisällä: -->

There are a few different ways of defining objects in Javascript. A very commonly used method is using [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), which happens by listing its properties within braces:

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
}

const object12 = {
  name: 'Full Stack -websovelluskehitys',
  level: 'aineopinto',
  size: 5,
}

const object3 = {
  name: {
    first: 'Juha',
    last: 'Tauriainen',
  },
  grades: [2, 3, 5, 3],
  department: 'TKTL',
}
```

<!-- Kenttien arvot voivat olla tyypiltään mitä vaan, lukuja, merkkijonoja, taulukoita, olioita... -->

The values of the properties can be of any type, like integers, strings, arrays, objects...

<!-- Olioiden kenttiin viitataan pistenotaatiolla, tai hakasulkeilla: -->

The properties of an object are referenced by using dot notation, or using brackets:

```js
console.log(object1.name)         // tulostuu Arto Hellas
const fieldName = 'age' 
console.log(object1[fieldName])   // tulostuu 35
```

<!-- Olioille voidaan lisätä kenttiä myös lennossa joko pistenotaation tai hakasulkeiden avulla: -->

You can also add properties to an object on the fly by either using dot notation or using brackets:

```js
object1.address = 'Tapiola'
object1['secred number'] = 12341
```

<!-- Jälkimmäinen lisäyksistä on pakko tehdä hakasulkeiden avulla, sillä pistenotaatiota käytettäessä <i>secred number</i> ei kelpaa kentän nimeksi. -->

The latter of the additions has to be done by using brackets, because when using dot notation <i>secred number</i> is not a valid property name.

<!-- Javascriptissä olioilla voi luonnollisesti olla myös metodeja. Emme kuitenkaan tarvitse tällä kurssilla ollenkaan itse määriteltyjä metodillisia olioita, joten asiaa ei tällä kurssilla käsitellä kuin lyhyesti. -->

Naturally, objects in Javascript can also have methods. However, during this course we will not be defining any objects with methods of our own. This is why it only discussed briefly.

<!-- Olioita on myös mahdollista määritellä ns. konstruktorifunktioiden avulla, jolloin saadaan aikaan hieman monien ohjelmointikielten, esim. Javan luokkia (class) muistuttava mekanismi. Javascriptissä ei kuitenkaan ole luokkia samassa mielessä kuin olio-ohjelmointikielissä. Kieleen on kuitenkin lisätty versiosta ES6 alkaen <i>luokkasyntaksi</i>, joka helpottaa tietyissä tilanteissa olio-ohjelmointikielimäisten luokkien esittämistä. -->

Objects can also be defined using so-called constructor functions, which results in a mechanism reminiscent of many other programming languages', e.g. Java's classes. Despite this similarity Javascript does not have classes in the same sense as object oriented programming languages. There has been, however, an addition of the <i>class syntax</i> starting from version ES6, which in some cases helps structure object oriented classes.

<!-- ### Funktiot -->

### Functions

<!-- Olemme jo tutustuneet ns. nuolifunktioiden määrittelyyn. Täydellinen eli "pitkän kaavan" mukaan menevä tapa nuolifunktion määrittelyyn on seuraava -->

We have already become familiar with defining so-called arrow functions. The complete process, without cutting corners, to defining an arrow function is as follows 

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

<!-- ja funktiota kutsutaan kuten olettaa saattaa -->

and the function is called as can be expected

```js
const result = sum(1, 5)
console.log(result)
```

<!-- Jos parameteja on vain yksi, voidaan sulut jättää määrittelystä pois: -->

If there is just a single parameter we can exclude the parentheses from the definition:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

<!-- Jos funktio sisältää ainoastaan yhden lausekkeen, ei aaltosulkeita tarvita. Tällöin funktio palauttaa ainoan lausekkeensa arvon. Eli jos poistetaan konsoliin tulostus, voidaan edellinen funktio ilmaista lyhyemmin seuraavasti: -->

If the function only contains a single expression, then the braces are not needed. In this case the function only returns the result its only expression. Now if we remove the printing to the console, we can further shorten the function definition:

```js
const square = p => p * p
```

<!-- Tämä muoto on erityisen kätevä käsiteltäessä taulukkoja esim. map-metodin avulla: -->

This form is particularly handy when manipulating arrays, e.g using the map method:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared on nyt [1, 4, 9]
```

<!-- Nuolifunktio on tullut Javascriptiin vasta muutama vuosi sitten version [ES6](http://es6-features.org/) myötä. Tätä ennen ainoa tapa funktioiden määrittelyyn oli avainsanan _function_ käyttö. -->

The arrow function was added to Javascript only a couple of years ago along with version [ES6](http://es6-features.org/). Prior to this the only way to define functions was by using the keyword _function_.

<!-- Määrittelytapoja on kaksi, funktiolle voidaan antaa [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) -tyyppisessä määrittelyssä <i>nimi</i>, jonka avulla funktioon voidaan viitata: -->

There are two ways, of which one is giving a name in a so-called [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) to the function, by which the function can be referenced.

```js
function product(a, b) {
  return a * b
}

const vastaus = product(2, 6)
```

<!-- Toinen tapa on tehdä määrittely [funktiolausekkeena](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). Tällöin funktiolle ei tarvitse antaa nimeä ja määrittely voi sijaita muun koodin seassa: -->

The other way to do the define the function is as a [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). In this case there is no need to give the function a name, and the definition may reside among the rest of the code:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const vastaus = average(2, 5)
```

<!-- Määrittelemme tällä kurssilla kaikki funktiot nuolisyntaksin avulla. -->

During this course we will define all functions using the arrow syntax.

</div>

<div class="tasks">
  <h3>Exercises</h3>

<!-- <i>Jatkamme edellisissä tehtävissä aloitetun ohjelman rakentamista, voit siis tehdä koodin samaan projektiin, palautuksessa ollaan kiinnostuneita ainoastaan ohjelman lopullisesta versiosta.</i> -->

<i>We continue building the application that we started working on in the previous exercises. You can write the code into the same project, since in the submissions we are only interested in the final state of the application.</i>

<!-- **Protip:** voit kohdata ohjelmoidessasi ongelmia sen suhteen missä muodossa komponentin saamat <i>propsit</i> ovat. Hyvä keino varmistua asiasta on tulostaa propsit konsoliin, esim. seuraavasti: -->

**Pro-tip:** you may run into issues when it comes to the structure of the <i>props</i> that components receive. A good way to make thing more clear is by printing the props to the console, e.g. as follows:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

  <h4>1.3: course information step3</h4>

<!-- Siirrytään käyttämään sovelluksessamme oliota. Muuta komponentin <i>App</i> muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikkia osia niin, että se taas toimii: -->

Let's transition to using objects in our application. Modify the variable definitions of the <i>App</i> component as follows and also refactor the application so that it still works:

```js
const App = () => {
  const course = 'Half Stack -sovelluskehitys'
  const part1 = {
    name: 'Reactin perusteet',
    exercises: 10
  }
  const part2 = {
    name: 'Tiedonvälitys propseilla',
    exercises: 7
  }
  const part3 = {
    name: 'Komponenttien tila',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4: course information step4</h4>

<!-- Ja laitetaan oliot taulukkoon, eli muuta  <i>App</i> :in muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikki osat vastaavasti: -->

And then put the objects into an array. Modify the variable definitions of <i>App</i> into the following form and modify the other parts of the application accordingly:

```js
const App = () => {
  const course = 'Half Stack -sovelluskehitys'
  const parts = [
    {
      name: 'Reactin perusteet',
      exercises: 10
    },
    {
      name: 'Tiedonvälitys propseilla',
      exercises: 7
    },
    {
      name: 'Komponenttien tila',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

<!-- **HUOM:** tässä vaiheessa <i>voit olettaa, että taulukossa on aina kolme alkiota</i>, eli taulukkoa ei ole pakko käydä läpi looppaamalla. Palataan taulukossa olevien olioiden perusteella tapahtuvaan komponenttien renderöintiin asiaan tarkemmin kurssin [seuraavassa osassa](../osa2). -->

**NB** at this point <i>you can assume that there are always three items</i>, so there is no need to go through the arrays using loops. We will come back to the topic of rendering components based on items in arrays with a more thorough exploration in the [next part of the course](../part2).

<!-- Älä kuitenkaan välitä eri olioita komponentista <i>App</i> sen sisältämiin komponentteihin <i>Content</i> ja <i>Total</i> erillisinä propseina, vaan suoraan taulukkona: -->

However, do not pass different objects as separate props from the <i>App</i> component to the components <i>Content</i> and <i>Total</i>, but instead directly as an array:

```js
const App = () => {
  // const-määrittelyt

  return (
    <div>
      <Header course={...} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: course information step5</h4>

<!-- Viedään muutos vielä yhtä askelta pidemmälle, eli tehdään kurssista ja sen osista yksi Javascript-olio. Korjaa kaikki mikä menee rikki. -->

Let's take the changes one step further. Make the course and its parts into a single Javascript object. Fix everything that brakes.

```js
const App = () => {
  const course = {
    name: 'Half Stack -sovelluskehitys',
    parts: [
      {
        name: 'Reactin perusteet',
        exercises: 10
      },
      {
        name: 'Tiedonvälitys propseilla',
        exercises: 7
      },
      {
        name: 'Komponenttien tila',
        exercises: 14
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

</div>

<div class="content">

<!-- ### Olioiden metodit ja this -->

### Object methods and this

<!-- Koska käytämme tällä kurssilla Reactin hookit sisältävää versiota, meidän ei kurssin aikana tarvitse määritellä ollenkaan olioita, joilla on metodeja. **Tämän luvun asiat siis eivät ole kurssin kannalta relevantteja**, mutta varmasti monella tapaa hyödyllisiä tietää. Käytettäessä "vanhempaa Reactia", tämän luvun asiat on hallittava. -->

Due to the fact that during this course we are using a version of React containing React hooks, we have no need for defining objects with methods. **The contents of this chapter are not relevant to the course**, but are certainly in many ways good to know. In particular when using older versions of React one must understand the topics of this chapter. 

<!-- Nuolifunktiot ja avainsanan _function_ avulla määritellyt funktiot poikkeavat radikaalisti siitä miten ne käyttäytyvät olioon itseensä viittaavan avainsanan [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) suhteen. -->

Arrow functions and functions defined using the _function_ keyword vary substantially when it comes to how they behave with respect to the keyword [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), which refers to the object itself.

<!-- Voimme liittää oliolle metodeja määrittelemällä niille kenttiä, jotka ovat funktioita: -->

We can assign methods to object by defining properties that are functions:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

arto.greet()  // tulostuu hello, my name is Arto Hellas
```

<!-- metodeja voidaan liittää olioille myös niiden luomisen jälkeen: -->

methods can be assigned to objects even after the creation of the object:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // tulostuu 35
arto.growOlder()
console.log(arto.age)   // tulostuu 36
```

<!-- Muutetaan olioa hiukan -->

Let's slightly modify the object 

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4) // tulostuu 5

const referenceToAdditon = arto.doAddition
referenceToAdditon(10, 15) // tulostuu 25
```

<!-- Oliolla on nyt metodi _doAddition_, joka osaa laskea parametrina annettujen lukujen summan. Metodia voidaan kutsua normaaliin tapaan olion kautta <em>arto.doAddition(1, 4)</em> tai tallettamalla <i>metodiviite</i> muuttujaan ja kutsumalla metodia muuttujan kautta <em>referenceToAdditon(10, 15)</em>. -->

Now the object has a method _doAddition_, which calculates the sum of numbers given to it as parameters. The method is called in the usual way using the object <em>arto.doAddition(1, 4)</em> or by storing a <i>method reference</i> in a variable and calling the method through the variable <em>referenceToAdditon(10, 15)</em>.

<!-- Jos yritämme samaa metodille _greet_, aiheutuu ongelmia: -->

If we try to do the same thing with the method _greet_ we run an issue:

```js
arto.greet()       // tulostuu hello, my name is Arto Hellas

const referenceToGreet = arto.greet
referenceToGreet() // konsoliin tulostuu virheilmoitus
```

<!-- Kutsuttaessa metodia viitteen kautta, on metodi kadottanut tiedon siitä mikä oli alkuperäinen _this_. Toisin kuin melkein kaikissa muissa kielissä, Javascriptissa [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this):n arvo määrittyy sen mukaan <i>miten metodia on kutsuttu</i>. Kutsuttaessa metodia viitteen kautta, _this_:in arvoksi tulee ns. [globaali objekti](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) ja lopputulos ei ole yleensä ollenkaan se, mitä sovelluskehittäjä olettaa. -->

When calling the method through a reference the method has lost the information on what was the original _this_. Contrary to other languages, in Javascript the value of [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is defined based on <i>how the method is called</i>. When calling the method through a reference the value of _this_ becomes the so-called [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) and the end result is often not what the software developer intended.

<!-- This:in kadottaminen aiheuttaa Javascriptillä ohjelmoidessa monia potentiaalisia ongelmia. Eteen tulee erittäin usein tilanteita, missä Reactin/Noden (oikeammin ilmaistuna selaimen Javascript-moottorin) tulee kutsua joitain ohjelmoijan määrittelemien olioiden metodeja. Tällä kurssilla kuitenkin säästymme näiltä ongelmilta, sillä käytämme ainoastaan "thissitöntä" Javascriptia. -->

Losing track of _this_ when writing Javascript code brings forth a few potential issues. Situations often arise where React's or Node's (or more specifically the Javascript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course we are spared from the issues, since we are only using the "thisless" Javascript.

<!-- Eräs this:in katoamiseen johtava tilanne tulee esim. jos pyydetään Artoa tervehtimään sekunnin kuluttua metodia [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) hyväksikäyttäen. -->

One situation leading to the disappearance of _this_ arises when, e.g. we ask Arto to greet in one second using the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) method.

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

<!-- Javascriptissa this:in arvo siis määräytyy siitä miten metodia on kutsuttu. setTimeoutia käytettäessä metodia kutsuu Javascript-moottori ja this viittaa Timeout-olioon. -->

The value of _this_ in Javascript is defined based on how the method is being called. When setTimeout is using the method it is the Javascript engine that calls the method and _this_ refers to the Timeout object.

<!-- On useita mekanismeja, joiden avulla alkuperäinen _this_ voidaan säilyttää, eräs näistä on metodin [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) käyttö: -->

There are several mechanism by which the original _this_ can be preserved. One of these is using a method called [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):

```js
setTimeout(arto.greet.bind(arto), 1000)
```

<!-- Komento <em>arto.greet.bind(arto)</em> luo uuden funktion, missä se on sitonut _this_:in tarkoittamaan Artoa riippumatta siitä missä ja miten metodia kutsutaan. -->

The command <em>arto.greet.bind(arto)</em>  creates a new function, where it has bound _this_ to point to Arto independent of where and how the method is being called.

<!-- [Nuolifunktioiden](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) avulla on mahdollista ratkaista eräitä this:iin liittyviä ongelmia. Olioiden metodeina niitä ei kuitenkaan kannata käyttää, sillä silloin _this_ ei toimi ollenkaan. Palaamme nuolifunktioiden this:in käyttäytymiseen myöhemmin. -->

Using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) it is possible to solve some of the problems related to _this_. They should not, however, be used as methods for objects because then _this_ does not work at all. We will come back to the behavior of _this_ in relation to arrow functions later.

<!-- Jos haluat ymmärtää paremmin javascriptin _this_:in toimintaa, löytyy internetistä runsaasti materiaalia aiheesta. Esim. [egghead.io](https://egghead.io):n 20 minuutin screencastsarja [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) on erittäin suositeltava! -->

If you want to gain a better understanding of how _this_ works in Javascript the internet is full of material about the topic, e.g. the screen cast series [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) by [egghead.io](https://egghead.io) is highly recommended!

<!-- ### Luokat -->

### Classes

<!-- Kuten aiemmin mainittiin, Javascriptissä ei ole olemassa olio-ohjelmointikielten luokkamekanismia. Javascriptissa on kuitenkin ominaisuuksia, jotka mahdollistavat olio-ohjelmoinnin [luokkien](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) "simuloinnin". Emme mene nyt sen tarkemmin Javascriptin olioiden taustalla olevaan [prototyyppiperintämekanismiin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain). -->

As mentioned previously, there is no class mechanism like ones in object oriented programming languages. There are, however, features in Javascript which makes "simulating" object oriented [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) possible.

<!-- Tutustutaan nyt pikaisesti ES6:n myötä Javascriptiin tulleeseen <i>luokkasyntaksiin</i>, joka helpottaa oleellisesti luokkien (tai luokan kaltaisten asioiden) määrittelyä Javascriptissa. -->

Let's take a quick look at the <i>class syntax</i> that was introduced into Javascript along with ES6, which substantially simplifies the definition of classes (or class like things) in Javascript.

<!-- Seuraavassa on määritelty "luokka" Person ja sille kaksi Person-oliota: -->

Coming up we have defined a "class" called Person and two Person objects.

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is', this.name)
  }
}

const arto = new Person('Arto Hellas', 35)
arto.greet()

const juhq = new Person('Juha Tauriainen', 48)
juhq.greet()
```

<!-- Syntaksin osalta luokat ja niistä luodut oliot muistuttavat erittäin paljon esim. Javan luokkia ja olioita. Käyttäytymiseltäänkin ne ovat aika lähellä Javan olioita. Perimmiltään kyseessä on kuitenkin edelleen Javascriptin [prototyyppiperintään](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance) perustuvista olioista. Molempien olioiden todellinen tyyppi on _Object_ sillä Javascriptissä ei perimmiltään ole muita tyyppejä kuin [Boolean, Null, Undefined, Number, String, Symbol ja Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures) -->

When it comes to syntax the classes and the objects created from them are very reminiscent of e.g. Java classes and objects. Their behavior is also quite similar to Java objects. At the core they are still objects based on Javascript's [prototype inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). The type of both objects is actually _Object_ since Javascript essentially only has the types [Boolean, Null, Undefined, Number, String, Symbol ja Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

<!-- Luokkasyntaksin tuominen Javascriptiin on osin kiistelty lisäys, ks. esim. [Not Awesome: ES6 Classes](https://github.com/joshburgess/not-awesome-es6-classes) tai [Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) -->

Introduction of the class syntax is a controversial addition, e.g. check out [Not Awesome: ES6 Classes](https://github.com/joshburgess/not-awesome-es6-classes) or [Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)

<!-- ES6:n luokkasyntaksia käytetään paljon "vanhassa" Reactissa ja Node.js:ssä ja siksi sen tunteminen on tälläkin kurssilla paikallaan. Koska käytämme kurssilla Reactin uutta [hook](https://reactjs.org/docs/hooks-intro.html)-ominaisuutta, meidän ei ole tarvetta käyttää kurssilla ollenkaan Javascriptin luokkasyntaksia. -->

The ES6 class syntax is used a lot in the "old" React and in Node.js and therefore understanding it is beneficial even on this course. Because we are using the new [hook](https://reactjs.org/docs/hooks-intro.html) feature of React during this course we have no need to use the class syntax of Javascript.

<!-- ### Javascript-materiaalia -->

### Javascript materials

<!-- Javascriptistä löytyy verkosta suuret määrät sekä hyvää että huonoa materiaalia. Tällä sivulla lähes kaikki Javascriptin ominaisuuksia käsittelevät linkit ovat [Mozillan Javascript -materiaaliin](https://developer.mozilla.org/en-US/docs/Web/JavaScript). -->

On the internet we can find both good and bad guides for Javascript. On this page most of the links relating to Javascript features link to [Mozilla's Javascript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

<!-- Mozillan sivuilta kannattaa lukea oikeastaan välittömästi [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). -->

It is highly recommended to immediately read [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) on Mozillas website.

<!-- Jos haluat tutustua todella syvällisesti Javascriptiin, löytyy internetistä ilmaiseksi mainio kirjasarja [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS). -->

If you wish to deeply get to know Javascript there is a great free book series on the internet called [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

<!-- [egghead.io](https://egghead.io):lla on tarjolla runsaasti laadukkaita screencasteja Javascriptista, Reactista ym. kiinnostavasta. Valitettavasti materiaali on osittain maksullista. -->

[egghead.io](https://egghead.io) has plenty of quality screencasts on Javascript, React, and other interesting topics. Unfortunately some of the material is behind a paywall.

</div>
