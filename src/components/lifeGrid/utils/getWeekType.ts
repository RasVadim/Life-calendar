import { EWeekType } from '@/types';

/**
 * Resolves week type (past/present/future) by its index relative to today.
 */
export const getWeekType = (weekIndex: number, todayWeekIndex: number): EWeekType => {
  if (weekIndex > todayWeekIndex) return EWeekType.Future;
  if (weekIndex === todayWeekIndex) return EWeekType.Present;
  return EWeekType.Past;
};
