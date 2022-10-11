// Import js files
import { setMinAttributeToDate } from './js/setMinAttributeToDate';
import { handleSubmit } from './js/handleSubmit';
import { refreshApiData } from './js/refreshApiData';
import { renderSavedTrips } from './js/renderSavedTrips';
import { deleteAllSavedTrips } from './js/deleteAllSavedTrips';

// Import style sass files
import './styles/index.scss'

// Set attribute "min" = current date to start-date and end-date, display all saved trips from Local Storage when the HTML document has been completely parsed
document.addEventListener('DOMContentLoaded', () => {
  // Function to set attribute "min" = current date to start-date and end-date
  setMinAttributeToDate();
  // Function to refresh all saved trips data from Local Storage
  // refreshApiData();
  // Function to display all saved trips from Local Storage
  renderSavedTrips();
});

// Add Event Listener to "search-form-btn" <button> on click to display search result in "trip-result" <section>
document.querySelector('#search-form-btn').addEventListener('click', handleSubmit);

// Add Event Listener to "add-btn" <button> on click to smoothly scroll to "trip-search" <section>
document.querySelector('#add-btn').addEventListener('click', function scrollToSearchResult() {
  // Smoothly scrolls to "trip-search" <section>
  document.querySelector('#trip-search').scrollIntoView(false, {
    behavior: 'smooth',
    block: 'end'
  });
});

// Set variable to store all "delete-btn" <button> in each saved trip containers
const deleteAllBtns = document.querySelectorAll('.delete-btn');
// Add Event Listener to each "delete-btn" <button>
deleteAllBtns.forEach(deleteAllBtn => deleteAllBtn.addEventListener('click', deleteAllSavedTrips));

// Export js files
export {
  setMinAttributeToDate,
  handleSubmit,
  refreshApiData,
  renderSavedTrips,
  deleteAllSavedTrips
}