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
const fetchWeatherbitHistoricalApi = require('./weatherbitHistoricalAPI');
const fetchWeatherbitCurrentApi = require('./weatherbitCurrentAPI');
const fetchTimezonedbApi = require('./timezonedbAPI');
const fetchPixabayApi = require('./pixabayAPI');

// Set variable for trip data from different API (to act as endpoint for GET route)
let trip = {
  id: '',
  departure: {
    city: 'to',
    country: '',
    country_code: '',
    region: '',
    latitude: '',
    longitude: '',
    city_population: '',
    capital: '',
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
    capital: '',
    country_population: '',
    currency: '',
    language: '',
    flag: '',
    map: ''
  },
  startDate: '',
  endDate: '',
  daysToGo: '',
  daysLength: '',
  weather: {
    historical_temperature: '',
    historical_feels_like_temperature: '',
    historical_uv: '',
    historical_humidity: '',
    historical_pressure: '',
    historical_wind_speed: '',
    historical_wind_direction: '',
    historical_icon: '',
    historical_description: '',
    current_temperature: '',
    current_feels_like_temperature: '',
    current_uv: '',
    current_humidity: '',
    current_pressure: '',
    current_wind_speed: '',
    current_wind_direction: '',
    current_icon: '',
    current_description: ''
  },
  time: {
    zone_name: '',
    abbreviation: '',
    gmtOffset: '',
    current_time: '',
    dst: '',
    nextAbbreviation: ''
  },
  image: '',
  image_figcaption: ''
};

// // Set variable (array) for saved trip data
let savedTrips = [];

// POST route for trip data
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

  // Fetch weather data from Watherbit API (historical)
  let historicalWeatherData = await fetchWeatherbitHistoricalApi(
    trip.destination.latitude,
    trip.destination.longitude,
    trip.startDate,
    process.env.WEATHERBIT_API_KEY
  );
    trip.weather.historical_temperature = historicalWeatherData.historical_temperature;
    trip.weather.historical_feels_like_temperature = historicalWeatherData.historical_feels_like_temperature;
    trip.weather.historical_uv = historicalWeatherData.historical_uv;
    trip.weather.historical_humidity = historicalWeatherData.historical_humidity;
    trip.weather.historical_pressure = historicalWeatherData.historical_pressure;
    trip.weather.historical_wind_speed = historicalWeatherData.historical_wind_speed;
    trip.weather.historical_wind_direction = historicalWeatherData.historical_wind_direction;
    trip.weather.historical_icon = historicalWeatherData.historical_icon;
    trip.weather.historical_description = historicalWeatherData.historical_description;
  console.log(historicalWeatherData);

  // Fetch weather data from Watherbit API (current)
  let currentWeatherData = await fetchWeatherbitCurrentApi(
    trip.destination.latitude,
    trip.destination.longitude,
    process.env.WEATHERBIT_API_KEY
  );
    trip.weather.current_temperature = currentWeatherData.current_temperature;
    trip.weather.current_feels_like_temperature = currentWeatherData.current_feels_like_temperature;
    trip.weather.current_uv = currentWeatherData.current_uv;
    trip.weather.current_humidity = currentWeatherData.current_humidity;
    trip.weather.current_pressure = currentWeatherData.current_pressure;
    trip.weather.current_wind_speed = currentWeatherData.current_wind_speed;
    trip.weather.current_wind_direction = currentWeatherData.current_wind_direction;
    trip.weather.current_icon = currentWeatherData.current_icon;
    trip.weather.current_description = currentWeatherData.current_description;
  console.log(currentWeatherData);

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
  let img = await fetchPixabayApi(trip.destination.city, trip.destination.country, process.env.PIXABAY_API_KEY);
    // Set alternative image (image of destination's capital) if there is no image of city 
    if (typeof img == 'undefined') {
      trip.image = await fetchPixabayApi(trip.destination.capital, trip.destination.country, process.env.PIXABAY_API_KEY);
      trip.image_figcaption = trip.destination.capital + ', ' + trip.destination.country;
      // Set alternative image (image of destination's country) if there is no image of capital 
      if (typeof trip.image == 'undefined') {
        trip.image = await fetchPixabayApi(trip.destination.country, trip.destination.country, process.env.PIXABAY_API_KEY);
        trip.image_figcaption = trip.destination.country;
      };
    } else {
      trip.image = img;
      trip.image_figcaption = trip.destination.city + ', ' + trip.destination.country;
    };
  console.log(trip.image);
  console.log(trip.image_figcaption);
    
  res.send(trip);
  console.log('**** This request has been processed:\n', req.body, ' ****');
});

// GET route for for trip data
app.get('/getTripInfo', (req, res) => {
  res.json(trip);
});






// POST route for saved trips (saving data)
app.post('/saveTripInfo', (req, res) => {
  savedTrips.push(trip);
  res.send(trip);
});

// GET route for saved trips
app.get('/getSavedTripInfo', (req, res) => {
  res.json(savedTrips);
});

// POST route for saved trips (removing data)
app.post('/removeSavedTripInfo', (req, res) => {
  const tripId = trip.id;

  savedTrips = savedTrips.filter((savedTrip) => {
    return savedTrip.id != tripId;
  });

  res.json(savedTrips);
});