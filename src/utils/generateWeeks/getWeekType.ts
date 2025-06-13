import { startOfDay } from 'date-fns';

import { EWeekType } from '@/types/life';

/**
 * Returns week type (Past, Present, Future)
 * @param {Date} weekStart
 * @param {Date} weekEnd
 * @returns {EWeekType}
 */
export const getWeekType = (weekStart: Date, weekEnd: Date): EWeekType => {
  const today = startOfDay(new Date());
  if (today >= weekStart && today <= weekEnd) return EWeekType.Present;
  if (today < weekStart) return EWeekType.Future;
  return EWeekType.Past;
};
