// Function to calculate a number of days between trip start date and current date
const calculateDaysToGo = (trip) => {
  let tripStartDate = trip.startDate;
  // Set variable for current date
  let currentDate = new Date();
  // Set variable for trip start date
  tripStartDate = new Date(tripStartDate);
  // Calculate difference between start date and current date
  let differenceInDays = tripStartDate - currentDate;
  // Convert difference from milliseconds to days (24 - hours to days, 60*60=3600 - seconds to minutes then hours, 1000 - milliseconds to seconds)
  let daysToGo = new Date(differenceInDays) / (24 * 3600 * 1000);
  return trip.daysToGo = (Number(Math.round(daysToGo) + 1)).toString(); // +1 including current date
};

// Export js file
export { calculateDaysToGo };