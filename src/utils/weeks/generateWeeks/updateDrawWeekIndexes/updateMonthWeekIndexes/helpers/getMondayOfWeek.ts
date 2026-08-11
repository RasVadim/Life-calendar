// Constants
const DAYS_TO_MONDAY_FROM_SUNDAY = 6;

/**
 * Finds the Monday of the week containing the given date
 * @param date - The date to find Monday for
 * @returns Monday of the week
 */
export const getMondayOfWeek = (date: Date): Date => {
  const dayOfWeek = date.getDay();
  const daysToMonday = dayOfWeek === 0 ? DAYS_TO_MONDAY_FROM_SUNDAY : dayOfWeek - 1;
  const monday = new Date(date);
  monday.setDate(monday.getDate() - daysToMonday);
  return monday;
};
