// Import js file
import { calculateDaysToGo } from './calculateDaysToGo';
import { calculateCurrentTime } from './refreshApiData';
import { saveTrip } from './saveTrip';

// Function to render search result in "trip-result" <section>
const displayNewSearch = (trip) => {
  // Add image
  document.querySelector('#destination-photo').src = trip.image;
  // Add image caption
  document.querySelector('#destination-photo-caption').textContent = trip.image_figcaption;

  // Add departure and destination: city, country code, flag and map url
  document.querySelector('#destination-and-departure').innerHTML = `<strong>Route: </strong>from <strong><a class="map" href="${trip.departure.map}" target="_blank">${trip.departure.city} (${trip.departure.country_code}) <img class="flag" src="${trip.departure.flag}" alt="flag"></a></strong> to <strong><a class="map" href="${trip.destination.map}" target="_blank">${trip.destination.city} (${trip.destination.country_code}) <img class="flag" src="${trip.destination.flag}" alt="flag"></a></strong>`;
  
  // Calculate a number of days between trip start date and current date
  trip.daysToGo = calculateDaysToGo(trip);

  // Add start and end dates (trip's length) - number of days between trip start date and current date
  document.querySelector('#start-and-end-date').innerHTML = `<strong>Dates: </strong>from <strong> ${formatDate(trip.startDate)} </strong> till <strong> ${formatDate(trip.endDate)} </strong> (${trip.daysLength} days) - <em style="color: #faaa54;">${daysToGoText(trip.daysToGo)}</em>`;

    // Function to change format of date
    function formatDate (date) {
      let d = new Date(date);
      let months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec');
      let curMonth = months[d.getMonth()];
      let curDay = d.getUTCDate(); // returns the day according to UTC (UTC (Universal Time Coordinated) is the time set by the World Time Standard)
      let curYear = d.getFullYear().toString().substr(2);
      let weekday = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
      let dayOfWeek = weekday[d.getDay()];
      let newDate = curMonth + ' ' + curDay + ', ' + curYear + ' (' + dayOfWeek + ')';
      return newDate;
    };

    // Function to add text in daysToGo
    function daysToGoText() {
      if (trip.daysToGo > 0) {
        return `${trip.daysToGo} days left. Be Ready!`;
      } else if (trip.daysToGo == 0) {
        return `Today! Are You Ready?`;
      } else {
        return `Your trip was ${trip.daysToGo * -1} days ago!`;
      }
    };

  // Add destination details
  document.querySelector('#destination-details').innerHTML = `
    <p>
      <strong>Population: </strong>${trip.destination.city_population};&nbsp; &nbsp; 
      <strong>Language: </strong>${trip.destination.language};&nbsp; &nbsp; 
      <strong>Currency: </strong>${trip.destination.currency} (${trip.destination.currency_name});&nbsp; &nbsp; 
      <strong>Capital: </strong>${trip.destination.capital}
    </p>
  `;

  // Calculate current time (destination)
  calculateCurrentTime(trip);

  // Add current time (destination)
  document.querySelector('#current-time').innerHTML = `<strong>Current time: </strong>&nbsp;<span class="current-time">${trip.time.current_time}</span> (${trip.time.abbreviation}: ${changeGmtOffSet(trip.time.gmtOffset)})`;


  function changeGmtOffSet (gmtOffset) {
    if (gmtOffset > 0) {
      return `UTC +${gmtOffset}:00`;
    } else {
      return `UTC ${gmtOffset}:00`;
    };
  };

  // Add weather (historic and current weather in destination)
  document.querySelector('#weather').innerHTML = `
    <p><strong>Historic weather </strong><i id="weather-assumption">(previous year) </i> : </p>
    <table id="historical-weather">
      <tr>
        <th>Start Date</th>
        <th>End Date</th>
      </tr>
      <tr>
        <td>${trip.startDateLastYear_weather.temp}, uv = ${trip.startDateLastYear_weather.uv},&nbsp; rh = ${trip.startDateLastYear_weather.humidity}, wind = ${trip.startDateLastYear_weather.wind_speed} (${trip.startDateLastYear_weather.wind_dir}), ${trip.startDateLastYear_weather.description} <img class="weather-icon" src="${trip.startDateLastYear_weather.icon}" alt="weather icon"></td>
        <td>${trip.endDateLastYear_weather.temp}, uv = ${trip.endDateLastYear_weather.uv},&nbsp; rh = ${trip.endDateLastYear_weather.humidity}, wind = ${trip.endDateLastYear_weather.wind_speed} (${trip.endDateLastYear_weather.wind_dir}), ${trip.endDateLastYear_weather.description} <img class="weather-icon" src="${trip.endDateLastYear_weather.icon}" alt="weather icon"></td>
      </tr>
    </table>
   
    <p><strong>Current weather: </strong></p>
    <p id="weather-current">${trip.current_weather.temp}, uv = ${trip.current_weather.uv}, rh = ${trip.current_weather.humidity}, wind = ${trip.current_weather.wind_speed} (${trip.current_weather.wind_dir}), ${trip.current_weather.description} <img class="weather-icon" src="${trip.current_weather.icon}" alt="weather icon"></p>
  `;

  // Show search result in "trip-result" <section>
  document.querySelector('#trip-result').classList.remove('hide');

  // Smoothly scrolls to "trip-result" <section> with search result
  document.querySelector('#trip-result').scrollIntoView(false, {
    behavior: 'smooth',
    block: 'end'
  });

  // Add Event Listener on click to "search-form-save-btn" <button> (save search result in "saved-trips" <section>)
  document.querySelector('#search-form-save-btn').addEventListener('click', saveTrip);

  // Add Event Listener on click to "search-form-remove-btn" <button> (hide "trip-result" <section> with search result)
  document.querySelector('#search-form-remove-btn').addEventListener('click', () => document.querySelector('#trip-result').classList.add('hide'));

};

// Export js file
export { displayNewSearch };