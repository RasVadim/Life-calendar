import { FULL_WEEKS_THRESHOLD } from '@/constants';
import { EMonthsWeekIndxsValues } from '@/types';

import { calculateWeeksInMonth } from './calculateWeeksInMonth';
import { TMonthInfo } from './getMonthInfo';

/**
 * Determines month type when month starts on Monday
 */
export const getMonthStartType = (monthInfo: TMonthInfo): EMonthsWeekIndxsValues | null => {
  const { daysInMonth } = monthInfo;
  const { fullWeeks, remainingDays } = calculateWeeksInMonth(daysInMonth);

  if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays > 0) {
    return EMonthsWeekIndxsValues.FirstFull5;
  } else if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays === 0) {
    return EMonthsWeekIndxsValues.FirstFull4;
  }

  return null;
};
