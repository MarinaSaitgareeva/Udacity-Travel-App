// // Import js file
import { postTripInfo } from "./postTripInfo";

// Function to refresh API data
const refreshApiData = async () => {
  // Set variable to store saved trips in an array
  let savedTripArray = [];
  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = [];
  };
  // Set variable to store updated saved trips array
  let updatedSavedTripArray = [];

  for (let i = 0; i < savedTripArray.length; i++) {
    let savedTrip = savedTripArray[i];
    // Set variables for departure city, destination city, startDate and endDate
    let departure = savedTrip.departure.city;
    let destination = savedTrip.destination.city;
    let startDate = savedTrip.startDate;
    let endDate = savedTrip.endDate;
    // Store form inputs in object for sending to the server
    let formInputs = {
      departure: departure,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
    };
    // Post form inputs back to the Express server
    await postTripInfo(formInputs).then((response) => {
      // Save data to sessionStorage
      // sessionStorage.setItem('updatedSavedTrip', JSON.stringify(response));
      return updatedSavedTripArray.push(response);
    });
  };
  // Update savedTripArray
  savedTripArray = updatedSavedTripArray;
  // Update saved trips in Local Storage
  localStorage.setItem('trips', JSON.stringify(savedTripArray));
  // Log with saved trips array from the Local Storage
  console.log('Update API data in saved trips from the Local Storage:', savedTripArray);
};

// Function to update saved trip image url if image was deleted from the previously fetch Pixabay API url
const updateInvalidImageUrl = () => {
  // Set variable to store saved trips in an array
  let savedTripArray = [];
  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = [];
  };
  // For each saved trip from the Local Storage check image url and fetch new one, if it's invalid
  savedTripArray.forEach(async (trip) => {
    // Set variable to store image url for saved trips from the Local storage
    let imgUrl = trip.image;
    // Check if saved trip image url is valid
    let responseImg = await fetch(imgUrl);
    // If saved trip image url is invalid, need to fetch new image, image_figcaption and add them to the Local Storage
    if (responseImg.status === 400) {
      // Log with saved trip id from the Local Storage with invalid image url
      console.log('Invalid image URL: ', imgUrl, 'for saved trip: ', trip.id);
      // Set variables for destination: city, country, capital
      let destinationCity = trip.destination.city;
      let destinationCountry = trip.destination.country;
      let destinationCapital = trip.destination.capital;
      // Store variables in object for sending to the server
      let destinationData = {
        city: destinationCity,
        country: destinationCountry,
        capital: destinationCapital,
      };
      // Fetch Pixabay API for new image url and image_caption
      let response = await fetch('/images', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(destinationData)
      });
      // Set variable to store fetch image data for the saved trip
      let newImageData = await response.json();
      // Update image url and image_caption in saved trip
      trip.image = newImageData.image;
      trip.image_figcaption = newImageData.image_figcaption;
      // Update saved trips in the Local Storage
      localStorage.setItem('trips', JSON.stringify(savedTripArray));
      // Log with new image url
      console.log('New image URL: ', trip.image);
      // Log with saved trip id from the Local Storage with new image url and image_caption
      console.log('Update invalid image URL: ', trip.image, 'for saved trip: ', trip.id);
    };
  });
};

// Function to calculate current time for trip based on the UTC current time and saved trip's gmtOffset
function calculateCurrentTime (trip) {
  let gmtOffset = Number(trip.time.gmtOffset);
  let currentTimeDate = new Date();
  let hours = currentTimeDate.getUTCHours();
  hours = hours + gmtOffset;
  if (hours >= 24) {
    hours = hours - 24
  } else if (hours < 0) {
    hours = 24 - hours;
  };
  let minutes = currentTimeDate.getUTCMinutes();
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let AMPM = hours < 12 ? 'AM' : 'PM';
  if (hours === 12) {
    hours = 12;
  } else {
    hours = hours%12;
  };
  let currentTime = `${hours}:${minutes} ${AMPM}`;
  trip.time.current_time = currentTime.toString();
};

// Function to calculate current time for saved trip from the Local Storage based on saved trip ID
function renderCurrentTime(id) {
  // Set variable to store saved trips in an array
  let savedTripArray = [];
  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = [];
  };
  // Set variable to store saved trip which is selected based on it's ID from savedTripArray
  let selectedTrip = savedTripArray.find(array => array.id === id);
  // Function to calculate current time for trip based on the UTC current time and saved trip's gmtOffset
  calculateCurrentTime(selectedTrip);
  // Update saved trips in the Local Storage
  localStorage.setItem('trips', JSON.stringify(savedTripArray));
  // Set variable to store "saved-trip-container" <article> based on saved trip's ID
  let savedTripContainer = document.getElementById(id);
  // Update current time for the saved trip
  savedTripContainer.querySelector('.current-time').textContent = selectedTrip.time.current_time;
};

// Function to refresh current weather for saved trip from the Local Storage
async function refreshCurrentWeather(id) {
  // Set variable to store saved trips in an array
  let savedTripArray = [];
  // A conditional statement that checks if Local Storage already exists (otherwise after closing the browser or reloading the page, all the existing information in Local Storage is gone, and nothing remains on the front end)
  if (localStorage.getItem('trips')) {
    savedTripArray = JSON.parse(localStorage.getItem('trips'))
  } else {
    savedTripArray = [];
  };
  // Set variable to store saved trip which is selected based on it's ID from savedTripArray
  let selectedTrip = savedTripArray.find(array => array.id === id);
  // Set variables for destination: city, country, latitude, longitude; startDate and endDate
  let destinationCity = selectedTrip.destination.city;
  let destinationCountry = selectedTrip.destination.country;
  let destinationLatitude = selectedTrip.destination.latitude;
  let destinationLongitude = selectedTrip.destination.longitude;
  let startDate = selectedTrip.startDate;
  let endDate = selectedTrip.endDate;
  // Store variables in object for sending to server
  let destinationData = {
    city: destinationCity,
    country: destinationCountry,
    latitude: destinationLatitude,
    longitude: destinationLongitude,
    startDate: startDate,
    endDate: endDate,
  };
  // Set variable to store current weather date for the saved trip
  let weatherDate = selectedTrip.current_weather.date;
  // Create array with year, month and day for current weather date of the saved trip
  let [yearWeather, monthWeather, dayWeather] = weatherDate.split('-');
  // Set variables to store today date: UTC year, UTC month and UTC day
  let today = new Date();
  let yearToday = today.getUTCFullYear;
  let monthToday = today.getUTCMonth + 1;
  let dayToday = today.getUTCDate();
  // Check if weather date does not equal to current date then fetch new weather data and update current weather for the saved trip
  if (yearWeather != yearToday && monthWeather != monthToday && dayWeather != dayToday) {
    // Fetch Weather API for updated current weather data
    let response = await fetch('/weather', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(destinationData)
    });
    // Set variable to store fetch weather data for the saved trip
    let weatherData = await response.json(); 
    // Update current weather data
    selectedTrip.current_weather.date = weatherData.current_weather.date;
    selectedTrip.current_weather.temp = weatherData.current_weather.temp;
    selectedTrip.current_weather.uv = weatherData.current_weather.uv;
    selectedTrip.current_weather.humidity = weatherData.current_weather.humidity;
    selectedTrip.current_weather.pressure = weatherData.current_weather.pressure;
    selectedTrip.current_weather.wind_speed = weatherData.current_weather.wind_speed;
    selectedTrip.current_weather.wind_dir = weatherData.current_weather.wind_dir;
    selectedTrip.current_weather.icon = weatherData.current_weather.icon;
    selectedTrip.current_weather.description = weatherData.current_weather.description;
    // Update saved trips in the Local Storage
    localStorage.setItem('trips', JSON.stringify(savedTripArray));
    // Log with message
    console.log('Current weather for the saved trips was updated', selectedTrip);
  } else {
    // Log with message
    console.log('Current weather is up-to-date', selectedTrip);
  };
};

// Export js file
export {
  refreshApiData,
  updateInvalidImageUrl,
  calculateCurrentTime,
  renderCurrentTime,
  refreshCurrentWeather
};