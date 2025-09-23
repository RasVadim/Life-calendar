import { format } from 'date-fns';

import { IWeek } from '@/store/clientDB';
import {
  EMonthsWeekIndxsValues,
  TDrawWeekIndexes,
  TMediasWeekIndxsValues,
  TMediaDatesMap,
} from '@/types';

import { TWeekMeta } from '../../types';

type TUpdateMonthWeekIndexesParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  currentWeekIndex: number;
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  meta: TWeekMeta;
  previousWeek: IWeek | null;
  media: TMediaDatesMap<TMediasWeekIndxsValues>;
};

/**
 * Updates the month week indexes
 * @param {TUpdateMonthWeekIndexesParams} params - The parameters for the update
 */
export const updateMonthWeekIndexes = ({
  drawWeekIndexes,
  currentWeekIndex,
  weekTimePoints,
  meta,
  previousWeek,
  media,
}: TUpdateMonthWeekIndexesParams) => {
  // Helper function to add media index for first full week of month
  const addMediaIndex = () => {
    const weekStartDate = format(weekTimePoints[currentWeekIndex].weekStart, 'yyyy-MM-dd');
    media[weekStartDate] = { isMonthPreview: true };
    drawWeekIndexes.mediaIndxs[currentWeekIndex] = weekStartDate;
  };

  // Helper function to set month index and add media
  const setMonthIndexWithMedia = (monthIndexValue: EMonthsWeekIndxsValues) => {
    drawWeekIndexes.monthsIndxs[currentWeekIndex] = monthIndexValue;
    addMediaIndex();
  };
  // Check if week spans across two months
  const isWeekInTwoMonths = !!meta.secondMonth;

  // Check if this is a border week (contains two months)
  if (isWeekInTwoMonths) {
    drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.Border;
    return;
  }

  // Check if this is a border end week (month ends on Sunday)
  if (!isWeekInTwoMonths) {
    const currentWeekEnd = new Date(weekTimePoints[currentWeekIndex].weekEnd);
    const nextDay = new Date(currentWeekEnd);
    nextDay.setDate(nextDay.getDate() + 1);

    // If next day is in different month, current week ends the month
    if (nextDay.getMonth() !== currentWeekEnd.getMonth()) {
      drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.BorderEnd;
      return;
    }
  }

  // Check if month starts on Monday
  if (!isWeekInTwoMonths && previousWeek) {
    const previousWeekEnd = new Date(previousWeek.dateEnd);
    const currentWeekStart = new Date(weekTimePoints[currentWeekIndex].weekStart);

    const previousMonth = previousWeekEnd.getMonth();
    const currentMonth = currentWeekStart.getMonth();

    // If previous week ended in different month than current week starts
    if (previousMonth !== currentMonth) {
      // Get number of days in current month
      const year = currentWeekStart.getFullYear();
      const month = currentWeekStart.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Calculate how many full weeks fit in this month
      const fullWeeksInMonth = Math.floor(daysInMonth / 7);
      const remainingDays = daysInMonth % 7;

      // If there are 4 full weeks and some remaining days -> FirstFull5
      // If there are exactly 4 full weeks with no remaining days -> FirstFull4
      if (fullWeeksInMonth === 4 && remainingDays > 0) {
        setMonthIndexWithMedia(EMonthsWeekIndxsValues.FirstFull5);
      } else if (fullWeeksInMonth === 4 && remainingDays === 0) {
        setMonthIndexWithMedia(EMonthsWeekIndxsValues.FirstFull4);
      }
      return;
    }
  }

  // Check if this is first full week after border week
  if (!isWeekInTwoMonths && previousWeek) {
    const previousWeekEnd = new Date(previousWeek.dateEnd);
    const previousWeekStart = new Date(previousWeek.dateStart);
    const currentWeekStart = new Date(weekTimePoints[currentWeekIndex].weekStart);

    // Check if previous week was a border week (contained two months)
    const wasPreviousWeekBorder = previousWeekEnd.getMonth() !== previousWeekStart.getMonth();

    // If previous week was border week, calculate days from current week start
    if (wasPreviousWeekBorder) {
      // Get number of days in current month
      const year = currentWeekStart.getFullYear();
      const month = currentWeekStart.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Calculate how many days are left in month starting from current week
      const currentWeekStartDay = currentWeekStart.getDate();
      const daysLeftInMonth = daysInMonth - currentWeekStartDay + 1;

      // Calculate how many full weeks fit in remaining days
      const fullWeeksLeft = Math.floor(daysLeftInMonth / 7);
      const remainingDays = daysLeftInMonth % 7;

      // If there are 4 full weeks and some remaining days -> First5
      // If there are exactly 4 full weeks with no remaining days -> First4
      // If there are 3 full weeks and some remaining days -> First4 (remaining days go to border week)
      if (fullWeeksLeft === 4 && remainingDays > 0) {
        setMonthIndexWithMedia(EMonthsWeekIndxsValues.First5);
      } else if (fullWeeksLeft === 4 && remainingDays === 0) {
        setMonthIndexWithMedia(EMonthsWeekIndxsValues.First4);
      } else if (fullWeeksLeft === 3 && remainingDays > 0) {
        setMonthIndexWithMedia(EMonthsWeekIndxsValues.First4);
      }
      return;
    }
  }
};
