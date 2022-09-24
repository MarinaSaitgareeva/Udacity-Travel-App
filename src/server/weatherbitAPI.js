// Require module node-fetch to use the fetch() function in NodeJS
// const fetch = require('node-fetch');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Weatherbit API with weather historic data based on city, country, start date, end date from WeatherbitAPI
const fetchWeatherbitApi = async (latitude, longitude, date, weatherbitApiKey) => {
  let url = 'https://api.weatherbit.io/v2.0/history/hourly?';
  let lastYearDate = date.split('-');
  lastYearDate[0] = (parseInt(lastYearDate[0]) - 1).toString();
  lastYearDate = lastYearDate.join('-');
  url = `${url}key=${weatherbitApiKey}&lat=${latitude}&lon=${longitude}&start_date=${lastYearDate}:12&end_date=${lastYearDate}:13`;

  let response = await fetch(url);
  console.log('Weatherbit API:', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
    // console.log(data);
    return {
      temperature: data.data[0].temp,
      weather_icon: 'https://www.weatherbit.io/static/img/icons/' + data.data[0].weather.icon + '.png',
      weather_description: data.data[0].weather.description
    };
  } else {
    console.log(`ERROR: code ${response.status} ${response.statusText}.`);
    return {
      temperature: 'no data',
      weather_icon: 'no data',
      weather_description: 'no data'
    };
  }
};

// Export js file
module.exports = fetchWeatherbitApi;