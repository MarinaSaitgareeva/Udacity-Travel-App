// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Weatherbit API with weather historical data based on city, country, start date, end date
const fetchWeatherbitHistoricalApi = async (latitude, longitude, date, weatherbitApiKey) => {
  let historicalUrl = 'https://api.weatherbit.io/v2.0/history/hourly?';
  let lastYearDate = date.split('-');
  lastYearDate[0] = (parseInt(lastYearDate[0]) - 1).toString();
  lastYearDate = lastYearDate.join('-');
  historicalUrl = `${historicalUrl}key=${weatherbitApiKey}&lat=${latitude}&lon=${longitude}&start_date=${lastYearDate}:12&end_date=${lastYearDate}:13`;

  let response = await fetch(historicalUrl);
  console.log('Weatherbit API (historical):', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
    return {
      historical_temperature: `${data.data[0].temp} ℃`,
      historical_feels_like_temperature: `${data.data[0].app_temp} ℃`, // Apparent/"Feels Like" temperature
      historical_uv: data.data[0].uv,
      historical_wind_speed: `${data.data[0].wind_spd.toFixed(1)} m/s`,
      historical_wind_direction: getCardinalDirection(data.data[0].wind_dir),
      historical_weather_icon: 'https://www.weatherbit.io/static/img/icons/' + data.data[0].weather.icon + '.png',
      historical_weather_description: data.data[0].weather.description
    };
  } else {
    console.log(`ERROR: code ${response.status} ${response.statusText}.`);
    return {
      historical_temperature: 'no data',
      historical_feels_like_temperature: 'no data',
      historical_uv: 'no data',
      historical_wind_speed: 'no data',
      historical_wind_direction: 'no data',
      historical_weather_icon: 'no data',
      historical_weather_description: 'no data'
    };
  };
};

// Function to convert wind direction from angle to text format (compass rose - 8 cardinal directions)
function getCardinalDirection(angle) {
  const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
  return directions[Math.round(angle / 45) % 8];
}

// Export js file
module.exports = fetchWeatherbitHistoricalApi;