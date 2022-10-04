// Import js file
import { renderSavedTripTemplate } from './renderSaveTripTemplate';

// Function to display all saved trips from Local Storage
const renderSavedTrips = () => {
  // Set variable to store saved trips in an array
  let savedTripArray = [];
  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = []
  };

  // Function to sort saved trips by their start date, destination city and departure city
  const sortSavedTrips = (savedTrip1, savedTrip2) => (new Date(savedTrip1.startDate) - new Date(savedTrip2.startDate) || savedTrip1.destination.city.localeCompare(savedTrip2.destination.city) || savedTrip1.departure.city.localeCompare(savedTrip2.departure.city));
  // Update savedTripArray with sorted saved trips
  savedTripArray = savedTripArray.sort(sortSavedTrips);

  // Create "saved-trip-container" div for each saved trip from Local Storage
  savedTripArray.forEach(renderSavedTripTemplate);

  // Log with saved trip data from Local Storage
  console.log('Saved trips from Local Storage:', savedTripArray);
};

// Export js file
export { renderSavedTrips };