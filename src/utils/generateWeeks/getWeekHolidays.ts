import { HOLIDAY_NAMES } from '@/types/life';

/**
 * Returns holidays for the given week
 * @param {Date} weekStart - Start date of the week
 * @param {Date} weekEnd - End date of the week
 * @param {Date} birthDate - User's birth date
 * @param {number} yearOfLife - Year of life (0-based)
 * @returns {string[]} Array of holiday names
 */
export const getWeekHolidays = (
  weekStart: Date,
  weekEnd: Date,
  birthDate: Date,
  yearOfLife: number,
): (typeof HOLIDAY_NAMES)[keyof typeof HOLIDAY_NAMES][] => {
  const holidays: (typeof HOLIDAY_NAMES)[keyof typeof HOLIDAY_NAMES][] = [];
  // Birthday
  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.getMonth() + 1;
  const birthYear = birthDate.getFullYear();
  const currentLifeYear = birthYear + yearOfLife;
  for (let d = weekStart; d <= weekEnd; d = new Date(d.getTime() + 86400000)) {
    if (
      d.getDate() === birthDay &&
      d.getMonth() + 1 === birthMonth &&
      d.getFullYear() === currentLifeYear
    ) {
      holidays.push(HOLIDAY_NAMES.birthday);
      break;
    }
  }
  // New Year
  for (let d = weekStart; d <= weekEnd; d = new Date(d.getTime() + 86400000)) {
    if (d.getDate() === 1 && d.getMonth() + 1 === 1) {
      holidays.push(HOLIDAY_NAMES.newYear);
      break;
    }
  }
  // 23 February
  for (let d = weekStart; d <= weekEnd; d = new Date(d.getTime() + 86400000)) {
    if (d.getDate() === 23 && d.getMonth() + 1 === 2) {
      holidays.push(HOLIDAY_NAMES.Feb23);
      break;
    }
  }
  // 8 March
  for (let d = weekStart; d <= weekEnd; d = new Date(d.getTime() + 86400000)) {
    if (d.getDate() === 8 && d.getMonth() + 1 === 3) {
      holidays.push(HOLIDAY_NAMES.Mar8);
      break;
    }
  }
  // Birthday always first if present
  if (holidays.includes(HOLIDAY_NAMES.birthday)) {
    const filtered = holidays.filter((h) => h !== HOLIDAY_NAMES.birthday);
    holidays.splice(0, holidays.length, HOLIDAY_NAMES.birthday, ...filtered);
  }
  return holidays;
};
