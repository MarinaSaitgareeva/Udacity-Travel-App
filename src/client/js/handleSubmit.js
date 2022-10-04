// Import js file
import { postTripInfo } from './postTripInfo';
import { displayNewSearch } from './displayNewSearch';

// Function to handle a new search submit
async function handleSubmit(event) {
  event.preventDefault();

  // Set variables for inputs (departure, destination, startDate, endDate) from the form filed by user
  let departure = document.querySelector('#departure').value;
  let destination = document.querySelector('#destination').value;
  let startDate = document.querySelector('#start-date').value;
  let endDate = document.querySelector('#end-date').value;

  // Store form inputs in object for sending to server
  let formInputs = {
    departure: departure,
    destination: destination,
    startDate: startDate,
    endDate: endDate,
  };
  // console.log(departure, destination, startDate, endDate);

  // Post the search result back to the Express server
  trip = await postTripInfo(formInputs).then((response) => {
    // console.log(response);
    // Then render the returned result in the UI (add search result to "trip-result" div)
    displayNewSearch(response);
    return response;
  });
};

// Export js file
export { handleSubmit };