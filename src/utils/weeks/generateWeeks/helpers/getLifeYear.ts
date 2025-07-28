/**
 * Calculates the life year based on the birth date and the date
 * @param {Date} birthDate - The birth date
 * @param {Date} date - The date
 * @returns {number} The life year
 */
export const getLifeYear = (birthDate: Date, date: Date): number => {
  // Calculate the difference in years
  const yearsDiff = date.getFullYear() - birthDate.getFullYear();

  // Check if birthday has passed this year
  const isBeforeBirthday =
    date.getMonth() < birthDate.getMonth() ||
    (date.getMonth() === birthDate.getMonth() && date.getDate() < birthDate.getDate());

  // If current month is before birth month, or same month but before birth day
  if (isBeforeBirthday) {
    return yearsDiff;
  }

  // Birthday has passed this year
  return yearsDiff + 1;
};
