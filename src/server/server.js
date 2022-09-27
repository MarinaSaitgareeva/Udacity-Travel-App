// Use the dotenv package to use environment variables (for the MeaningCloud API key)
const dotenv = require('dotenv');
dotenv.config();

// Require path to provide a way of working with directories and file paths
var path = require('path');

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */
//Here we are configuring express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false })); // to use url encoded values
app.use(bodyParser.json()); // to use json

// Require cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

console.log(__dirname);

// Setup Server
const port = 8080;

// Designates what port the app will listen to for incoming requests
app.listen(port, () => {
  console.log(`Travel app is listening on port http://localhost:${port}`)
});

// GET route
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
  // res.sendFile(path.resolve('src/client/views/index.html'))
})

// Import functions
const calculateDaysToGo = require('./calculateDaysToGo');
const calculateDaysLength = require('./calculateDaysLength');
const fetchGeonamesApi = require('./geoNamesAPI');
const restcountriesApi = require('./restcountriesAPI');
const fetchWeatherbitApi = require('./weatherbitAPI');
const fetchTimezonedbApi = require('./timezonedbAPI');
const fetchPixabayApi = require('./pixabayAPI');

// Set variable for trip data from different API (to act as endpoint for GET route)
let trip = {
  departure: {
    city: 'to',
    country: '',
    country_code: '',
    region: '',
    latitude: '',
    longitude: '',
    city_population: '',
    country_population: '',
    currency: '',
    language: '',
    flag: '',
    map: ''
  },
  destination: {
    city: 'to',
    country: '',
    country_code: '',
    region: '',
    latitude: '',
    longitude: '',
    city_population: '',
    country_population: '',
    currency: '',
    language: '',
    flag: '',
    map: ''
  },
  id: '',
  startDate: '',
  endDate: '',
  daysToGo: '',
  daysLength: '',
  weather: {
    temperature: '',
    feels_like_temperature: '',
    // max_temperature: '',
    // min_temperature: '',
    uv: '',
    wind_speed: '',
    wind_direction: '',
    icon: '',
    description: ''
  },
  time: {
    zone_name: '',
    abbreviation: '',
    gmtOffset: '',
    current_time: '',
    dst: '',
    nextAbbreviation: ''
  },
  image: ''
};

// POST route - trip data
app.post('/tripInfo', async (req, res) => {
  // Set departure city, destination, start date and end date
  trip.startDate = req.body.startDate;
  trip.endDate = req.body.endDate;

  // Get daysToGo number
  trip.daysToGo = calculateDaysToGo(trip.startDate).toString();

  // Get daysLength number
  trip.daysLength = calculateDaysLength(trip.startDate, trip.endDate).toString();

  // Fetch departure data by GeoNamesAPI
  let departureData = await fetchGeonamesApi(req.body.departure, process.env.GEONAMES_USERNAME);
    trip.departure.city = departureData.city;
    trip.departure.country_code = departureData.country_code;
    trip.departure.country = departureData.country_name;
    trip.departure.latitude = departureData.latitude;
    trip.departure.longitude = departureData.longitude;
    trip.departure.city_population = departureData.city_population;
  console.log(departureData);

  // Fetch destination data by GeoNamesAPI
  let destinationData = await fetchGeonamesApi(req.body.destination, process.env.GEONAMES_USERNAME);
    trip.destination.city = destinationData.city;
    trip.destination.country_code = destinationData.country_code;
    trip.destination.country = destinationData.country_name;
    trip.destination.latitude = destinationData.latitude;
    trip.destination.longitude = destinationData.longitude;
    trip.destination.city_population = destinationData.city_population;
  console.log(destinationData);

  // Fetch departure data by restcountries API using country_code
  let departureCountryData = await restcountriesApi(trip.departure.country_code);
    trip.departure.capital = departureCountryData.capital;
    trip.departure.region = departureCountryData.region;
    trip.departure.country_population = departureCountryData.country_population;
    trip.departure.currency = departureCountryData.currency;
    trip.departure.language = departureCountryData.language;
    trip.departure.flag = departureCountryData.flag;
    trip.departure.map = departureCountryData.map;
  console.log(departureCountryData);

  // Fetch destination data by restcountries API using country_code
  let destinationCountryData = await restcountriesApi(trip.destination.country_code);
    trip.destination.capital = destinationCountryData.capital;
    trip.destination.region = destinationCountryData.region;
    trip.destination.country_population = destinationCountryData.country_population;
    trip.destination.currency = destinationCountryData.currency;
    trip.destination.language = destinationCountryData.language;
    trip.destination.flag = destinationCountryData.flag;
    trip.destination.map = destinationCountryData.map;
  console.log(destinationCountryData);

  // Fetch weather data from Watherbit API
  let weatherData = await fetchWeatherbitApi(
    trip.destination.latitude,
    trip.destination.longitude,
    trip.startDate,
    process.env.WEATHERBIT_API_KEY
  );
    trip.weather.temperature = weatherData.temperature;
    trip.weather.feels_like_temperature = weatherData.feels_like_temperature;
    // trip.weather.max_temperature = weatherData.max_temperature;
    // trip.weather.min_temperature = weatherData.min_temperature;
    trip.weather.uv = weatherData.uv;
    trip.weather.wind_speed = weatherData.wind_speed;
    trip.weather.wind_direction = weatherData.wind_direction;trip.weather.icon = weatherData.weather_icon;
    trip.weather.description = weatherData.weather_description;
  console.log(weatherData);

  // Fetch time data from Timezobedb API
  let destinationTimeData = await fetchTimezonedbApi(
    trip.destination.latitude,
    trip.destination.longitude,
    process.env.TIMEZONEDB_API_KEY
  );
    trip.time.zone_name = destinationTimeData.zone_name;
    trip.time.abbreviation = destinationTimeData.abbreviation;
    trip.time.gmtOffset = destinationTimeData.gmtOffset;
    trip.time.current_time = destinationTimeData.current_time;
    trip.time.dst = destinationTimeData.dst;
    trip.time.nextAbbreviation = destinationTimeData.nextAbbreviation;
  console.log(destinationTimeData);


  // Fetch image url by Pixabay API
  let img = await fetchPixabayApi(req.body.destination, '', process.env.PIXABAY_API_KEY);
    trip.image = img;

  res.send(trip);
  console.log('** This request has been processed:\n', req.body, ' **');
});