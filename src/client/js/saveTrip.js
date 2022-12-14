// Import js file
import { calculateDaysToGo } from './calculateDaysToGo';
import { renderSavedTripTemplate, hideEmptyDivs } from './renderSaveTripTemplate';

// Function to save search result to "saved-trips" <section>
const saveTrip = () => {
  // Set variable for search result, get data from the Session Storage
  let searchResult = JSON.parse(sessionStorage.searchResult);
  // Add "daysToGo" a number of days between trip start date and current date
  searchResult.daysToGo = calculateDaysToGo(searchResult);
  // Add "status" for save trip
  searchResult.status = statusText(searchResult.daysToGo);
  // Function to add text in "status" for save trip
  function statusText () {
    if (searchResult.daysToGo > 0) {
      return searchResult.status = 'upcoming';
    } else if (searchResult.daysToGo == 0) {
      return searchResult.status = 'current';
    } else {
      return searchResult.status = 'archived';
    };
  };
  // Set variable for ID
  let id = searchResult.daysToGo + '-' + searchResult.destination.city.replace(/ /g,'') + '-' + searchResult.departure.city.replace(/ /g,'');
  // Replace spaces " " in name of city and country with underscore "_"
  // city = city.replace(/ /g,'');
  // Set "ID" for saved trip
  searchResult.id = id;
  // Set variable to store saved trips in an array
  let savedTripArray = [];
  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = [];
  };
  // Push new saved trip into the saved trip array
  savedTripArray.push(searchResult);
  // Function to sort saved trips by their start date, destination city and departure city
  const sortSavedTrips = (savedTrip1, savedTrip2) => (new Date(savedTrip1.startDate) - new Date(savedTrip2.startDate) || savedTrip1.destination.city.localeCompare(savedTrip2.destination.city) || savedTrip1.departure.city.localeCompare(savedTrip2.departure.city));
  // Update savedTripArray with sorted saved trips
  savedTripArray = savedTripArray.sort(sortSavedTrips);
  // Set the Local Storage to the new, updated value
  localStorage.setItem('trips', JSON.stringify(savedTripArray));
  // Clear "saved-trips" <div>
  document.querySelector('#current-container').textContent = '';
  document.querySelector('#upcoming-container').textContent = '';
  document.querySelector('#archived-container').textContent = '';
  // Create "saved-trip-container" <article> with saved trip's data for each saved trips from Local Storage
  savedTripArray.forEach(renderSavedTripTemplate);
  // Hide search result "trip-result" <section>
  document.querySelector('#trip-result').classList.add('hide');
  // Hide empty saved trip <div>
  hideEmptyDivs();
  // Log with saved trip data
  console.log('Save trip:', searchResult);
  // Log with updated saved trips array from the Local Storage
  console.log('Updated saved trips:', savedTripArray);
};

// Export js file
export { saveTrip };