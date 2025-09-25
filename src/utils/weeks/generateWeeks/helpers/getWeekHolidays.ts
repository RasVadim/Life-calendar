import { HOLIDAY_NAMES } from '@/constants';
import type { THolidayName } from '@/types';

/**
 * Returns holidays for the given week
 * @param {Date} weekStart - Start date of the week
 * @param {Date} weekEnd - End date of the week
 * @param {Date} birthDate - User's birth date
 * @returns {THolidayName[]} Array of holiday names
 */
export const getWeekHolidays = (
  weekStart: Date,
  weekEnd: Date,
  birthDate: Date,
): THolidayName[] => {
  const holidays: THolidayName[] = [];
  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.getMonth();

  // Check each day of the week for holidays
  for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    const day = d.getDate();
    const month = d.getMonth();

    // Birthday check (highest priority)
    if (day === birthDay && month === birthMonth) {
      holidays.unshift(HOLIDAY_NAMES.birthday); // Add to beginning
    }

    // Other holidays check (can be on same day as birthday)
    if (day === 1 && month === 0) {
      holidays.push(HOLIDAY_NAMES.newYear);
    } else if (day === 23 && month === 1) {
      holidays.push(HOLIDAY_NAMES.Feb23);
    } else if (day === 8 && month === 2) {
      holidays.push(HOLIDAY_NAMES.Mar8);
    }
  }

  return holidays;
};
