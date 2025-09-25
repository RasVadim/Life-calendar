/**
 * Calculates the current life month based on birth date and week start date.
 *
 * @param {Date} birthDate - User's birth date
 * @param {Date} weekStart - Start date of the current week being processed
 * @param {number} lifeYear - Number of complete years lived (0-based)
 * @returns {number} The current life month (1-based, e.g., 1 = first month of life)
 *
 */
export const calculateCurrentLifeMonth = (
  birthDate: Date,
  weekStart: Date,
  lifeYear: number,
): number => {
  const currentMonth = weekStart.getMonth(); // 0-11
  const birthMonth = birthDate.getMonth(); // 0-11

  // Base calculation: years lived + month difference
  let monthsLived = lifeYear * 12 + (currentMonth - birthMonth);

  // Adjust for case when current month is earlier in year than birth month
  if (currentMonth < birthMonth) {
    monthsLived += 12;
  }

  // Adjust if we haven't reached the birth day in the current month yet
  const currentDay = weekStart.getDate();
  const birthDay = birthDate.getDate();
  if (currentDay < birthDay) {
    monthsLived -= 1;
  }

  // Return 1-based month count (first month of life = 1)
  return monthsLived + 1;
};
