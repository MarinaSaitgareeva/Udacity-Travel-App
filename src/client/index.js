// Import js files
import { setMinAttributeToDate } from './js/setMinAttributeToDate';
// import { checkUrl } from './js/urlChecker'
import { handleSubmit } from './js/handleSubmit';

// Import style sass files
import './styles/index.scss'

// Set attribute "min" = current date to start-date and end-date
document.addEventListener('DOMContentLoaded', setMinAttributeToDate);

// Add Event Listener to search button
document.querySelector('#search-form-btn').addEventListener('click', handleSubmit);

// Export js files
export {
  // checkUrl,
  handleSubmit
}