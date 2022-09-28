// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Pixabay API with img based on city and country name
const fetchPixabayApi = async (city = '', country = '', pixabayApiKey) => {
  let url = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${city}+${country}&category=places&image_type=photo&orientation=horizontal`;

  let response = await fetch(url);
  console.log(`Pixabay API: ${response.status} ${response.statusText} ${response.ok}`);

  if (response.ok) {
    let data = await response.json();
    if (data.hits.length > 0) {
      return data.hits[Math.floor(Math.random() * 10)].webformatURL; // Random number => different city's img
    }
  } else {
      // Appropriately handle the error
      console.log(`Error: ${response.status} ${response.statusText}!!!`);
      return 'no data';
    };
};

// Export js file
module.exports = fetchPixabayApi;