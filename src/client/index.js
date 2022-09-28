// Import js files
import { setMinAttributeToDate } from './js/setMinAttributeToDate';
import { handleSubmit } from './js/handleSubmit';


// Import style sass files
import './styles/index.scss'

// Set attribute "min" = current date to start-date and end-date
document.addEventListener('DOMContentLoaded', setMinAttributeToDate);

// Add Event Listener to search button
document.querySelector('#search-form-btn').addEventListener('click', handleSubmit);

// // Add Event Listener to new button
// document.querySelector('#add-btn').addEventListener('click', function addNewTrip() {
//   // Smoothly scrolls to Div with results
//    document.querySelector('#trip-search').scrollIntoView(false, {
//     behavior: 'smooth',
//     block: 'end'
//   });
// });

// Export js files
export {
  setMinAttributeToDate,
  handleSubmit
}