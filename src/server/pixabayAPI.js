// Require module node-fetch to use the fetch() function in NodeJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Fetch Pixabay API with img based on city and country name
const fetchPixabayApi = async (city = '', country = '', pixabayApiKey) => {
  // Replace spaces " " in name of city and country with underscore "_"
  // city = city.replace(/ /g,'_');
  // country = country.replace(/ /g,'_');

  // Set variable for url to fetch API data
  let url = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${city}+${country}&image_type=photo&orientation=horizontal&category=places`;
  // Fetch API data
  let response = await fetch(url);
  console.log(`Pixabay API: ${response.status} ${response.statusText} ${response.ok}`);

  if (response.ok) {
    let data = await response.json();
    if (data.hits.length >= 10) {
      console.log(url);
      let imageUrl = data.hits[Math.floor(Math.random() * 10)].webformatURL;// Random number => different city's img
      return imageUrl
    } else {
      // Set updated variable to fetch API data, if there are no images in previous response from API 
      let updatedUrl = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${city}+${country}&image_type=photo&orientation=horizontal`;
      // Fetch API data
      let updatedResponse = await fetch(updatedUrl);
      let updatedData = await updatedResponse.json();
      if (updatedData.hits.length >= 10) {
        console.log(updatedUrl);
        let updatedImageUrl = updatedData.hits[Math.floor(Math.random() * 10)].webformatURL// Random number => different city's img
        return updatedImageUrl
      } else if (updatedData.hits.length > 0 && updatedData.hits.length < 10) {
        console.log(updatedUrl);
        let updatedImageUrl = updatedData.hits[0].webformatURL
        return updatedImageUrl
      } else {
        // if there is no images return undefined so you can fetch another link for images
        return undefined
      }
    }
  } else {
      // Appropriately handle the error
      console.log(`Error: ${response.status} ${response.statusText}!!!`);
      return 'no data'
    };
};

// Export js file
module.exports = fetchPixabayApi;