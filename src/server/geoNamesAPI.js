// Require module node-fetch to use the fetch() function in NodeJS
// const fetch = require('node-fetch');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch GeoNames API with city, country, latitude, longitude
const fetchGeonamesApi = async (city = '', geoNamesId) => {
  const baseUrl = `http://api.geonames.org/search?username=${geoNamesId}&type=json&maxRows=1&name=`;

  let response = await fetch(baseUrl + city);
  console.log('Geonames API: ', response.status, response.statusText, response.ok);

  if (response.ok) {
      let data = await response.json();
      // console.log(data, data.geonames);
      if (data.geonames.length > 0) {
          data = data.geonames[0];
          return {
              latitude: data.lat.slice(0, 6),
              longitude: data.lng.slice(0, 6),
              country_code: data.countryCode,
              country_name: data.countryName,
              population: data.population,
              city: data.name
          };
      }
  } else {
      console.log(`ERROR: code ${response.status} ${response.statusText}.`);
  }
  return {
      latitude: 'no data',
      longitude: 'no data',
      country_code: 'no data',
      country_name: 'no data',
      population: 'no data',
      city: 'no data'
  };
};

// Export js file
module.exports = fetchGeonamesApi;