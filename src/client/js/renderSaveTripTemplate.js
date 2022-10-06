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
        return `Your trip was ${trip.daysToGo * -1} days ago!`
      }
    };

  // Add destination details
  templateCopy.querySelector('.saved-destination-details').innerHTML = `
    <strong>Population: </strong>${trip.destination.city_population};&nbsp; 
    <strong>Language: </strong>${trip.destination.language};&nbsp;
    <strong>Currency: </strong>${trip.destination.currency};&nbsp;
    <strong>Capital: </strong>${trip.destination.capital}
  `;

  // Add current time (destination)
  templateCopy.querySelector('.saved-current-time').innerHTML = `
    <strong>Current time: </strong>&nbsp;${trip.time.current_time} (${trip.time.abbreviation}: ${trip.time.gmtOffset})
  `;

  // Add historic weather in destination
  templateCopy.querySelector('.saved-weather-historical').innerHTML = `
   ${trip.weather.historical_temperature}, uv = ${trip.weather.historical_uv},&nbsp; rh = ${trip.weather.historical_humidity}, wind = ${trip.weather.historical_wind_speed} (${trip.weather.historical_wind_direction}),
  <span class="saved-weather-historical-description">
    ${trip.weather.historical_description} 
    <img class="saved-weather-icon" src="${trip.weather.historical_icon}" alt="weather icon">
  </span>
  `;

  // Add current weather in destination
  templateCopy.querySelector('.saved-weather-current').innerHTML = `
  ${trip.weather.current_temperature}, uv = ${trip.weather.current_uv}, rh = ${trip.weather.current_humidity}, wind = ${trip.weather.current_wind_speed} (${trip.weather.current_wind_direction}), 
  <span class="saved-weather-current-description">
    ${trip.weather.current_description} 
    <img class="saved-weather-icon" src="${trip.weather.current_icon}" alt="weather icon">
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
    // Check if "saved-destination-info" <div> has class="hide"
    if (this.parentElement.nextSibling.classList.contains('hide')) {
      // Change background-image in "show-destination-info" button when click on it
      this.firstChild.style.backgroundImage = 'url("http://localhost:8080/show-info.png")';
      // Remove class="hide" from "saved-destination-info" <div> when click on "show-destination-info" <button> in the saved trip
      this.parentElement.nextSibling.classList.remove('hide');
      // Smoothly scrolls to "saved-destination-info" <div> in the saved trip
      this.parentElement.nextSibling.scrollIntoView(false, {
        behavior: 'smooth',
        block: 'end'
      });
    } else {
      // Change background-image in "show-destination-info" <button> when click on it
      this.firstChild.style.backgroundImage = 'url("http://localhost:8080/open-info.png")';
      // Add class="hide" to "saved-destination-info" <div> when click on "show-destination-info" <button> in the saved trip
      this.parentElement.nextSibling.classList.add('hide');
      // Smoothly scrolls to "saved-trip-btns" <div> in the saved trip
      this.parentElement.scrollIntoView(false, {
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Add Event Listener to delete the saved trip when click on "saved-remove-btn" <button> in the saved trip
  templateCopy.querySelector('.saved-remove-btn').addEventListener('click', deleteSavedTrip);

  // Function to delete the saved trip when click on "saved-remove-btn" <button> in the saved trip
  function deleteSavedTrip(event) {
    event.preventDefault();
    // Set variable to store saved trips from the Local Storage (construct the JavaScript value or object described by the string)
    let savedTripArray = JSON.parse(localStorage.trips);
    // Execute a provided function once for each array element
    savedTripArray.forEach((trip) => {
      // Set variable to store <div> with saved trips (based on the trip.status)
      let savedTriContainer = this.parentElement.parentElement.parentElement;
      // Check if saved trip ID equals to <div> ID (with saved trips (based on the trip.status))
      if (trip.id == savedTriContainer.id) {
        // Delete saved trip
        savedTripArray.splice(savedTripArray.indexOf(trip), 1);
        // Set the Local Storage to the new, updated value
        localStorage.setItem('trips', JSON.stringify(savedTripArray));
        // Log with deleted saved trip
        console.log('Delete trip: ', trip);
        // Log with updated saved trips from the Local Storage
        console.log('Updated saved trips: ', savedTripArray);
        // Remove "saved-trip-container" <div> with deleted saved trip from the DOM
        savedTriContainer.remove();
        // Hide empty saved trip <div>
        hideEmptyDivs();
      };
    });
  };

  // Set variable to store <div> to save trip based on the trip.status
  let savedTripsDiv = selectDiv();
  // Function to select <div> to save trip based on the trip.status
  function selectDiv() {
    if (trip.status === 'current') {
      return document.querySelector('#current-container')
    } else if (trip.status === 'upcoming') {
      return document.querySelector('#upcoming-container')
    } else {
      return document.querySelector('#archived-container')
    };
  };

  // Remove class = "hide" from <div> with saved trips container
  savedTripsDiv.parentElement.classList.remove('hide');

  // Insert templateCopy to the end of the list of children <div> with saved trips (based on the trip.status)
  savedTripsDiv.appendChild(templateCopy);

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