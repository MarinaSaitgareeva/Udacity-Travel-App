// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Weatherbit API with weather current data based on city, country, start date, end date (16 Day Weather Forecast API)
const fetchWeatherbitCurrentApi = async (latitude, longitude, weatherbitApiKey) => {
  let currentUrl = `https://api.weatherbit.io/v2.0/current?key=${weatherbitApiKey}&lat=${latitude}&lon=${longitude}`;

  let response = await fetch(currentUrl);
  console.log('Weatherbit API (current):', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
    return {
      current_temperature: `${data.data[0].temp} ℃`,
      current_feels_like_temperature: `${data.data[0].app_temp} ℃`, // Apparent/"Feels Like" temperature
      current_uv: data.data[0].uv,
      current_wind_speed: `${data.data[0].wind_spd.toFixed(1)} m/s`,
      current_wind_direction: getCardinalDirection(data.data[0].wind_dir),
      current_icon: 'https://www.weatherbit.io/static/img/icons/' + data.data[0].weather.icon + '.png',
      current_description: data.data[0].weather.description
    };
  } else {
    // Appropriately handle the error
    console.log(`Error: code ${response.status} ${response.statusText}!!!`);
    return {
      current_temperature: 'no data',
      current_feels_like_temperature: 'no data',
      current_uv: 'no data',
      current_wind_speed: 'no data',
      current_wind_direction: 'no data',
      current_icon: 'no data',
      current_description: 'no data'
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