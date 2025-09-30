// Constants
const DAYS_IN_WEEK = 7;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculates the week number in calendar for the given Monday
 * @param mondayOfWeek - Monday of the target week
 * @param firstMondayOfCalendar - Monday of the first calendar week
 * @returns Week number (0-based)
 */
export const getWeekOfCalendar = (mondayOfWeek: Date, firstMondayOfCalendar: Date): number => {
  const daysDifference = Math.floor(
    (mondayOfWeek.getTime() - firstMondayOfCalendar.getTime()) / MILLISECONDS_PER_DAY,
  );
  return Math.floor(daysDifference / DAYS_IN_WEEK);
};
