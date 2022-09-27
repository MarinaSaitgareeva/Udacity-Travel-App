// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch GeoNames API with city data based on city name
const fetchGeonamesApi = async (city = '', geoNamesId) => {
  const baseUrl = `http://api.geonames.org/search?username=${geoNamesId}&type=json&maxRows=1&name=`; // maxRows=1 - fetch only 1st result

  let response = await fetch(baseUrl + city);
  console.log('Geonames API: ', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
    if (data.geonames.length > 0) {
      data = data.geonames[0];
      return {
        latitude: data.lat.slice(0, 6),
        longitude: data.lng.slice(0, 6),
        country_code: data.countryCode,
        country_name: data.countryName,
        city_population: convertPopulation(data.population),
        city: data.name
      };
    };
  } else {
      // Appropriately handle the error
      console.log(`Error: code ${response.status} ${response.statusText}!!!`);
      return {
        latitude: 'no data',
        longitude: 'no data',
        country_code: 'no data',
        country_name: 'no data',
        city_population: 'no data',
        city: 'no data'
    };
  };
};

// Function to convert numbers to Billions, Millions, Thousands
function convertPopulation (number) {
  // Nine Zeroes for Billions
  return Math.abs(Number(number)) >= 1.0e+9
  ? (Math.abs(Number(number)) / 1.0e+9).toFixed(2) + 'b'
  // Six Zeroes for Millions 
  : Math.abs(Number(number)) >= 1.0e+6
  ? (Math.abs(Number(number)) / 1.0e+6).toFixed(2) + 'm'
  // Three Zeroes for Thousands
  : Math.abs(Number(number)) >= 1.0e+3
  ? (Math.abs(Number(number)) / 1.0e+3).toFixed(2) + 'k'
  : Math.abs(Number(number));
};

// Export js file
module.exports = fetchGeonamesApi;