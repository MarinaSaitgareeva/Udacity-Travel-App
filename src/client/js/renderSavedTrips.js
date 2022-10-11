// Import js file
import { calculateDaysToGo } from './calculateDaysToGo';
import { updateInvalidImageUrl, renderCurrentTime } from './refreshApiData'
import { renderSavedTripTemplate, hideEmptyDivs } from './renderSaveTripTemplate';

// Function to display all saved trips from Local Storage
const renderSavedTrips = () => {
  // Set variable to store saved trips in an array
  let savedTripArray = [];
  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = [];
  };
  // Hide empty saved trip <div>
  hideEmptyDivs();
  // Update a number of days between trip start date and current date for each saved trip from Local Storage
  savedTripArray.forEach(calculateDaysToGo);
  // Update ID for each saved trip from Local Storage
  savedTripArray.forEach((trip) => {
    return trip.id = trip.daysToGo + '-' + trip.destination.city.replace(/ /g,'') + '-' + trip.departure.city.replace(/ /g,'');
    // Replace spaces " " in name of city and country with underscore "_"
    // city = city.replace(/ /g,'');
  });
  // Add "status" for save trip
  savedTripArray.forEach((trip) => {
    trip.status = statusText(trip.daysToGo);
    // Function to add text in "status" for save trip
    function statusText () {
      if (trip.daysToGo > 0) {
        return trip.status = 'upcoming';
      } else if (trip.daysToGo == 0) {
        return trip.status = 'current';
      } else {
        return trip.status = 'archived';
      }
    };
  });
  // Update saved trip image url if image was deleted from the previously fetch Pixabay API url
  updateInvalidImageUrl();
  // Function to sort saved trips by their start date, destination city and departure city
  const sortSavedTrips = (savedTrip1, savedTrip2) => (new Date(savedTrip1.startDate) - new Date(savedTrip2.startDate) || savedTrip1.destination.city.localeCompare(savedTrip2.destination.city) || savedTrip1.departure.city.localeCompare(savedTrip2.departure.city));
  // Update savedTripArray with sorted saved trips
  savedTripArray = savedTripArray.sort(sortSavedTrips);
  // Update saved trips in Local Storage
  localStorage.setItem('trips', JSON.stringify(savedTripArray));
  // Create "saved-trip-container" <article> for each saved trips from the Local Storage
  savedTripArray.forEach(renderSavedTripTemplate);
  // Call a function renderCurrentTime for saved trips from the Local Storage with status = "current" at specified intervals (each 5 seconds)
  savedTripArray.forEach((trip) => {
    if (trip.status === 'current') {
      let id = trip.id;
      setInterval(renderCurrentTime, 1000, id);
    };
  });
  // Log with saved trips array from the Local Storage
  console.log('Saved trips from Local Storage:', savedTripArray);
};

// Export js file
export { renderSavedTrips };