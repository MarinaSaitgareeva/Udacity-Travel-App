// Post trip info
const postTripInfo = async (formInputs) => {
  const response = await fetch('/tripInfo', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(formInputs)
  });
  try {
    const newData = await response.json();
    // console.log(newData);
    return newData;
  }
  catch (error) {
    // Appropriately handle the error
    console.log('Error: ', error);
  };
};

// Export js file
export { postTripInfo };