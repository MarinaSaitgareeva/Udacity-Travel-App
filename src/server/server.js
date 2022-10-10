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
const calculateDaysLength = require('./calculateDaysLength');
const fetchGeonamesApi = require('./geoNamesAPI');
const restcountriesApi = require('./restcountriesAPI');
const fetchWeatherbitHistoricalApi = require('./weatherbitHistoricalAPI');
const fetchWeatherbitCurrentApi = require('./weatherbitCurrentAPI');
const fetchTimezonedbApi = require('./timezonedbAPI');
const fetchPixabayApi = require('./pixabayAPI');

// Set variable to store trip data from different APIs
let trip = {
  id: '',
  status: '',
  departure: {
    city: 'from',
    country: '',
    country_code: '',
    latitude: '',
    longitude: '',
    flag: '',
    map: ''
  },
  destination: {
    city: 'to',
    country: '',
    country_code: '',
    latitude: '',
    longitude: '',
    city_population: '',
    capital: '',
    currency: '',
    currency_name: '',
    language: '',
    flag: '',
    map: ''
  },
  startDate: '',
  endDate: '',
  daysToGo: '',
  daysLength: '',
  current_weather: {
    date: '',
    temp: '',
    uv: '',
    humidity: '',
    pressure: '',
    wind_speed: '',
    wind_dir: '',
    icon: '',
    description: ''
  },
  startDateLastYear_weather: {
    temp: '',
    uv: '',
    humidity: '',
    pressure: '',
    wind_speed: '',
    wind_dir: '',
    icon: '',
    description: ''
  },
  endDateLastYear_weather: {
    temp: '',
    uv: '',
    humidity: '',
    pressure: '',
    wind_speed: '',
    wind_dir: '',
    icon: '',
    description: ''
  },
  time: {
    abbreviation: '',
    gmtOffset: '',
    current_time: ''
  },
  image: '',
  image_figcaption: ''
};

// POST route for trip data
app.post('/tripInfo', async (req, res) => {
  // Set departure city, destination, start date and end date
  trip.startDate = req.body.startDate;
  trip.endDate = req.body.endDate;

  // Get daysLength number
  trip.daysLength = calculateDaysLength(trip.startDate, trip.endDate).toString();

  // Fetch departure data by GeoNamesAPI
  let departureData = await fetchGeonamesApi(req.body.departure, process.env.GEONAMES_USERNAME);
    trip.departure.city = departureData.city;
    trip.departure.country_code = departureData.country_code;
    trip.departure.country = departureData.country_name;
    trip.departure.latitude = departureData.latitude;
    trip.departure.longitude = departureData.longitude;
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
    trip.departure.flag = departureCountryData.flag;
    trip.departure.map = departureCountryData.map;
  console.log(departureCountryData);

  // Fetch destination data by restcountries API using country_code
  let destinationCountryData = await restcountriesApi(trip.destination.country_code);
    trip.destination.capital = destinationCountryData.capital;
    trip.destination.currency = destinationCountryData.currency;
    trip.destination.currency_name = destinationCountryData.currency_name;
    trip.destination.language = destinationCountryData.language;
    trip.destination.flag = destinationCountryData.flag;
    trip.destination.map = destinationCountryData.map;
  console.log(destinationCountryData);

  // Fetch weather data from Watherbit API (historical start-date last year)
  let weatherStartDateLastYear = await fetchWeatherbitHistoricalApi(
    trip.destination.latitude,
    trip.destination.longitude,
    trip.startDate,
    process.env.WEATHERBIT_API_KEY
  );
  trip.startDateLastYear_weather.temp = weatherStartDateLastYear.temp;
  trip.startDateLastYear_weather.uv = weatherStartDateLastYear.uv;
  trip.startDateLastYear_weather.humidity = weatherStartDateLastYear.humidity;
  trip.startDateLastYear_weather.pressure = weatherStartDateLastYear.pressure;
  trip.startDateLastYear_weather.wind_speed = weatherStartDateLastYear.wind_speed;
  trip.startDateLastYear_weather.wind_dir = weatherStartDateLastYear.wind_dir;
  trip.startDateLastYear_weather.icon = weatherStartDateLastYear.icon;
  trip.startDateLastYear_weather.description = weatherStartDateLastYear.description;
console.log(weatherStartDateLastYear);

// Fetch weather data from Watherbit API (historical end-date last year)
let weatherEndDateLastYear = await fetchWeatherbitHistoricalApi(
  trip.destination.latitude,
  trip.destination.longitude,
  trip.endDate,
  process.env.WEATHERBIT_API_KEY
);
  trip.endDateLastYear_weather.temp = weatherEndDateLastYear.temp;
  trip.endDateLastYear_weather.uv = weatherEndDateLastYear.uv;
  trip.endDateLastYear_weather.humidity = weatherEndDateLastYear.humidity;
  trip.endDateLastYear_weather.pressure = weatherEndDateLastYear.pressure;
  trip.endDateLastYear_weather.wind_speed = weatherEndDateLastYear.wind_speed;
  trip.endDateLastYear_weather.wind_dir = weatherEndDateLastYear.wind_dir;
  trip.endDateLastYear_weather.icon = weatherEndDateLastYear.icon;
  trip.endDateLastYear_weather.description = weatherEndDateLastYear.description;
console.log(weatherEndDateLastYear);


// Fetch weather data from Watherbit API (current)
let currentWeatherData = await fetchWeatherbitCurrentApi(
  trip.destination.latitude,
  trip.destination.longitude,
  process.env.WEATHERBIT_API_KEY
);
  trip.current_weather.date = currentWeatherData.date;
  trip.current_weather.temp = currentWeatherData.temp;
  trip.current_weather.uv = currentWeatherData.uv;
  trip.current_weather.humidity = currentWeatherData.humidity;
  trip.current_weather.pressure = currentWeatherData.pressure;
  trip.current_weather.wind_speed = currentWeatherData.wind_speed;
  trip.current_weather.wind_dir = currentWeatherData.wind_dir;
  trip.current_weather.icon = currentWeatherData.icon;
  trip.current_weather.description = currentWeatherData.description;
console.log(currentWeatherData);

// Fetch time data from Timezobedb API
let destinationTimeData = await fetchTimezonedbApi(
  trip.destination.latitude,
  trip.destination.longitude,
  process.env.TIMEZONEDB_API_KEY
);
  trip.time.abbreviation = destinationTimeData.abbreviation;
  trip.time.gmtOffset = destinationTimeData.gmtOffset;
console.log(destinationTimeData);

// Fetch image url by Pixabay API
let img = await fetchPixabayApi(trip.destination.city, trip.destination.country, process.env.PIXABAY_API_KEY);
  // Set alternative image (image of destination's city without country) if there is no image of city with country
  if (typeof img == 'undefined') {
    trip.image = await fetchPixabayApi(trip.destination.city, trip.destination.city, process.env.PIXABAY_API_KEY);
    trip.image_figcaption = trip.destination.city + ', ' + trip.destination.country;
    // Set alternative image (image of destination's capital) if there is no image of city
    if (typeof trip.image == 'undefined') {
      trip.image = await fetchPixabayApi(trip.destination.capital, trip.destination.country, process.env.PIXABAY_API_KEY);
      trip.image_figcaption = trip.destination.capital + ', ' + trip.destination.country;
      // Set alternative image (image of destination's country) if there is no image of capital
      if (typeof trip.image == 'undefined') {
        trip.image = await fetchPixabayApi(trip.destination.country, trip.destination.country, process.env.PIXABAY_API_KEY);
        trip.image_figcaption = trip.destination.country;
      };
    };
  } else {
    // Set trip image and image_figcaption
    trip.image = img;
    trip.image_figcaption = trip.destination.city + ', ' + trip.destination.country;
  };
  console.log(trip.image);
  console.log(trip.image_figcaption);
    
  res.send(trip);
  console.log('**** This request has been processed:\n', req.body, ' ****');
});

// POST route for updated weather
app.post('/weather', async (req, res) => {
  // Set variable for trip data from different API (to act as endpoint)
  let updatedWeatherData = {
    city: '',
    country: '',
    latitude: '',
    longitude: '',
    startDate: '',
    endDate: '',
    startDateLastYear_weather: {
      temp: '',
      uv: '',
      humidity: '',
      pressure: '',
      wind_speed: '',
      wind_dir: '',
      icon: '',
      description: ''
    },
    endDateLastYear_weather: {
      temp: '',
      uv: '',
      humidity: '',
      pressure: '',
      wind_speed: '',
      wind_dir: '',
      icon: '',
      description: ''
    },
    current_weather: {
      temp: '',
      uv: '',
      humidity: '',
      pressure: '',
      wind_speed: '',
      wind_dir: '',
      icon: '',
      description: ''
    }
  };

  // Set destination data: city, country, latitude, longitude, start date and end date
  updatedWeatherData.city = req.body.city;
  updatedWeatherData.country = req.body.country;
  updatedWeatherData.latitude = req.body.latitude;
  updatedWeatherData.longitude = req.body.longitude;
  updatedWeatherData.startDate = req.body.startDate;
  updatedWeatherData.endDate = req.body.endDate;

  // Fetch weather data from Watherbit API (historical)
  let historicalWeatherData = await fetchWeatherbitHistoricalApi(
    updatedWeatherData.latitude,
    updatedWeatherData.longitude,
    updatedWeatherData.startDate,
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
    trip.weather.date = currentWeatherData.date;
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





  // Fetch image url by Pixabay API
  let updatedWeather = await fetchPixabayApi(updatedImgData.city, updatedImgData.country, process.env.PIXABAY_API_KEY);
   // Set alternative image (image of destination's city without country) if there is no image of city with country
    if (typeof updatedImg == 'undefined') {
      updatedImgData.image = await fetchPixabayApi(updatedImgData.city, updatedImgData.city, process.env.PIXABAY_API_KEY);
      updatedImgData.image_figcaption = updatedImgData.city + ', ' + updatedImgData.country;
      // Set alternative image (image of destination's capital) if there is no image of city
      if (typeof updatedImgData.image == 'undefined') {
        updatedImgData.image = await fetchPixabayApi(trip.destination.country, trip.destination.country, process.env.PIXABAY_API_KEY);
        updatedImgData.image_figcaption = updatedImgData.country;
      };
    } else {
      updatedImgData.image = updatedImg;
      updatedImgData.image_figcaption = updatedImgData.city + ', ' + updatedImgData.country;
    };
  console.log(updatedImgData.image);
  console.log(updatedImgData.image_figcaption);
  res.send(updatedImgData);
});

// POST route for updated image
app.post('/images', async (req, res) => {
  // Set variable to store updated image data for saved trips
  let updatedImgData = {
    city: '',
    country: '',
    capital: '',
    image: '',
    image_figcaption: ''
  };
  // Set destination data: city, country and capital
  updatedImgData.city = req.body.city;
  updatedImgData.country = req.body.country;
  updatedImgData.capital = req.body.capital;
  // Fetch image url by Pixabay API
  let updatedImg = await fetchPixabayApi(updatedImgData.city, updatedImgData.country, process.env.PIXABAY_API_KEY);
  // Set alternative image (image of destination's city without country) if there is no image of city with country
    if (typeof updatedImg == 'undefined') {
      updatedImgData.image = await fetchPixabayApi(updatedImgData.city, updatedImgData.city, process.env.PIXABAY_API_KEY);
      updatedImgData.image_figcaption = updatedImgData.city + ', ' + updatedImgData.country;
       // Set alternative image (image of destination's capital) if there is no image of city
      if (typeof updatedImgData.image == 'undefined') {
        updatedImgData.image = await fetchPixabayApi(trip.destination.capital, trip.destination.country, process.env.PIXABAY_API_KEY);
        updatedImgData.image_figcaption = trip.destination.capital + ', ' + updatedImgData.country;
        // Set alternative image (image of destination's country) if there is no image of capital
        if (typeof updatedImgData.image == 'undefined') {
          updatedImgData.image = await fetchPixabayApi(trip.destination.country, trip.destination.country, process.env.PIXABAY_API_KEY);
          updatedImgData.image_figcaption = updatedImgData.country;
        };
      };
    } else {
      updatedImgData.image = updatedImg;
      updatedImgData.image_figcaption = updatedImgData.city + ', ' + updatedImgData.country;
    };
  console.log(updatedImgData.image);
  console.log(updatedImgData.image_figcaption);
  res.send(updatedImgData);
});

// GET route for server test
app.get('/test', async (req, res) => {
  res.json({ msg: 'Done!' })
});

// Export my server.js
module.exports = app;