import { calculateCurrentTime, renderCurrentTime, refreshCurrentWeather } from "./refreshApiData";

// Function to render saved trip template
const renderSavedTripTemplate = (trip) => {
  // Set variable to store "saved-trip-template" with all content inside of it
  let template = document.querySelector('#saved-trip-template').content;
  // Set variable to clone "saved-trip-template" with all content inside of it
  let templateCopy = template.cloneNode(true); // cloneNode is used to clone a node from current document
  // Alternative way
  // let templateCopy = document.importNode(template, true); //importNode is used to clone a node from another document
  // Set ID for "saved-trip-container" <article> = "a number of days between travel start date and current date" + "destination city" + "departure city"
  templateCopy.firstChild.id = trip.daysToGo + '-' + trip.destination.city.replace(/ /g,'') + '-' + trip.departure.city.replace(/ /g,'');
  // Add image of destination city / capital / country
  templateCopy.querySelector('.saved-destination-photo').src = trip.image;
  // Add image caption
  templateCopy.querySelector('.saved-destination-photo-caption').textContent = trip.image_figcaption;
  // Add departure and destination: city, country code, flag and map url
  templateCopy.querySelector('.saved-route').innerHTML = `
    <a class="saved-map" href="${trip.departure.map}" target="_blank">
      <strong>${trip.departure.city}</strong> (${trip.departure.country_code}) 
      <img class="saved-flag" src="${trip.departure.flag}" alt="flag">
    </a>

    &#8594; 

    <a class="saved-map" href="${trip.destination.map}" target="_blank">
      <strong>${trip.destination.city}</strong> (${trip.destination.country_code})
      <img class="saved-flag" src="${trip.destination.flag}" alt="flag">
    </a>
  `;
  // Add start and end dates (trip's length) - a number of days between trip start date and current date
  templateCopy.querySelector('.saved-dates').innerHTML = `
    <strong> ${formatDate(trip.startDate)} </strong> 
    &#8211;  
    <strong> ${formatDate(trip.endDate)} </strong> (${trip.daysLength} days) <br>
    <p class="saved-day-to-go-text"><em>${daysToGoText(trip.daysToGo)}</em></p>
  `;
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
      }
      else if (trip.daysToGo == 0) {
        return `Today! Are You Ready?`;
      }
      else {
        return `Your trip was ${trip.daysToGo * -1} days ago!`;
      };
    };
  // Add destination details
  templateCopy.querySelector('.saved-destination-details').innerHTML = `
    <strong>Population: </strong>${trip.destination.city_population};&nbsp; 
    <strong>Language: </strong>${trip.destination.language};&nbsp;
    <strong>Currency: </strong>${trip.destination.currency} (${trip.destination.currency_name});&nbsp;
    <strong>Capital: </strong>${trip.destination.capital}
  `;
  // Calculate current time (destination)
  calculateCurrentTime(trip);
  // Add current time (destination)
  templateCopy.querySelector('.saved-current-time').innerHTML = `
    <strong>Current time: </strong>&nbsp;<span class="current-time">${trip.time.current_time}</span> (${trip.time.abbreviation}: ${changeGmtOffSet(trip.time.gmtOffset)})
  `;
    // Function to add GmtOffSet text
    function changeGmtOffSet (gmtOffset) {
      // If gmtOffset > 0, add "+" sign, otherwise no need "+" sign
      if (gmtOffset > 0) {
        return `UTC +${gmtOffset}:00`;
      } else {
        return `UTC ${gmtOffset}:00`;
      };
    };
  // Add historic weather in destination
  templateCopy.querySelector('.saved-weather-historical').innerHTML = `
    <table class="historical-weather-table">
      <tr>
        <th>Start Date</th>
        <th>End Date</th>
      </tr>
      <tr>
        <td>${trip.startDateLastYear_weather.temp}, uv = ${trip.startDateLastYear_weather.uv},&nbsp; rh = ${trip.startDateLastYear_weather.humidity}, wind = ${trip.startDateLastYear_weather.wind_speed} (${trip.startDateLastYear_weather.wind_dir}), ${trip.startDateLastYear_weather.description} <img class="saved-weather-icon" src="${trip.startDateLastYear_weather.icon}" alt="weather icon"></td>
        <td>${trip.endDateLastYear_weather.temp}, uv = ${trip.endDateLastYear_weather.uv},&nbsp; rh = ${trip.endDateLastYear_weather.humidity}, wind = ${trip.endDateLastYear_weather.wind_speed} (${trip.endDateLastYear_weather.wind_dir}), ${trip.endDateLastYear_weather.description} <img class="saved-weather-icon" src="${trip.endDateLastYear_weather.icon}" alt="weather icon"></td>
      </tr>
    </table>
  `;
  // Update current weather for saved trips from the Local Storage (if weather date does not equal to current date)
  if (trip.status === 'current') {
    let id = trip.id;
    refreshCurrentWeather(id);
  };
  // Add current weather in destination
  templateCopy.querySelector('.saved-weather-current').innerHTML = `
    ${trip.current_weather.temp}, uv = ${trip.current_weather.uv}, rh = ${trip.current_weather.humidity}, wind = ${trip.current_weather.wind_speed} (${trip.current_weather.wind_dir}), 
    <span class="saved-weather-current-description">
      ${trip.current_weather.description} 
      <img class="saved-weather-icon" src="${trip.current_weather.icon}" alt="weather icon">
    </span>
  `;
  // Remove class = "hide" from "saved-destination-info" <div> for trip.status = "current"
  if (trip.status === 'current') {
    templateCopy.querySelector('.saved-destination-info').classList.remove('hide');
  };
  // Remove current time and current weather from "saved-destination-info" <div> for trip.status = "archived"
  if (trip.status === 'archived') {
    templateCopy.querySelector('.saved-current-time').remove();
    templateCopy.querySelector('.saved-weather-current').previousSibling.remove();
    templateCopy.querySelector('.saved-weather-current').remove();
  };
  // Add Event Listener to show or hide destination info when click on "show-destination-info" <button> in the saved trip
  templateCopy.querySelector('.show-destination-info').addEventListener('click', showDestinationInfo);
  // Alternative way with setting HTML attribute onclick to button
  // templateCopy.querySelector('.show-destination-info').onclick = showDestinationInfo;
  // Function to show or hide destination info when click on "show-destination-info" <button> in the saved trip
  function showDestinationInfo(event) {
    event.preventDefault();
    // Set variable to store ID for "saved-trip-container" <article> for the saved trip
    let savedTripId = this.parentElement.parentElement.parentElement.id;
    // Set variable to store "saved-destination-info" <div> for the saved trip
    let destinationInfoDiv = this.parentElement.nextSibling;
    // Check if "saved-destination-info" <div> have class = "hide"
    if(!destinationInfoDiv.classList.contains('hide')) {
      // Clear Interval for rendering of real time for the saved trip
      clearInterval(destinationInfoDiv._someInterval);
    };
    // Check if "saved-destination-info" <div> has class="hide"
    if (destinationInfoDiv.classList.contains('hide')) {
      // Change background-image in "show-destination-info" button when click on it
      this.firstChild.style.backgroundImage = 'url("http://localhost:8080/show-info.png")';
      // Remove class="hide" from "saved-destination-info" <div> when click on "show-destination-info" <button> in the saved trip
      destinationInfoDiv.classList.remove('hide');
      // Smoothly scrolls to "saved-destination-info" <div> in the saved trip
      destinationInfoDiv.scrollIntoView(false, {
        behavior: 'smooth',
        block: 'end'
      });
      // Set Interval for rendering of real time for the saved trip
      destinationInfoDiv._someInterval = setInterval(renderCurrentTime, 1000, savedTripId);
      // Function to refresh current weather for saved trip from the Local Storage
      refreshCurrentWeather(savedTripId);
      // Update HTML
      // Add current weather in destination
      this.parentElement.parentElement.parentElement.querySelector('.saved-weather-current').innerHTML = `
        ${trip.current_weather.temp}, uv = ${trip.current_weather.uv}, rh = ${trip.current_weather.humidity}, wind = ${trip.current_weather.wind_speed} (${trip.current_weather.wind_dir}), 
        <span class="saved-weather-current-description">
          ${trip.current_weather.description} 
          <img class="saved-weather-icon" src="${trip.current_weather.icon}" alt="weather icon">
        </span>
      `;
    } else {
      // Change background-image in "show-destination-info" <button> when click on it
      this.firstChild.style.backgroundImage = 'url("http://localhost:8080/open-info.png")';
      // Add class="hide" to "saved-destination-info" <div> when click on "show-destination-info" <button> in the saved trip
      destinationInfoDiv.classList.add('hide');
      // Smoothly scrolls to "saved-trip-btns" <div> in the saved trip
      this.parentElement.scrollIntoView(false, {
        behavior: 'smooth',
        block: 'end'
      });
    };
  };
  // Add Event Listener to delete the saved trip when click on "saved-remove-btn" <button> in the saved trip
  templateCopy.querySelector('.saved-remove-btn').addEventListener('click', deleteSavedTrip);
  // Function to delete the saved trip when click on "saved-remove-btn" <button> in the saved trip
  function deleteSavedTrip(event) {
    event.preventDefault();
    // Set variable to store saved trips from the Local Storage (construct the JavaScript value or object described by the string)
    let savedTripArray = JSON.parse(localStorage.getItem('trips'));
    // Execute a provided function once for each array element
    savedTripArray.forEach((trip) => {
      // Set variable to store <div> with saved trip
      let savedTripContainer = this.parentElement.parentElement.parentElement;
      // Check if saved trip ID equals to <div> ID (with saved trip)
      if (trip.id == savedTripContainer.id) {
        // Delete saved trip
        savedTripArray.splice(savedTripArray.indexOf(trip), 1);
        // Set the Local Storage to the new, updated value
        localStorage.setItem('trips', JSON.stringify(savedTripArray));
        // Log with deleted saved trip
        console.log('Delete trip: ', trip);
        // Log with updated saved trips from the Local Storage
        console.log('Updated saved trips: ', savedTripArray);
        // Remove "saved-trip-container" <div> with deleted saved trip from the DOM
        savedTripContainer.remove();
        // Hide empty saved trip <div>
        hideEmptyDivs();
      };
    });
  };
  // Set variable to store <div> to save trip based on the trip.status
  let savedTripDiv = selectDiv();
  // Function to select <div> to save trip based on the trip.status
  function selectDiv() {
    if (trip.status === 'current') {
      return document.querySelector('#current-container');
    } else if (trip.status === 'upcoming') {
      return document.querySelector('#upcoming-container');
    } else {
      return document.querySelector('#archived-container');
    };
  };
  // Remove class = "hide" from <div> with saved trips container
  savedTripDiv.parentElement.classList.remove('hide');
  // Insert templateCopy to the end of the list of children <div> with saved trips (based on the trip.status)
  savedTripDiv.appendChild(templateCopy);
  // Hide empty saved trip <div>
  hideEmptyDivs();
};

// Function to hide empty saved trip <div>
function hideEmptyDivs() {
  // Set variable for saved trips containers
  let savedTripsContainer = document.querySelectorAll('#saved-trips > div > div');
  // Loop through saved trips containers array to find empty saved trips container (without saved trips) -> hide this container
  for (let i = 0; i < savedTripsContainer.length; i++) {
    // Check if number on child elements in saved trips container = 0 (there are no saved trips in this container)
    if (savedTripsContainer[i].childElementCount === 0) {
      // Add class "hide" for parent element of this container
      savedTripsContainer[i].parentElement.classList.add('hide');
      // Add class "hide" for <hr> which is next to parent element of this container
      savedTripsContainer[i].parentElement.nextElementSibling.classList.add('hide');
    } else {
      // Remove class "hide" for parent element of this container
      savedTripsContainer[i].parentElement.classList.remove('hide');
      // Remove class "hide" for <hr> which is next to parent element of this container
      savedTripsContainer[i].parentElement.nextElementSibling.classList.remove('hide');
    };
  };
};

// Export js file
export { 
  renderSavedTripTemplate,
  hideEmptyDivs
};