import { IWeek } from '@/store/clientDB';
import { EMonthsEndsIndxsValues, EMonthsWeekIndxsValues, TDrawWeekIndexes } from '@/types';

import {
  getMonthStartType,
  getPostBorderWeekType,
  setMonthIndexObject,
  getMonthInfo,
} from './helpers';
import { TWeekMeta } from '../../../types';

type TUpdateMonthWeekIndexesParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  currentWeekIndex: number;
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  meta: TWeekMeta;
  previousWeek: IWeek | null;
};

/**
 * Updates the month week indexes
 */
export const updateMonthWeekIndexes = ({
  drawWeekIndexes,
  currentWeekIndex,
  weekTimePoints,
  meta,
  previousWeek,
}: TUpdateMonthWeekIndexesParams) => {
  // Validate input parameters
  if (!drawWeekIndexes?.monthsIndxs || currentWeekIndex < 0) {
    return;
  }

  const setMonthType = (
    type: EMonthsWeekIndxsValues | EMonthsEndsIndxsValues,
    monthInfo?: ReturnType<typeof getMonthInfo>,
  ) => {
    setMonthIndexObject({
      type,
      weekTimePoints,
      currentWeekIndex,
      meta,
      drawWeekIndexes,
      monthInfo,
    });
  };

  // Special case: first week of life
  if (currentWeekIndex === 0) {
    setMonthType(EMonthsEndsIndxsValues.HalfBorder);
    return;
  }

  // Border week (contains two months)
  if (meta.secondMonth) {
    setMonthType(EMonthsWeekIndxsValues.Border);
    return;
  }

  // Border end week (month ends on Sunday)
  const currentWeekEnd = new Date(weekTimePoints[currentWeekIndex].weekEnd);
  const nextDay = new Date(currentWeekEnd);
  nextDay.setDate(nextDay.getDate() + 1);

  if (nextDay.getMonth() !== currentWeekEnd.getMonth()) {
    setMonthType(EMonthsWeekIndxsValues.BorderEnd);
    return;
  }

  // Check if month changed from previous week
  if (previousWeek) {
    const previousWeekEnd = new Date(previousWeek.dateEnd);
    const currentWeekStart = new Date(weekTimePoints[currentWeekIndex].weekStart);
    const previousWeekStart = new Date(previousWeek.dateStart);

    const isPrevBorderOnWeekHalf = previousWeekEnd.getMonth() !== currentWeekStart.getMonth();
    const isPrevBorderOnWeekEnd = previousWeekEnd.getMonth() !== previousWeekStart.getMonth();

    if (isPrevBorderOnWeekHalf || isPrevBorderOnWeekEnd) {
      // Calculate month info once for both functions, reusing currentWeekStart
      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex, currentWeekStart });

      if (isPrevBorderOnWeekHalf) {
        // Month starts on Monday
        const monthType = getMonthStartType(monthInfo);
        if (monthType) {
          setMonthType(monthType, monthInfo);
          return;
        }
      }

      if (isPrevBorderOnWeekEnd) {
        // First full week after border week
        const monthType = getPostBorderWeekType(monthInfo);
        if (monthType) {
          setMonthType(monthType, monthInfo);
        }
      }
    }
  }
};
