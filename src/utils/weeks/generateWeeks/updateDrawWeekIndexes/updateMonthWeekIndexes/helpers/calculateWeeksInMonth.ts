const DAYS_IN_WEEK = 7;

/**
 * Calculates full weeks and remaining days in a month
 */
export const calculateWeeksInMonth = (daysInMonth: number) => {
  const fullWeeks = Math.floor(daysInMonth / DAYS_IN_WEEK);
  const remainingDays = daysInMonth % DAYS_IN_WEEK;
  return { fullWeeks, remainingDays };
};
