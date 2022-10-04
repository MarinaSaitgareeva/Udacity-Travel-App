// Import js file
import { renderSavedTripTemplate } from './renderSaveTripTemplate';

// Function to save search result to "saved-trips" div
const saveTrip = async () => {
  // Set variable for search result, get data from the Express Server
  const searchResult = await getSearchResult();
  // Set variable for ID
  let id = searchResult.daysToGo + '-' + searchResult.destination.city.replace(/ /g,'') + '-' + searchResult.departure.city.replace(/ /g,'');
  // Replace spaces " " in name of city and country with underscore "_"
  // city = city.replace(/ /g,'');

  // Set ID for saved trips
  searchResult.id = id;

  // Log with saved trip data
  console.log('Save trip:', searchResult);

  // Set variable to store saved trips in an array
  let savedTripArray = [];

  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = []
  };

  // Create a Local Storage key called "trips", using JSON.stringify() to convert a data array to a string
  localStorage.setItem('trips', JSON.stringify(savedTripArray));

  // Push new saved trip into the array
  savedTripArray.push(searchResult);

  // Set the Local Storage to the new, updated value
  localStorage.setItem('trips', JSON.stringify(savedTripArray));

  // Function to sort saved trips by their start date, destination city and departure city
  const sortSavedTrips = (savedTrip1, savedTrip2) => (new Date(savedTrip1.startDate) - new Date(savedTrip2.startDate) || savedTrip1.destination.city.localeCompare(savedTrip2.destination.city) || savedTrip1.departure.city.localeCompare(savedTrip2.departure.city));

  // Update savedTripArray with sorted saved trips
  savedTripArray = savedTripArray.sort(sortSavedTrips);

  // Log with updated saved trips from Local Storage
  console.log('Updated saved trips:', savedTripArray);

  // Clear "saved-trips" div (delete rendered saved trips from Local Storage)
  document.querySelector('#saved-trips').innerHTML = '';

  // Create "saved-trip-container" div with saved trip's data for each saved trip in Local Storage
  savedTripArray.forEach(renderSavedTripTemplate);

  // Hide search result "trip-result" div
  document.querySelector('#trip-result').classList.add('hide');
};

// GET route for search result, fetch data from the Express Server
const getSearchResult = async () => {
  const response = await fetch('/tripInfo');
  // Extract a JSON object from the response
  return await response.json()
};

// Export js file
export { saveTrip };