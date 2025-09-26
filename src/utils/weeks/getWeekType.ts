import { startOfDay } from 'date-fns';

import { EWeekType } from '@/types/life';

/**
 * Determines the type of week relative to a given date (Past, Present, or Future).
 *
 * @param weekStart - Start date of the week
 * @param weekEnd - End date of the week
 * @param currentDate - Date to compare against (defaults to today)
 * @returns Week type based on current date
 */
export const getWeekType = (
  weekStart: Date | string,
  weekEnd: Date | string,
  currentDate: Date = new Date(),
): EWeekType => {
  const today = startOfDay(currentDate);
  const start = startOfDay(typeof weekStart === 'string' ? new Date(weekStart) : weekStart);
  const end = startOfDay(typeof weekEnd === 'string' ? new Date(weekEnd) : weekEnd);

  if (today >= start && today <= end) return EWeekType.Present;
  if (today < start) return EWeekType.Future;
  return EWeekType.Past;
};
