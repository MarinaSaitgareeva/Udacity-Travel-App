// Import js file
import { saveTrip } from './saveTrip';

// Function to render search result
export const displayNewSearch = (trip) => {
  // New image
  document.querySelector('#destination-photo').src = trip.image;
  // New image caption
  document.querySelector('#destination-photo-caption').textContent = trip.image_figcaption;

  // New departure and destination
  document.querySelector('#destination-and-departure').innerHTML = `<strong>Route: </strong>from <strong><a class="map" href="${trip.departure.map}" target="_blank">${trip.departure.city} (${trip.departure.country_code}) <img class="flag" src="${trip.departure.flag}" alt="flag"></a></strong> to <strong><a class="map" href="${trip.destination.map}" target="_blank">${trip.destination.city} (${trip.destination.country_code}) <img class="flag" src="${trip.destination.flag}" alt="flag"></a></strong>`;
  
  // New start and end date (trip's length) - daysToGo
  document.querySelector('#start-and-end-date').innerHTML = `<strong>Dates: </strong>from <strong> ${formatDate(trip.startDate)} </strong> till <strong> ${formatDate(trip.endDate)} </strong> (${trip.daysLength} days) - <em style="color: #faaa54;">${daysToGoText(trip.daysToGo)}</em>`;

    // Function to change format of date (start and end dates)
    function formatDate (date) {
      let d = new Date(date);
      let months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec');
      let curMonth = months[d.getMonth()];
      let curDay = d.getUTCDate(); // returns the day according to UTC (UTC (Universal Time Coordinated) is the time set by the World Time Standard)
      let curYear = d.getFullYear().toString().substr(2);
      let weekday = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
      let dayOfWeek = weekday[d.getDay()];
      let newDate = curMonth + ' ' + curDay + ', ' + curYear + ' (' + dayOfWeek + ')';
      return newDate
    };

    // Function to add text in daysToGo
    function daysToGoText() {
      if (trip.daysToGo > 0) {
        return `${trip.daysToGo} days left. Be Ready!`
      }
      else if (trip.daysToGo == 0) {
        return `Today! Are You Ready?`
      }
      else {
        return `Expired, You missed your Trip!`
      }
    };

  // New destination details
  document.querySelector('#destination-details').innerHTML = `
    <p>
      <strong>Population: </strong>${trip.destination.city_population};&nbsp; &nbsp; 
      <strong>Language: </strong>${trip.destination.language};&nbsp; &nbsp; 
      <strong>Currency: </strong>${trip.destination.currency};&nbsp; &nbsp; 
      <strong>Capital: </strong>${trip.destination.capital}
    </p>
  `;

  // New current time (destination)
  document.querySelector('#current-time').innerHTML = `<strong>Current time: </strong>&nbsp;${trip.time.current_time} (${trip.time.abbreviation}: ${trip.time.gmtOffset})`;

  // New weather
  document.querySelector('#weather').innerHTML = `
    <p><strong>Historic weather </strong><i id="weather-assumption">(previous year) </i> : </p>
    <p>${trip.weather.historical_temperature} (feel likes = ${trip.weather.historical_feels_like_temperature}),</p>
    <p>uv = ${trip.weather.historical_uv},&nbsp; rh = ${trip.weather.historical_humidity}, wind = ${trip.weather.historical_wind_speed} (${trip.weather.historical_wind_direction})</p>
    <p id="weather-historical-description">
      ${trip.weather.historical_description} 
      <img id="weather-icon" src="${trip.weather.historical_icon}" alt="weather icon">
    </p>
   
    <p><strong>Current weather: </strong></p>
    <p id="weather-current">${trip.weather.current_temperature}, uv = ${trip.weather.current_uv}, rh = ${trip.weather.current_humidity}, wind = ${trip.weather.current_wind_speed} (${trip.weather.current_wind_direction}), ${trip.weather.current_description} <img id="weather-icon" src="${trip.weather.current_icon}" alt="weather icon"></p>
  `;

  // Show search result
  document.querySelector('#trip-result').classList.remove('hide');

  // Smoothly scrolls to Div with results
  document.querySelector('#trip-result').scrollIntoView(false, {
    behavior: 'smooth',
    block: 'end'
  });

  // Add Event Listener to save and delete buttons
  document.querySelector('#search-form-save-btn').addEventListener('click', saveTrip);
  // document.querySelector('#search-form-remove-btn').addEventListener('click', removeTrip());

  // // Add function for saving trip
  // document.querySelector('#search-form-save-btn').onclick = 'return saveTrip()';

  // // Add function for removing trip
  // document.querySelector('#search-form-remove-btn').onclick = 'return removeTrip()';
  
  // Hide search form after loading of result
  // document.querySelector('#trip-search').style.display = 'none';
  // document.querySelector('#trip-result').style.marginTop = '13.3rem';
};