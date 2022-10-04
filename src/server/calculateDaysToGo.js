// Function to determine a number of days between trip start date and current date
const calculateDaysToGo = (tripStartDate) => {
  // Set variable for current date
  let currentDate = new Date();
  // Set variable for trip start date
  tripStartDate = new Date(tripStartDate);
  // Calculate difference between start date and current date
  let differenceInDays = tripStartDate - currentDate;
  // Convert difference from milliseconds to days (24 - hours to days, 60*60=3600 - seconds to minutes then hours, 1000 - milliseconds to seconds)
  let daysToGo = new Date(differenceInDays) / (24 * 3600 * 1000);
  return Number(Math.round(daysToGo) + 1); // +1 including current date
};

// Export js file
module.exports = calculateDaysToGo;