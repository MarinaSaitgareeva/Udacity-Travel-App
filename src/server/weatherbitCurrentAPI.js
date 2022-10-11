// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Weatherbit API with weather current data based on city, country, start date, end date (16 Day Weather Forecast API)
const fetchWeatherbitCurrentApi = async (latitude, longitude, weatherbitApiKey) => {
  // Set variable to store url to fetch API data
  let currentUrl = `https://api.weatherbit.io/v2.0/current?key=${weatherbitApiKey}&lat=${latitude}&lon=${longitude}`;
  // Fetch API data
  let response = await fetch(currentUrl);
  console.log('Weatherbit API (current):', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
    return {
      date: data.data[0].datetime.slice(0, 10),
      temp: `${data.data[0].temp}℃`,
      uv: data.data[0].uv.toFixed(1), // UV Index (0-11+)
      humidity: `${data.data[0].rh}%`, // Relative humidity (%)
      pressure: `${data.data[0].pres}mb`, // Pressure (mb)
      wind_speed: `${data.data[0].wind_spd.toFixed(1)} m/s`, // Wind speed (Default m/s)
      wind_dir: getCardinalDirection(data.data[0].wind_dir), // Wind direction (degrees)
      icon: 'https://www.weatherbit.io/static/img/icons/' + data.data[0].weather.icon + '.png', // URL for Weather icon
      description: data.data[0].weather.description // Text weather description
    };
  } else {
    // Appropriately handle the error
    console.log(`Error: code ${response.status} ${response.statusText}!!!`);
    return {
      date: 'no data',
      temp: 'no data',
      uv: 'no data',
      humidity: 'no data',
      pressure: 'no data',
      wind_speed: 'no data',
      wind_dir: 'no data',
      icon: 'no data',
      description: 'no data'
    };
  };
};

// Function to convert wind direction from angle to text format (compass rose - 8 cardinal directions)
function getCardinalDirection(angle) {
  const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
  return directions[Math.round(angle / 45) % 8];
}

// Export js file
module.exports = fetchWeatherbitCurrentApi;