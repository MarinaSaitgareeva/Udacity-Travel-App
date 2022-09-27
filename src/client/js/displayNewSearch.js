// Function for search result
export const displayNewSearch = (trip) => {

  // New departure and destination
  document.querySelector('#destination-and-departure').innerHTML = `<strong>Route: </strong>from <strong><a class="map" href="${trip.departure.map}" target="_blank">${trip.departure.city} (${trip.departure.country_code}) <img class="flag" src="${trip.departure.flag}" alt="flag"></a></strong> to <strong><a class="map" href="${trip.destination.map}" target="_blank">${trip.destination.city} (${trip.destination.country_code}) <img class="flag" src="${trip.destination.flag}" alt="flag"></a></strong>`;
  
  // New start and end date (trip's length) - daysToGo
  document.querySelector('#start-and-end-date').innerHTML = `<strong>Dates: </strong>from <strong> ${trip.startDate} </strong> till <strong> ${trip.endDate} </strong> (${trip.daysLength} days) - <em style="color: #faaa54;">${daysToGoText(trip.daysToGo)}</em>`;

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
      <strong>Capital city: </strong>${trip.destination.capital}
    </p>`;

    document.querySelector('#current-time').innerHTML = `<strong>Current time: </strong>${trip.time.current_time} (${trip.time.abbreviation}: ${trip.time.gmtOffset})`;

  // New weather
  document.querySelector('#weather').innerHTML = `
    <p>The <strong>weather</strong> probably will be (based on historical data):</p>
    <p>${trip.weather.historical_temperature} (feel likes = ${trip.weather.historical_feels_like_temperature}),</p>
    <p>uv = ${trip.weather.historical_uv},</p>
    <p>wind = ${trip.weather.historical_wind_speed} (${trip.weather.historical_wind_direction})</p>
    <p id="weather_historical_description">${trip.weather.historical_description}</p>
    <img id="weather-icon" src="${trip.weather.historical_icon}" alt="weather icon">`;

  // document.querySelector('#weather-icon').src = trip.weather.historical_icon;

  // New image
  document.querySelector('#destination-photo').src = trip.image;

  // Show search result
  document.querySelector('#trip-result').classList.remove('hide');

  // Hide search form after loading of result
  document.querySelector('#trip-search').style.display = 'none';
  document.querySelector('#trip-result').style.marginTop = '13.3rem';
};