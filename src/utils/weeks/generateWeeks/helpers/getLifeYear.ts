import { isDateBefore } from '../../compareDatesWithoutYear';

/**
 * Calculates the life year based on the birth date and the date
 * @param {Date} birthDate - The birth date
 * @param {Date} date - The date
 * @returns {number} The life year
 */
export const getLifeYear = (birthDate: Date, date: Date): number => {
  // Calculate the difference in years
  const yearsDiff = date.getFullYear() - birthDate.getFullYear();

  // Check if birthday has passed this year using unified date comparison
  const isBeforeBirthday = isDateBefore(date, birthDate);

  // If current month is before birth month, or same month but before birth day
  return isBeforeBirthday ? yearsDiff : yearsDiff + 1;
};
