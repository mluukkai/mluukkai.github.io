(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{132:function(e,a,t){"use strict";t.r(a),t.d(a,"default",function(){return O}),t.d(a,"partInfoQuery",function(){return R});t(379),t(67),t(46),t(167),t(381);var n=t(168),r=t(150),l=t(142),o=t(152),s=t(163),i=t(177),c=t.n(i),u=t(257),m=t(0),p=t.n(m),d=t(162),f=t(144),k=t(255),b=t.n(k),g=t(533),E=t.n(g),v=t(172),h=t.n(v),N=t(156),y=t.n(N),w=t(159),C=t.n(w),x=t(287),j=t(246),_=t.n(j),L=t(186),F=t.n(L);function O(e){var a=e.data.markdownRemark,t=a.frontmatter,i=a.html,m=t.mainImage,k=t.part,g=E()(C.a[k])?[]:Object.keys(C.a[k]),v={replace:function(e){var a=e.type,t=e.attribs,n=e.children;if("tag"===a&&"intro"===t.class)return p.a.createElement("div",{className:"col-7"},b()(n,v))}};return p.a.createElement(s.a,null,p.a.createElement(d.a,{title:"Fullstack osa"+k,description:h.a,keywords:[].concat(y.a,[C.a[k]?Object.values(C.a[k]):[]])}),p.a.createElement("div",{className:"spacing--after"},p.a.createElement(r.a,{className:"part-intro__banner spacing--mobile--small",style:{backgroundImage:"url("+_.a.resolve(m.publicURL)+")",backgroundColor:f[x.a[k]]}},p.a.createElement(l.a,{className:"container"},p.a.createElement(n.a,{className:"breadcrumb",content:[{backgroundColor:f[x.a[k]],text:"Fullstack",link:"/#course-contents"},{backgroundColor:f.black,text:"osa "+k}]}),p.a.createElement("div",{className:"part-intro col-7 col-10--mobile spacing--after-small"},c()(i,v)),g&&p.a.createElement(n.a,{wrapperClassName:"spacing--mobile--large",stack:!0,content:g.map(function(e){return{backgroundColor:f.white,letter:e,path:"/osa"+k+"/"+F()(C.a[k][e]),text:e+" "+C.a[k][e]}})}))),p.a.createElement(u.a,{part:k})),p.a.createElement(o.a,null))}var R="2600260727"},144:function(e){e.exports={white:"#ffffff",black:"#33332d",main:"#e1e1e1",violet:"#B795F3",turquoise:"#82F7EB",green:"#AEFFDA","dark-orange":"#EB8755","light-orange":"#EEAC5D",yellow:"#F7F382",pink:"#E693CB",blue:"#706BE4","light-blue":"#82D2F7","light-violet":"#B2BBF0"}},150:function(e,a,t){"use strict";t.d(a,"a",function(){return c});t(28);var n=t(143),r=t.n(n),l=(t(160),t(4)),o=t.n(l),s=t(0),i=t.n(s),c=function(e){var a=e.className,t=e.backgroundColor,n=r()(e,["className","backgroundColor"]),l=t?{backgroundColor:t}:null;return i.a.createElement("div",Object.assign({className:"banner "+a,style:l},n))};c.defaultProps={className:""},c.propTypes={className:o.a.string}},152:function(e,a,t){"use strict";t(153);var n=t(142),r=t(145),l=t(141),o=t(0),s=t.n(o),i=t(158),c=t.n(i),u=t(164),m=t(154),p=[{src:t.n(m).a,alt:"Helsingin yliopiston logo",href:"https://www.helsinki.fi/"},{src:c.a,alt:"Houston inc. logo",href:"https://www.houston-inc.com/"}];a.a=function(){return s.a.createElement(n.a,{id:"footer",className:"container spacing--after-small spacing--mobile",flex:!0},s.a.createElement(n.a,{className:"col-5 push-right-3 col-10--mobile order-2--mobile order-2--tablet footer__links",flex:!0,spaceBetween:!0},p.map(function(e){return s.a.createElement("a",{key:e.alt,href:e.href,className:"col-5 col-4--mobile spacing--mobile"},s.a.createElement(r.a,{contain:!0,src:e.src,alt:e.alt,className:"col-6"}))})),s.a.createElement(n.a,{flex:!0,className:"col-5 col-5--mobile order-1--mobile order-1--tablet footer__navigation"},s.a.createElement("div",{className:"footer__navigation-link-container"},u.b.map(function(e){return s.a.createElement(l.Link,{key:e.path,to:e.path,className:"footer__navigation-link nav-item-hover",style:{marginLeft:"4.5rem"}},e.text)}))))}},153:function(e,a,t){},156:function(e,a){e.exports=["fullstack","full stack open 2019","course","helsingin yliopisto","tietojenkäsittelytieteen osasto","mooc","mooc.fi","full stack","full stack open","web-sovelluskehitys","web","houston","houston inc","websovelluskehitys","web-sovellus","React","Redux","Node.js","Node","MongoDB","GraphQL","REST","REST api","single page -sovellus","ohjelmointi"]},159:function(e,a){e.exports={0:{a:"General info",b:"Fundamentals of Web-apps"},1:{a:"Introduction to React",b:"Javascript",c:"Component state, event handlers",d:"A more complex state, debugging React apps"},2:{a:"Rendering a collection, modules",b:"Forms",c:"Getting data from server",d:"Altering data in server",e:"Tyylien lisääminen React-sovellukseen"},3:{a:"Node.js ja Express",b:"Sovellus internetiin",c:"Tietojen tallettaminen MongoDB-tietokantaan",d:"Validointi ja ESLint"},4:{a:"Sovelluksen rakenne ja testauksen alkeet",b:"Backendin testaaminen",c:"Käyttäjien hallinta",d:"Token-perustainen kirjautuminen"},5:{a:"Kirjautuminen frontendissä",b:"props.children ja proptypet",c:"React-sovellusten testaaminen",d:"Custom hookit"},6:{a:"Flux-arkkitehtuuri ja Redux",b:"Monta reduseria, connect",c:"Redux-sovelluksen kommunikointi palvelimen kanssa"},7:{a:"React-router",b:"Lisää tyyleistä",c:"Webpack",d:"Luokkakomponentit, E2E-testaus",e:"Sekalaista",f:"Tehtäviä: blogilistan laajennus"},8:{a:"GraphQL-palvelin",b:"React ja GraphQL",c:"Tietokanta ja käyttäjien hallinta",d:"Kirjautuminen ja välimuistin päivitys",e:"Fragmentit ja subskriptiot"}}},160:function(e,a,t){},168:function(e,a,t){"use strict";t(28),t(165),t(176);var n=t(143),r=t.n(n),l=(t(169),t(142)),o=t(141),s=t(4),i=t.n(s),c=t(0),u=t.n(c),m=t(144),p=function(e){var a,t=e.className,n=e.wrapperClassName,s=e.link,i=e.content,c=e.stack,p=e.bold,d=e.thickBorder,f=e.upperCase,k=r()(e,["className","wrapperClassName","link","content","stack","bold","thickBorder","upperCase"]),b=u.a.createElement("div",{className:"arrow__container arrows--horizontal "+t},i.map(function(e,a){var t={backgroundColor:e.backgroundColor?e.backgroundColor:"transparent",color:e.backgroundColor===m.black?"white":m.black};return u.a.createElement("div",Object.assign({key:"arrow"+a,className:"arrow__wrapper"},k),u.a.createElement("div",{className:"arrow__rectangle "+(p?"bold":"")+" "+(d?"arrow__rectangle--thick-border":""),style:t},e.link?u.a.createElement(o.Link,{to:e.link},f?e.text.toUpperCase():e.text):f?e.text.toUpperCase():e.text),u.a.createElement("div",{className:"arrow__point "+(d?"arrow__point--thick-border":""),style:t}))}));return c||s?!c&&s?a=u.a.createElement("div",{className:"spacing--after-small auto-bottom-margin"},u.a.createElement(o.Link,{to:s,style:{display:"inline-block"}},b)):c&&(a=u.a.createElement("div",{className:"col-10 spacing--after "+n},u.a.createElement("div",{className:"arrow__container arrow__container--with-link",style:{display:"flex",flexDirection:"column"}},i.map(function(e){var a={backgroundColor:e.backgroundColor?e.backgroundColor:"transparent",color:e.backgroundColor===m.black?"white":m.black};return u.a.createElement(o.Link,Object.assign({key:e.text,to:e.path,className:"arrow__wrapper--stacked "+t},k),u.a.createElement(l.a,{flex:!0,className:"arrow__rectangle",style:a},u.a.createElement("p",{className:"arrow--stacked-title"},u.a.createElement("span",null,e.text))),u.a.createElement("div",{className:"arrow__point",style:a}))})))):a=u.a.createElement("div",{className:"col-10 spacing--after"},b),a};p.propTypes={className:i.a.string,wrapperClassName:i.a.string,link:i.a.string,content:i.a.array.isRequired,stack:i.a.bool,upperCase:i.a.bool,bold:i.a.bool,thickBorder:i.a.bool},p.defaultProps={className:"",wrapperClassName:""},a.a=p},169:function(e,a,t){},172:function(e,a){e.exports="Helsingin yliopiston ja Houston Inc:n kaikille avoin ja ilmainen moderniin Javascript-pohjaiseen web-sovelluskehitykseen keskittyvä kurssi. Osallistujilta edellytetään vahvaa ohjelmointirutiinia, pitkäjänteistyyttä ja valmiuksia omatoimiseen ongelmanratkaisuun."},257:function(e,a,t){"use strict";t(320),t(322),t(323),t(67),t(46),t(167),t(258);var n=t(142),r=t(141),l=t(4),o=t(0),s=t.n(o),i=t(159),c=t.n(i),u=t(186),m=t.n(u),p=Object.keys(c.a),d=function(e){return String.fromCharCode(e.charCodeAt(0)-1)},f=function(e){return String.fromCharCode(e.charCodeAt(0)+1)},k=function(e){return p.includes(e.toString())},b=function(e,a){return f(e)in c.a[a]},g=function(e,a){return!e&&k(a+1)||e&&b(e,a)},E=function(e){var a=e.part,t=e.letter;return s.a.createElement(n.a,{className:"container spacing spacing--after-large prev-next__container"},!t&&k(a-1)?s.a.createElement(s.a.Fragment,null,s.a.createElement(r.Link,{to:"/osa"+(a-1),className:"col-4--mobile push-right-1 prev"},s.a.createElement(n.a,{flex:!0,dirColumn:!0},s.a.createElement("p",null,"Osa ",a-1),s.a.createElement("b",null,"Edellinen osa"))),g(t,a)&&s.a.createElement("div",{className:"col-1--mobile separator"})):t?"a"!==t?s.a.createElement(s.a.Fragment,null,s.a.createElement(r.Link,{to:"/osa"+a+"/"+m()(c.a[a][d(t)]),className:"col-4--mobile push-right-1 prev"},s.a.createElement(n.a,{flex:!0,dirColumn:!0},s.a.createElement("p",null,"Osa ",""+a+d(t)),s.a.createElement("b",null,"Edellinen osa"))),g(t,a)&&s.a.createElement("div",{className:"col-1--mobile separator"})):k(a-1)?s.a.createElement(s.a.Fragment,null,s.a.createElement(r.Link,{to:"/osa"+(a-1),className:"col-4--mobile push-right-1 prev"},s.a.createElement(n.a,{flex:!0,dirColumn:!0},s.a.createElement("p",null,"Osa ",a-1),s.a.createElement("b",null,"Edellinen osa"))),g(t,a)&&s.a.createElement("div",{className:"col-1--mobile separator"})):s.a.createElement(n.a,{className:"push-right-1"}):s.a.createElement(n.a,{className:"push-right-1"}),!t&&k(a+1)?s.a.createElement(r.Link,{to:"/osa"+(a+1),className:"col-4--mobile push-left-1 next"},s.a.createElement(n.a,{flex:!0,dirColumn:!0},s.a.createElement("p",null,"Osa ",a+1),s.a.createElement("b",null,"Seuraava osa"))):t?b(t,a)?s.a.createElement(r.Link,{to:"/osa"+a+"/"+m()(c.a[a][f(t)]),className:"col-4--mobile push-left-1 next"},s.a.createElement(n.a,{flex:!0,dirColumn:!0},s.a.createElement("p",null,"Osa ",""+a+f(t)),s.a.createElement("b",null,"Seuraava osa"))):k(a+1)?s.a.createElement(r.Link,{to:"/osa"+(a+1),className:"col-4--mobile push-left-1 next"},s.a.createElement(n.a,{flex:!0,dirColumn:!0},s.a.createElement("p",null,"Osa ",a+1),s.a.createElement("b",null,"Seuraava osa"))):s.a.createElement(n.a,{className:"push-left-1"}):s.a.createElement(n.a,{className:"push-left-1"}))};E.defaultProps={part:void 0,letter:void 0},E.propTypes={part:l.PropTypes.number,letter:l.PropTypes.string},a.a=E},258:function(e,a,t){},287:function(e,a,t){"use strict";t.d(a,"a",function(){return n});var n={0:"light-violet",1:"green",2:"dark-orange",3:"light-orange",4:"yellow",5:"pink",6:"violet",7:"light-blue",8:"turquoise"}},379:function(e,a,t){var n=t(21),r=t(380)(!1);n(n.S,"Object",{values:function(e){return r(e)}})},380:function(e,a,t){var n=t(29),r=t(32),l=t(71).f;e.exports=function(e){return function(a){for(var t,o=r(a),s=n(o),i=s.length,c=0,u=[];i>c;)l.call(o,t=s[c++])&&u.push(e?[t,o[t]]:o[t]);return u}}},381:function(e,a,t){},533:function(e,a,t){var n=t(259)("isEmpty",t(534),t(285));n.placeholder=t(231),e.exports=n},534:function(e,a,t){var n=t(275),r=t(179),l=t(237),o=t(149),s=t(276),i=t(238),c=t(239),u=t(271),m="[object Map]",p="[object Set]",d=Object.prototype.hasOwnProperty;e.exports=function(e){if(null==e)return!0;if(s(e)&&(o(e)||"string"==typeof e||"function"==typeof e.splice||i(e)||u(e)||l(e)))return!e.length;var a=r(e);if(a==m||a==p)return!e.size;if(c(e))return!n(e).length;for(var t in e)if(d.call(e,t))return!1;return!0}}}]);
//# sourceMappingURL=component---src-templates-part-intro-template-js-287156682e849301db74.js.map