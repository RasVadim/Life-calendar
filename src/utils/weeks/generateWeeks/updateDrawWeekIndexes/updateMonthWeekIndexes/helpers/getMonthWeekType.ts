import { FULL_WEEKS_THRESHOLD } from '@/constants';
import { EMonthsWeekIndxsValues } from '@/types';

import { calculateWeeksInMonth } from './calculateWeeksInMonth';
import { TMonthInfo } from './getMonthInfo';

export enum EMonthWeekTypeCalculation {
  Start = 'start',
  PostBorder = 'postBorder',
}

/**
 * Determines month week type based on calculation type
 * @param monthInfo - Month information object
 * @param calculationType - Type of calculation: 'start' for month start, 'postBorder' for after border week
 * @returns Month week type or null
 */
export const getMonthWeekType = (
  monthInfo: TMonthInfo,
  calculationType: EMonthWeekTypeCalculation,
): EMonthsWeekIndxsValues | null => {
  const { daysInMonth, currentWeekStartDay } = monthInfo;

  let daysToCalculate: number;

  if (calculationType === EMonthWeekTypeCalculation.Start) {
    daysToCalculate = daysInMonth;
  } else {
    // postBorder calculation
    daysToCalculate = daysInMonth - currentWeekStartDay + 1;
  }

  const { fullWeeks, remainingDays } = calculateWeeksInMonth(daysToCalculate);

  if (calculationType === EMonthWeekTypeCalculation.Start) {
    if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays > 0) {
      return EMonthsWeekIndxsValues.FirstFull5;
    } else if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays === 0) {
      return EMonthsWeekIndxsValues.FirstFull4;
    }
  } else {
    // postBorder calculation
    if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays > 0) {
      return EMonthsWeekIndxsValues.First5;
    } else if (fullWeeks === FULL_WEEKS_THRESHOLD && remainingDays === 0) {
      return EMonthsWeekIndxsValues.First4;
    } else if (fullWeeks === 3 && remainingDays > 0) {
      return EMonthsWeekIndxsValues.First4;
    }
  }

  return null;
};
