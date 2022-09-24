// Function for search result
export const displayNewSearch = (trip) => {

  // New departure
  // document.querySelector('#departure-name').textContent = `My trip from: ${trip.departure.city}, ${trip.departure.country}`;

  // New destination
  document.querySelector('#destination-name').textContent = `My trip from ${trip.departure.city}, ${trip.departure.country} to ${trip.destination.city}, ${trip.destination.country}`;
  // document.querySelector('#destination-name').textContent = `My trip to: ${trip.destination.city}, ${trip.destination.country}`;
  
  // New start date
  document.querySelector('#start-date-actual').textContent = `Dates: start ${trip.startDate}, end ${trip.endDate}`;

  // // New end date
  // document.querySelector('#end-date-actual').textContent = `End date: ${trip.endDate}`;

  // New daysToGo
  document.querySelector('#day-to-go').textContent = `${trip.daysToGo} days left`;

  // New trip's length
  document.querySelector('#day-length').textContent = `${trip.daysLength} days`;

  // New weather
  document.querySelector('#weather-info').textContent = `\n${trip.weather.temperature} C, ${trip.weather.description}`;
  document.querySelector('#weather-icon').src = trip.weather.icon;

  // New image
  document.querySelector('#destination-photo').src = trip.image;

  // Show search result
  document.querySelector('#trip-result').classList.remove('hide');
};