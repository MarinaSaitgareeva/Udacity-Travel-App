// This function determines a number of days between travel start date and current date
const calculateDaysToGo = (tripStartDate) => {
  let currentDate = new Date();
  tripStartDate = new Date(tripStartDate);
  let differenceInDays = tripStartDate - currentDate;
  let daysToGo = new Date(differenceInDays) / (24 * 3600 * 1000);
  return Number(Math.round(daysToGo));
};

// Export js file
module.exports = calculateDaysToGo;