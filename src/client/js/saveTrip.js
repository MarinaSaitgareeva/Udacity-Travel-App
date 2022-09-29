// Import js file
import { renderSavedTripTemplate } from './renderSaveTripTemplate';

// Function to save search result
export const saveTrip = async () => {
  let savedTrips = await getSavedTrips();
  const searchResult = await getSearchResult();

  postSaveTripInfo('/saveTripInfo', searchResult).then(async (savedTrip) => {
      // Put the object into local storage
      savedTrips = await getSavedTrips();
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));

      // Create div element for storing saved trip info
      const saveTripBox = document.createElement('div');
      saveTripBox.classList.add('saved-trip-container');
      saveTripBox.innerHTML = renderSavedTripTemplate(
          savedTrip,
          savedTrip.id
      );

      document.querySelector('#saved-trips').prepend(saveTripBox);

      // Show saved trips section
      document.querySelector('#saved-trips').classList.remove('hide');

      // Hide search result
      document.querySelector('#trip-result').classList.add('hide');
  });
};

// GET route for search result
const getSearchResult = async () => {
  const response = await fetch('/getTripInfo');
  const searchResult = await response.json();
  return searchResult;
};

// GET route for saved trips
const getSavedTrips = async () => {
  const response = await fetch('/getSavedTripInfo');
  const savedTrips = await response.json();
  return savedTrips;
};

const postSaveTripInfo = async (url = '', data = {}) => {
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  });
  return response.json();
};