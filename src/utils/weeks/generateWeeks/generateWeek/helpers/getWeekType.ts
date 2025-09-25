import { startOfDay } from 'date-fns';

import { EWeekType } from '@/types/life';

/**
 * Determines the type of week relative to today (Past, Present, or Future).
 *
 * @param weekStart - Start date of the week
 * @param weekEnd - End date of the week
 * @returns Week type based on current date
 */
export const getWeekType = (weekStart: Date, weekEnd: Date): EWeekType => {
  const today = startOfDay(new Date());
  if (today >= weekStart && today <= weekEnd) return EWeekType.Present;
  if (today < weekStart) return EWeekType.Future;
  return EWeekType.Past;
};
