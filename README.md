# Nappula
Napinpainallus moninpeli.

[Peli löytyy täältä](nappula.herokuapp.com) Herokusta.

Nappia painamalla kulutat yhden pisteen ja voit voittaa pisteitä.

Jos pisteet loppuvat, peli on ohi. Tosin voit yrittää heti uudelleen.

## Asennus ja käyttöönotto
Lataa tämä repo joko git clone:lla tai zippinä (pura johonkin sopivaan paikkaan).

Aja sitten seuraavat komennot juurikansiosta alkaen (siellä missä on server.js)

`npm install` (Asentaa palvelimen riippuvuudet)

`cd front` (Vaihda frontend kansioon)

`npm install` (Asenna frontending riippuvuudet)

Näiden jälkeen voit laittaa pelin pystyyn komennoilla. Käytä kahta terminaalia/komentoriviä. Varmista, että olet juurikansiossa.

Ensimmäiseen:

`node server.js` (Palvelimen käynnistys)

Toiseen:

`cd front`

`npm start` (Frontendin käynnistys)

Jos löytyy oma Heroku, niin voit niiden ohjeita seuraamalla ajaa sielläkin.
