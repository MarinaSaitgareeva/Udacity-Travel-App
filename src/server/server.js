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
//Here we are configuring express to use body-parser as middle-ware.
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
})

// Import functions
import { fetchGeonamesApi } from './geoNamesAPI';
import { fetchWeatherbitApi } from './weatherbitAPI';
import { fetchPixabayApi } from './pixabayAPI';

// Set variable for trip data from different API
const trip = {
  departure: 'from',
  destination: {
    city: 'to',
    country: '',
    country_code: '',
    latitude: '',
    longitude: '',
    // population: ''
  },
  id: '',
  date: '',
  countdown: '',
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
  // Set destination city and departing date
  trip.departure = req.body.departure;
  trip.date = req.body.date;
  // get countdown number
  trip.countdown = countdown(req.body.date).toString();

  // Fetch destination data by GeoNamesAPI
  let destinationData = await fetchGeonamesApi(req.body.destination, process.env.GEONAMES_USERNAME);
  trip.destination.city = destinationData.city;
  trip.destination.country_code = destinationData.country_code;
  trip.destination.latitude = destinationData.latitude;
  trip.destination.longitude = destinationData.longitude;

  // Fetch weather data from wWatherbit API
  let weatherData = await fetchWeatherbitApi(
    trip.destination.latitude,
    trip.destination.longitude,
    trip.date,
    process.env.WEATHERBIT_API_KEY
  );
  // console.log(weatherData);
  trip.weather.temperature = weatherData.temperature;
  trip.weather.icon = weatherData.weather_icon;
  trip.weather.description = weatherData.weather_description;

  // Fetch image url by Pixabay API
  trip.image = await fetchPixabayApi(req.body.destination, '', process.env.PIXABAY_API_KEY);

  res.send(trip);
  console.info('** This request has been processed:\n', req.body, ' **');
});