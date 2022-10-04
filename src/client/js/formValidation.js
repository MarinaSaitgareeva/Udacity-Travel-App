// Function to validate destination, departure, start and end dates
const formValidation = () => {
  // Set variables for inputs (departure, destination, startDate, endDate) from the form filed by user
  let departure = document.querySelector('#departure').value;
  let destination = document.querySelector('#destination').value;
  let startDate = document.querySelector('#start-date').value;
  let endDate = document.querySelector('#end-date').value;

  // Validate inputs
  const reg = /[a-zA-Z]+/;
  const regDate = /^(202\d{1})-(\d{1,2})-(\d{1,2})$/g;
  // Function to check if one date is greater than other date
  const checkDate = (date1, date2) => {
      date1 = new Date(date1);
      date2 = new Date(date2);
      return date2 - date1 > 0;
  };

  // Checking if departure, destination, start and end dates are valid
  if (!departure.match(reg) || !destination.match(reg) || !startDate.match(regDate) || !endDate.match(regDate) || !checkDate(startDate, endDate)) {
    // Send alert
    alert('Please enter a valid data!');
    return false;
  } else {
    return true;
  }
};

// Export js file
export { formValidation };

