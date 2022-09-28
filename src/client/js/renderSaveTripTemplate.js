// Import js file
import { formatDate, daysToGoText } from './displayNewSearch';

// This function will render the trips details in a card format
const renderSavedTripTemplate = (
  trip,
  savedTripId,
  save = true
) => {
  return `
    <div class="saved-trip-photo-and-add-info">
      <img id="saved-trip-destination-photo" src="${trip.image}" alt="destination photo">

      <button class="add-info-btn" type="submit">
      <div class="add-info-btn-img"></div>
      add lodging info
      </button>

      <button class="add-info-btn" type="submit">
      <div class="add-info-btn-img"></div>
      add packing list
      </button>

      <button class="add-info-btn" type="submit">
      <div class="add-info-btn-img"></div>
      add notes
      </button>
    </div>

    <div class="saved-trip-trip-details">
      <p id="destination-and-departure">

        <strong>Route: </strong>from 
        <strong>
          <a class="map" href="${trip.departure.map}" target="_blank">
            ${trip.departure.city} (${trip.departure.country_code}) 
            <img class="flag" src="${trip.departure.flag}" alt="flag">
          </a>

        </strong>
         to 
        <strong>
          <a class="map" href="${trip.destination.map}" target="_blank">
            ${trip.destination.city} (${trip.destination.country_code})
            <img class="flag" src="${trip.destination.flag}" alt="flag"
          </a>
        </strong>
      </p>

      <p id="start-and-end-date">
        <strong>Dates: </strong>from <strong> ${formatDate(trip.startDate)} </strong> till <strong> ${formatDate(trip.endDate)} </strong> (${trip.daysLength} days) - <em style="color: #faaa54;">${daysToGoText(trip.daysToGo)}</em>
      </p>

        <div id="destination-info">
          <strong>Destination info:</strong>
          <div id="destination-details">
            <p>
              <strong>Population: </strong>${trip.destination.city_population};&nbsp; &nbsp; 
              <strong>Language: </strong>${trip.destination.language};&nbsp; &nbsp; 
              <strong>Currency: </strong>${trip.destination.currency};&nbsp; &nbsp; 
              <strong>Capital: </strong>${trip.destination.capital}
             </p>
          </div>

          <p id="current-time">
            <strong>Current time: </strong>&nbsp;${trip.time.current_time} (${trip.time.abbreviation}: ${trip.time.gmtOffset})
          </p>

          <div id="weather">
            <p><strong>Weather Forecast </strong><i id="weather-assumption">(based on historical data of previous year) </i> : </p>
            <p>${trip.weather.historical_temperature} (feel likes = ${trip.weather.historical_feels_like_temperature}),</p>
            <p>uv = ${trip.weather.historical_uv},&nbsp; rh = ${trip.weather.historical_humidity},</p>
            <p>wind = ${trip.weather.historical_wind_speed} (${trip.weather.historical_wind_direction})</p>
            <p id="weather_historical_description">
              ${trip.weather.historical_description} 
              <img id="weather-icon" src="${trip.weather.historical_icon}" alt="weather icon">
            </p>
          
            <p><strong>Current Weather: </strong></p>
            <p id="weather_current">${trip.weather.current_temperature}, uv = ${trip.weather.current_uv}, rh = ${trip.weather.current_humidity}, wind = ${trip.weather.current_wind_speed} (${trip.weather.current_wind_direction}), ${trip.weather.current_description} <img id="weather-icon" src="${trip.weather.current_icon}" alt="weather icon"></p>
          </div>
        </div>
       
        <div id="search-form-btns">
          <button id="search-form-remove-btn" data-trip-id=${savedTripId} type="submit" onclick="removeTrip()">
            <div id="remove-btn-img"></div>
            remove trip
          </button>
        </div>
      </div>
    </section>
  `
};

// Export js file
export { renderSavedTripTemplate };