// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Weatherbit API with weather historical data based on city, country and date
const fetchWeatherbitHistoricalApi = async (latitude, longitude, date, weatherbitApiKey) => {
  // Set variable to store url for Weatherbit API
  let historicalUrl = 'https://api.weatherbit.io/v2.0/history/hourly?';
  // Set variable to store date
  let currentDate = new Date(date);
  // Change date year to last year
  let lastYearDate = new Date(currentDate.setFullYear(currentDate.getFullYear()-1));
  // Convert last year date to format "2022-01-01" (without time)
  lastYearDate = lastYearDate.toISOString().split('T')[0];
  // Update url for Weatherbit API
  historicalUrl = `${historicalUrl}key=${weatherbitApiKey}&lat=${latitude}&lon=${longitude}&start_date=${lastYearDate}:12&end_date=${lastYearDate}:13`;
  // Fetch weather historical data from Weatherbit API with update url
  let response = await fetch(historicalUrl);
  console.log('Weatherbit API (historical):', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
    return {
      historical_temperature: `${data.data[0].temp}℃`,
      historical_uv: data.data[0].uv.toFixed(1), // UV Index (0-11+)
      historical_humidity: `${data.data[0].rh}%`, // Relative humidity (%)
      historical_pressure: `${data.data[0].pres}mb`, // Pressure (mb)
      historical_wind_speed: `${data.data[0].wind_spd.toFixed(1)} m/s`,
      historical_wind_direction: getCardinalDirection(data.data[0].wind_dir),
      historical_icon: 'https://www.weatherbit.io/static/img/icons/' + data.data[0].weather.icon + '.png',
      historical_description: data.data[0].weather.description
    };
  } else {
    console.log(`ERROR: code ${response.status} ${response.statusText}.`);
    return {
      historical_temperature: 'no data',
      historical_uv: 'no data',
      historical_humidity: 'no data',
      historical_pressure: 'no data',
      historical_wind_speed: 'no data',
      historical_wind_direction: 'no data',
      historical_icon: 'no data',
      historical_description: 'no data'
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