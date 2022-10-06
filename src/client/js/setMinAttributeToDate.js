// Function to set attribute "min" = current date to start-date and end-date
function setMinAttributeToDate() {
  document.querySelector('#start-date').setAttribute('min', getDay());
  document.querySelector('#end-date').setAttribute('min', getDay());

  // Function to identify current date and add date format to it so we can use it as attribute "min" for start-date and end-date
  function getDay() {
    // Identify current date
    let currentDate = new Date();
    let dd = currentDate.getDate();
    let mm = currentDate.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    let yyyy = currentDate.getFullYear();
    // Add format for current date to use it as attribute "min"
    if(dd<10) {
      dd='0'+dd
    }
    if(mm<10) {
      mm='0'+mm
    }
    currentDate = yyyy+'-'+mm+'-'+dd;
    return currentDate;
  };
};

// Export js file
export { setMinAttributeToDate };