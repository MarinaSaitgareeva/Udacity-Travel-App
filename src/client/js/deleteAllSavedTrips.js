// Import js files
import { renderSavedTripTemplate } from './renderSaveTripTemplate';

// Function to delete all saved trips with specific trip's status from the Local Storage
function deleteAllSavedTrips (event) {
  event.preventDefault();
  // Set variable to store ID of parent <div> of <button>
  let tripStatus = this.parentElement.id;
  // Set variable to store saved trips from the Local Storage (construct the JavaScript value or object described by the string)
  let savedTripArray = JSON.parse(localStorage.trips);
  // Filter saved trips array from the Local Storage based on "key" = status of saved trips and "value" = ID of parent <div> of <button>
  savedTripArray = filteredArray(savedTripArray, 'status', tripStatus);
    // Function to filter array based on key and value
    function filteredArray(array, key, value) {
      // Set variable to store new array
      const newArray = [];
      // For loop objects in array
      for (let i = 0, l = array.length; i < l; i++) {
        // Find objects in array with key not equal value
        if (array[i][key] !== value) {
          // Add these saved trips to array
          newArray.push(array[i]);
        };
      };
    // Return updated array with filtered objects based on key and value
    return newArray;
    };

  // Set the Local Storage to the new, updated value
  localStorage.setItem('trips', JSON.stringify(savedTripArray));

  // Clear "saved-trips" div
  document.querySelector('#' + tripStatus + '-container').textContent = '';

  // Function to display all saved trips from the updated Local Storage
  savedTripArray.forEach(renderSavedTripTemplate);

  // Log with deleted saved trip status
  console.log('Delete: all', tripStatus, 'trips');
  // Log with updated saved trips array from the Local Storage
  console.log('Updated saved trips: ', savedTripArray);
};

// Export js file
export { deleteAllSavedTrips };