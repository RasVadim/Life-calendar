/**
 * Compares two dates ignoring the year, only comparing month and day
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns true if date1 is before date2 (ignoring year), true otherwise
 */
export const getIsDateEarly = (date1: Date, date2: Date): boolean => {
  const month1 = date1.getMonth();
  const day1 = date1.getDate();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  if (month1 !== month2) {
    return month1 < month2;
  }

  return day1 < day2;
};
