/**
 * Compares two dates ignoring the year, only comparing month and day
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns -1 if date1 is before date2, 0 if equal, 1 if date1 is after date2
 */
export const compareDatesWithoutYear = (date1: Date, date2: Date): number => {
  const month1 = date1.getMonth();
  const day1 = date1.getDate();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  if (month1 !== month2) {
    return month1 < month2 ? -1 : 1;
  }

  if (day1 !== day2) {
    return day1 < day2 ? -1 : 1;
  }

  return 0;
};

/**
 * Checks if date1 is before date2 (ignoring year)
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns true if date1 is before date2 (ignoring year), false otherwise
 */
export const isDateBefore = (date1: Date, date2: Date): boolean => {
  return compareDatesWithoutYear(date1, date2) < 0;
};

/**
 * Checks if date1 is after date2 (ignoring year)
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns true if date1 is after date2 (ignoring year), false otherwise
 */
export const isDateAfter = (date1: Date, date2: Date): boolean => {
  return compareDatesWithoutYear(date1, date2) > 0;
};

/**
 * Checks if two dates are equal (ignoring year)
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns true if dates are equal (ignoring year), false otherwise
 */
export const isDateEqual = (date1: Date, date2: Date): boolean => {
  return compareDatesWithoutYear(date1, date2) === 0;
};
