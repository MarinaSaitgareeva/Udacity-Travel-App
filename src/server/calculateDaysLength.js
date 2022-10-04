// Function to determine a number of days between travel start date and end date
const calculateDaysLength = (tripStartDate, tripEndDate) => {
  // Set variables for trip start and end date
  tripStartDate = new Date(tripStartDate);
  tripEndDate = new Date(tripEndDate);
  // Calculate difference between start date and current date
  let differenceInDays = tripEndDate - tripStartDate;
  // Convert difference from milliseconds to days (24 - hours to days, 60*60=3600 - seconds to minutes then hours, 1000 - milliseconds to seconds)
  let daysLength = new Date(differenceInDays) / (24 * 3600 * 1000);
  return Number(Math.round(daysLength) + 1); // +1 including trip start date
};

// Export js file
module.exports = calculateDaysLength;