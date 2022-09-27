// This function determines a number of days between travel start date and end date
const calculateDaysLength = (tripStartDate, tripEndDate) => {
  tripStartDate = new Date(tripStartDate);
  tripEndDate = new Date(tripEndDate);
  let differenceInDays = tripEndDate - tripStartDate;
  let daysLength = new Date(differenceInDays) / (24 * 3600 * 1000);
  return Number(Math.round(daysLength) + 1); // +1 including trip start date
};

// Export js file
module.exports = calculateDaysLength;