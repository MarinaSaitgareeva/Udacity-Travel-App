// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch rest countries API (https://restcountries.com/) with country data based on country_code
const restcountriesApi = async (code = '') => {
  const url = 'https://restcountries.com/v3.1/alpha/';

  let response = await fetch(url + code);
  console.log('Rest Countries API: ', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();

    return {
      country: Object.values(data[0].name)[0],
      capital: data[0].capital[0],
      region: data[0].region,
      country_population: convertPopulation(data[0].population),
      currency: Object.values(data[0].currencies)[0].symbol,
      language: Object.values(data[0].languages)[0],
      flag: data[0].flags.svg,
      map: data[0].maps.googleMaps
    };
  } else {
      // Appropriately handle the error
      console.log(`Error: code ${response.status} ${response.statusText}!!!`);
      return {
        country: 'no data',
        capital: 'no data',
        region: 'no data',
        country_population: 'no data',
        currency: 'no data',
        language: 'no data',
        flag: 'no data',
        map: 'no data'
      }
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
module.exports = restcountriesApi;