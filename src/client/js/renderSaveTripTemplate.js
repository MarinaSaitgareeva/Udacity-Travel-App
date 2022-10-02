// Create variable to render save trip template
const renderSavedTripTemplate = (trip) => {
  // Create variable to store "saved-trip-template" with all content inside of it
  let template = document.querySelector('#saved-trip-template').content;
  // Create variable to clone "saved-trip-template" with all content inside of it
  let templateCopy = template.cloneNode(true); // cloneNode is used to clone a node from current document
  // Alternative way
  // let templateCopy = document.importNode(template, true); //   importNode is used to clone a node from another document

  // Create variable for "saved-trip-container" to set ID
  let savedTriContainer = templateCopy.firstElementChild;
  // Set ID for saved-trip-container
  savedTriContainer.id = trip.id;

  // Add image of destination city / capital / country
  templateCopy.querySelector('.saved-destination-photo').src = trip.image;

  // Add image caption
  templateCopy.querySelector('.saved-destination-photo-caption').textContent = trip.image_figcaption;

  // Add departure and destination
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

  // Add start and end date (trip's length) - daysToGo
  templateCopy.querySelector('.saved-dates').innerHTML = `
    <strong> ${formatDate(trip.startDate)} </strong> 
    &#8211;  
    <strong> ${formatDate(trip.endDate)} </strong> (${trip.daysLength} days) <br>
    <em class="saved-day-to-go-text">${daysToGoText(trip.daysToGo)}</em>
  `;
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

  // Add historic weather
  templateCopy.querySelector('.saved-weather-historical').innerHTML = `
   ${trip.weather.historical_temperature}, uv = ${trip.weather.historical_uv},&nbsp; rh = ${trip.weather.historical_humidity}, wind = ${trip.weather.historical_wind_speed} (${trip.weather.historical_wind_direction}),
  <span class="saved-weather-historical-description">
    ${trip.weather.historical_description} 
    <img class="saved-weather-icon" src="${trip.weather.historical_icon}" alt="weather icon">
  </span>
  `;

  // Add current weather
  templateCopy.querySelector('.saved-weather-current').innerHTML = `
  ${trip.weather.current_temperature}, uv = ${trip.weather.current_uv}, rh = ${trip.weather.current_humidity}, wind = ${trip.weather.current_wind_speed} (${trip.weather.current_wind_direction}), 
  <span class="saved-weather-current-description">
    ${trip.weather.current_description} 
    <img class="saved-weather-icon" src="${trip.weather.current_icon}" alt="weather icon">
  </span>
  `;

  // Add Event Listener to show or hide destination info when click on "show-destination-info" button in saved trip
  templateCopy.querySelector('.show-destination-info').addEventListener('click', showDestinationInfo);
  // ALternative way with setting HTML attribute onclick to button
  // templateCopy.querySelector('.show-destination-info').onclick = showDestinationInfo;

  function showDestinationInfo(event) {
    event.preventDefault();
    if (this.parentElement.nextSibling.classList.contains('hide')) {
      // Change background-image in "show-destination-info" button when click on it
      this.firstChild.style.backgroundImage = 'url("http://localhost:8080/show-info.png")';
      // Remove class="hide" from "saved-destination-info" div when click on "show-destination-info" button in saved trip
      this.parentElement.nextSibling.classList.remove('hide');
      // Smoothly scrolls to "saved-destination-info" div in saved trip
      this.parentElement.nextSibling.scrollIntoView(false, {
        behavior: 'smooth',
        block: 'end'
      });
    } else {
      // Change background-image in "show-destination-info" button when click on it
      this.firstChild.style.backgroundImage = 'url("http://localhost:8080/open-info.png")';
      // Add class="hide" to "saved-destination-info" div when click on "show-destination-info" button in saved trip
      this.parentElement.nextSibling.classList.add('hide');
      // Smoothly scrolls to "saved-trip-btns" div in saved trip
      this.parentElement.scrollIntoView(false, {
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Create variable to store "saved-trips" <section>
  let savedTrips = document.querySelector('#saved-trips');
  // Insert clone of saved-trip-template to "saved-trips" section before the first child of this section
  savedTrips.appendChild(templateCopy);

  // Add Event Listener to delete saved trip when click on "saved-remove-btn" button
  // templateCopy.querySelector('.saved-remove-btn').addEventListener('click', deleteSavedTrip);

  // function deleteSavedTrip(event) {
  //   event.preventDefault();
  //   let trips = JSON.parse(localStorage.trips);
  //   console.log(trips);
  //   trips.forEach((trip) => {
  //     trips.splice(trips.indexOf(trip), 1);
  //     localStorage.trips = JSON.stringify(trips);
  //     console.log(trips);
  //     let savedTriContainer = this.parentElement.parentElement.parentElement;
  //     savedTriContainer.classList.add('hide');
  //     });
  // };

  // Smoothly scrolls to Div with saved trip
  // document.querySelector('#${trip.id}').scrollIntoView(false, {
  //   behavior: 'smooth',
  //   block: 'end'
  // });
};


// Export js file
export { renderSavedTripTemplate };