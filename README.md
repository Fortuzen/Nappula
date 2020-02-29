# Nappula
Napinpainallus moninpeli.

[Peli löytyy täältä](http://nappula.herokuapp.com) Herokusta.

Nappia painamalla ja yhden pisteen kuluttamalla voit voittaa pisteitä.

Jos pisteet loppuvat, peli on ohi. Tosin voit yrittää heti uudelleen.

## Asennus ja käyttöönotto
Lataa tämä repo joko git clone:lla tai zippinä (pura johonkin sopivaan paikkaan).

Tarvitset myös [NodeJS:n](https://nodejs.org/en/)

Aja sitten seuraavat komennot juurikansiosta alkaen (siellä missä on server.js)

`npm install` (Asentaa palvelimen riippuvuudet)

`cd front` (Vaihda frontend kansioon)

`npm install` (Asenna frontendin riippuvuudet)

Sitten luo ".env"-tiedosto, jonne laitetaan salainen avain muodossa ilman lainausmerkkejä "SECRET=avain".

Näiden jälkeen voit laittaa pelin pystyyn komennoilla. Käytä kahta terminaalia/komentoriviä. Varmista, että olet juurikansiossa.

Ensimmäiseen:

`node server.js` (Palvelimen käynnistys)

Toiseen:

`cd front`

`npm start` (Frontendin käynnistys)

Selaimen pitäisi avautua automaattisesti osoitteeseen [http://localhost:3000](http://localhost:3000)

Jos löytyy oma Heroku, niin voit niiden ohjeita seuraamalla ajaa sielläkin.
