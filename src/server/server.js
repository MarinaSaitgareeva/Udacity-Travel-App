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
  console.log(`*** Travel app is listening on port ${port}! ***`)
});

// GET route
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
  // res.sendFile(path.resolve('src/client/views/index.html'))
})

// Import functions
const calculateDaysToGo = require('./calculateDaysToGo');
const fetchGeonamesApi = require('./geoNamesAPI');
const fetchWeatherbitApi = require('./weatherbitAPI');
const fetchPixabayApi = require('./pixabayAPI');
// import { calculateDaysToGo } from './calculateDaysToGo';
// import { fetchGeonamesApi } from './geoNamesAPI';
// import { fetchWeatherbitApi } from './weatherbitAPI';
// import { fetchPixabayApi } from './pixabayAPI';

// Set variable for trip data from different API (to act as endpoint for GET route)
let trip = {
  // departure: 'from',
  departure: {
    city: 'from',
    country: '',
    country_code: '',
  },
  destination: {
    city: 'to',
    country: '',
    country_code: '',
    latitude: '',
    longitude: '',
    population: ''
  },
  id: '',
  startDate: '',
  endDate: '',
  daysToGo: '',
  daysLength: '',
  weather: {
    temperature: '',
    icon: '',
    description: ''
  },
  // flight: {
//     price: '',
//     carrier: '',
//     direct: ''
  // },
  image: '',
  // covid: {
  //   growth: '',
  //   level: ''
  // }
};

// POST route - trip data
app.post('/tripInfo', async (req, res) => {
  // Set departure city, destination, start date and end date
  trip.startDate = req.body.startDate;
  trip.endDate = req.body.endDate;

  // Get daysToGo number
  trip.daysToGo = calculateDaysToGo(trip.startDate).toString();

  // Fetch departure data by GeoNamesAPI
  let departureData = await fetchGeonamesApi(req.body.departure, process.env.GEONAMES_USERNAME);
  trip.departure.city = departureData.city;
  trip.departure.country_code = departureData.country_code;
  trip.departure.country = departureData.country_name;

  // Fetch destination data by GeoNamesAPI
  let destinationData = await fetchGeonamesApi(req.body.destination, process.env.GEONAMES_USERNAME);
  trip.destination.city = destinationData.city;
  trip.destination.country_code = destinationData.country_code;
  trip.destination.country = destinationData.country_name;
  trip.destination.latitude = destinationData.latitude;
  trip.destination.longitude = destinationData.longitude;
  trip.destination.population = destinationData.population;
  console.log(destinationData);

  // Fetch weather data from Watherbit API
  let weatherData = await fetchWeatherbitApi(
    trip.destination.latitude,
    trip.destination.longitude,
    trip.startDate,
    process.env.WEATHERBIT_API_KEY
  );
  console.log(weatherData);
  trip.weather.temperature = weatherData.temperature;
  trip.weather.icon = weatherData.weather_icon;
  trip.weather.description = weatherData.weather_description;

  // Fetch image url by Pixabay API
  let img = await fetchPixabayApi(req.body.destination, '', process.env.PIXABAY_API_KEY);
  trip.image = img;

  res.send(trip);
  console.info('** This request has been processed:\n', req.body, ' **');
});