const getCurrentTenureRange = () => {
  const now = new Date();
  const current_year = now.getFullYear();
  const current_month = now.getMonth(); // months are 0-indexed

  let startDate, endDate, tenureYearString;
  if (current_month < 3) {
    startDate = new Date(current_year - 1, 3, 1);
    endDate = new Date(current_year, 2, 31, 23, 59, 59);
    tenureYearString = `${current_year - 1}-${current_year}`;
  } else {
    startDate = new Date(current_year, 3, 1);
    endDate = new Date(current_year + 1, 2, 31, 23, 59, 59);
    tenureYearString = `${current_year}-${current_year + 1}`;
  }
  return { startDate, endDate, tenureYearString };
};

module.exports = getCurrentTenureRange;
