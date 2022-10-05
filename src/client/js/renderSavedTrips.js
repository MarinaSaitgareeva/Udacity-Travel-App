// Import js file
import { calculateDaysToGo } from './calculateDaysToGo';
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
        return trip.status = 'upcoming'
      } else if (trip.daysToGo == 0) {
        return trip.status = 'current'
      } else {
        return trip.status = 'archived'
      }
    }
  });

  // Function to sort saved trips by their start date, destination city and departure city
  const sortSavedTrips = (savedTrip1, savedTrip2) => (new Date(savedTrip1.startDate) - new Date(savedTrip2.startDate) || savedTrip1.destination.city.localeCompare(savedTrip2.destination.city) || savedTrip1.departure.city.localeCompare(savedTrip2.departure.city));

  // Update savedTripArray with sorted saved trips
  savedTripArray = savedTripArray.sort(sortSavedTrips);

  // Update saved trips in Local Storage
  localStorage.setItem('trips', JSON.stringify(savedTripArray));

  // Log with saved trip data from Local Storage
  console.log('Saved trips from Local Storage:', savedTripArray);

  // Create "saved-trip-container" <article> for each saved trips from the Local Storage
  savedTripArray.forEach(renderSavedTripTemplate);

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
    }
  }
 

  // // Set variable to store upcoming saved trips in array
  // let savedTripArrayUpcoming = filteredArray (savedTripArray, 'status', 'upcoming');
  // // Create "saved-trip-container" <article> for each upcoming saved trip from Local Storage
  // savedTripArrayUpcoming.forEach(renderSavedTripUpcomingTemplate);

  // // Set variable to store upcoming saved trips in array
  // let savedTripArrayCurrent = filteredArray (savedTripArray, 'status', 'current');
  // // Create "saved-trip-container" <article> for each current saved trip from Local Storage
  // savedTripArrayCurrent.forEach(renderSavedTripTemplate);

  // // Set variable to store upcoming saved trips in array
  // let savedTripArrayArchived = filteredArray (savedTripArray, 'status', 'archived');
  // // Create "saved-trip-container" <article> for each archived saved trip from Local Storage
  // savedTripArrayArchived.forEach(renderSavedTripArchivedTemplate);

  // // Function to filter array based on key and value
  // function filteredArray(array, key, value) {
  //   const newArray = [];
  //   for (let i = 0, l = array.length; i < l; i++) {
  //     if (array[i][key] === value) {
  //       newArray.push(array[i]);
  //     }
  //   }
  //  return newArray;
  // }
};

// Export js file
export { renderSavedTrips };