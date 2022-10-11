// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Timezonedb API with city time based on latitude, longitude
const fetchTimezonedbApi = async (latitude, longitude, timezonedbApiKey) => {
  // Set variable to store url to fetch API data
  let url = `http://api.timezonedb.com/v2.1/get-time-zone?&format=json&key=${timezonedbApiKey}&by=position&lat=${latitude}&lng=${longitude}`;
  // Fetch API data
  let response = await fetch(url);
  console.log('Timezonedb API:', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
    return {
      abbreviation: data.abbreviation, // Abbreviation of the time zone
      gmtOffset: (data.gmtOffset / 60 / 60).toString(), // The time offset in hours (seconds / 60 / 60) based on UTC time
    };
  } else {
      // Appropriately handle the error
      console.log(`Error: code ${response.status} ${response.statusText}!!!`);
      return {
        abbreviation: 'no data',
        gmtOffset: 'no data'
      };
    };
};

// Export js file
module.exports = fetchTimezonedbApi;