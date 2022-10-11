# Udacity Capstone - Travel App

## Overview
This Travel app allows a user to enter departure city, destination city, start date and end date for a trip and provides information about the destination: city, country, flag, google map link, image, day to go, trip length, population, language, currency, capital, historical weather data, current weather data, current time (gmtOffset). The app also allows to save or delete trip information for later usage and automatically sorts trips based on start date, destination city and departure city.

## Installating and Running the app
1) Run npm install in the terminal to get the packages required
2) Create the '.env' file and enter your own API credentials:
    API variables.
    GEONAMES_USERNAME='your username'
    WEATHERBIT_API_KEY='your API key'
    PIXABAY_API_KEY='your API key'
    TIMEZONEDB_API_KEY='your API key'
3) Run npm build-dev script to create development build
5) Run npm build-prod script to create production build
4) Run npm start script to start the express server
5) Run npm test script to test 

## Technologies used
- Webpack
- Jest
- Supertest
- Workbox
- Express

## API's used
- GeoNames
  https://www.geonames.org/export/web-services.html
- Weatherbit API
  https://www.weatherbit.io/api
- Pixabay API
  https://pixabay.com/api/docs/
- REST Countries API
  https://restcountries.com/
- TimeZonedb API
  https://timezonedb.com/api

## Chosen Suggestions to Make My Project Stand Out
- Add end date and display length of trip.
- Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
- Integrate the REST Countries API to pull in data for the country being visited.
- Allow the user to remove the trip.
- Use Local Storage to save the data so that when they close, then revisit the page, their information is still there.
- Incorporate icons into forecast.
- Allow the user to add additional trips (this may take some heavy reworking, but is worth the challenge).
  Automatically sort additional trips by countdown.
  Move expired trips to bottom/have their style change so it’s clear it’s expired.

## Further work for future me
- Allow user to add multiple destinations on the same trip.
  Pull in weather for additional locations.
- Allow the user to add hotel and/or flight data.
  Multiple places to stay? Multiple flights?
- Allow user to Print their trip and/or export to PDF.
- Allow the user to add a todo list and/or packing list for their trip.
- Add tests to all files.
- Add ...Loading spinner when retrieving results.