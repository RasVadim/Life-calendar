import { FULL_WEEKS_THRESHOLD } from '@/constants';
import { EMonthsWeekIndxsValues } from '@/types';

import { calculateWeeksInMonth } from './calculateWeeksInMonth';
import { TMonthInfo } from './getMonthInfo';

/**
 * Determines month type after border week
 */
export const getPostBorderWeekType = (monthInfo: TMonthInfo): EMonthsWeekIndxsValues | null => {
  const { daysInMonth, currentWeekStartDay } = monthInfo;
  const daysLeftInMonth = daysInMonth - currentWeekStartDay + 1;
  const { fullWeeks, remainingDays } = calculateWeeksInMonth(daysLeftInMonth);

  if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays > 0) {
    return EMonthsWeekIndxsValues.First5;
  } else if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays === 0) {
    return EMonthsWeekIndxsValues.First4;
  } else if (fullWeeks === 3 && remainingDays > 0) {
    return EMonthsWeekIndxsValues.First4;
  }

  return null;
};
