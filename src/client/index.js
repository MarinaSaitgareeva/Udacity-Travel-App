// Import js files
import { setMinAttributeToDate } from './js/setMinAttributeToDate';
import { handleSubmit } from './js/handleSubmit';



// Import style sass files
import './styles/index.scss'

// Set attribute "min" = current date to start-date and end-date
document.addEventListener('DOMContentLoaded', setMinAttributeToDate);

// Add Event Listener to search button
document.querySelector('#search-form-btn').addEventListener('click', handleSubmit);

// Add Event Listener to save and delete buttons
document.querySelector('#search-form-save-btn').addEventListener('click', performSave);
document.querySelector('#search-form-remove-btn').addEventListener('click', performRemove);

// Export js files
export {
  handleSubmit
}