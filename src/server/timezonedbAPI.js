// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Timezonedb API with city time based on latitude, longitude
const fetchTimezonedbApi = async (latitude, longitude, timezonedbApiKey) => {
  let url = `http://api.timezonedb.com/v2.1/get-time-zone?&format=json&key=${timezonedbApiKey}&by=position&lat=${latitude}&lng=${longitude}`;

  let response = await fetch(url);
  console.log('Timezonedb API:', response.status, response.statusText, response.ok);

  if (response.ok) {
    let data = await response.json();
  
    return {
      zone_name: data.zoneName,
      abbreviation: data.abbreviation, // Abbreviation of the time zone
      gmtOffset: `UTC ${data.gmtOffset / 60 / 60}:00`, // The time offset in seconds based on UTC time
      current_time: data.formatted.toString().substr(11), // Formatted timestamp in Y-m-d h:i:s format. E.g.: 2022-09-26 16:23:22
      dst: data.dst, // Whether Daylight Saving Time (DST) is used. Either 0 (No) or 1 (Yes)
      nextAbbreviation: data.nextAbbreviation
    };
  } else {
    // Appropriately handle the error
      console.log(`Error: code ${response.status} ${response.statusText}!!!`);
      return {
        zone_name: 'no data',
        abbreviation: 'no data',
        gmtOffset: 'no data',
        current_time: 'no data',
        dst: 'no data',
        nextAbbreviation: 'no data'
      };
    }
};

// Export js file
module.exports = fetchTimezonedbApi;