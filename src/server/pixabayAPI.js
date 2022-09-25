// Require module node-fetch to use the fetch() function in NodeJS
// const fetch = require('node-fetch');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Pixabay API with img
const fetchPixabayApi = async (city = '', country = '', pixabayApiKey) => {
  let url = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${city}+${country}&category=travel&image_type=photo`;

  let response = await fetch(url);
  console.log(`Pixabay API: ${response.status} ${response.statusText} ${response.ok}`);

  if (response.ok) {
    let data = await response.json();
    if (data.hits.length > 0) {
      // console.log(data.hits);
      return data.hits[0].webformatURL;
    }
  } else {
    // Appropriately handle the error
    console.log(`Error: ${response.status} ${response.statusText}.`);
  }
  return 'no data';
};

// Export js file
module.exports = fetchPixabayApi;