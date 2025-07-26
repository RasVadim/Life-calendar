/**
 * Returns week number as a string with leading zeros
 * @param weekIndex - week index in year
 * @returns week number as a string with leading zeros
 */
export const getWeekNumber = (weekIndex: number) => {
  return String(weekIndex + 1).padStart(2, '0');
};
