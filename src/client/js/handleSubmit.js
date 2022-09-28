// Import js file
import { postTripInfo } from './postTripInfo';
import { displayNewSearch } from './displayNewSearch';

// Function that handles new search submit
async function handleSubmit(event) {
  event.preventDefault();

  // Get input from the form filed by user
  let departure = document.querySelector('#departure').value;
  let destination = document.querySelector('#destination').value;
  let startDate = document.querySelector('#start-date').value;
  let endDate = document.querySelector('#end-date').value;

  // Store form data in object for sending to server
  let formData = {
    departure: departure,
    destination: destination,
    startDate: startDate,
    endDate: endDate,
  };
  console.log(departure, destination, startDate, endDate);

  // Post the search results back to the Express server
  trip = await postTripInfo(formData).then((res) => {
    console.log(res);
    // Then render the returned result in the UI
    displayNewSearch(res);
    return res;
  });
};

// Export js file
export { handleSubmit };