import { format } from 'date-fns';

import { IWeek } from '@/store/clientDB';
import {
  EMonthsEndsIndxsValues,
  EMonthsWeekIndxsValues,
  TDrawWeekIndexes,
  TMedia,
  TMediaDatesMap,
  TMonthsIndxsValue,
} from '@/types';

import { TWeekMeta } from '../../types';

type TUpdateMonthWeekIndexesParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  currentWeekIndex: number;
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  meta: TWeekMeta;
  previousWeek: IWeek | null;
  media: TMediaDatesMap<TMedia>;
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
  // Helper function to create month index object with all data
  const setMonthIndexObject = (
    type: EMonthsWeekIndxsValues | EMonthsEndsIndxsValues,
    includeMedia: boolean = false,
  ) => {
    const weekStartDate = format(weekTimePoints[currentWeekIndex].weekStart, 'yyyy-MM-dd');
    const monthNumber = weekStartDate.split('-')[1]; // Extract month from ISO date
    const yearNumber = weekStartDate.split('-')[0]; // Extract year from ISO date

    const monthObject: TMonthsIndxsValue = {
      type,
      month: monthNumber,
      year: yearNumber,
    };

    // Add media if needed
    if (includeMedia) {
      media[weekStartDate] = { isMonthPreview: true };
      monthObject.media = weekStartDate;
    }

    drawWeekIndexes.monthsIndxs[currentWeekIndex] = monthObject;
  };

  // Special case: first week of life always gets media preview and month label
  if (currentWeekIndex === 0) {
    setMonthIndexObject(EMonthsEndsIndxsValues.HalfBorder, true);
  }

  // Check if week spans across two months
  const isWeekInTwoMonths = !!meta.secondMonth;

  // Check if this is a border week (contains two months)
  if (isWeekInTwoMonths) {
    setMonthIndexObject(EMonthsWeekIndxsValues.Border, false);
    return;
  }

  // Check if this is a border end week (month ends on Sunday)
  if (!isWeekInTwoMonths) {
    const currentWeekEnd = new Date(weekTimePoints[currentWeekIndex].weekEnd);
    const nextDay = new Date(currentWeekEnd);
    nextDay.setDate(nextDay.getDate() + 1);

    // If next day is in different month, current week ends the month
    if (nextDay.getMonth() !== currentWeekEnd.getMonth()) {
      setMonthIndexObject(EMonthsWeekIndxsValues.BorderEnd, false);
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
        setMonthIndexObject(EMonthsWeekIndxsValues.FirstFull5, true);
      } else if (fullWeeksInMonth === 4 && remainingDays === 0) {
        setMonthIndexObject(EMonthsWeekIndxsValues.FirstFull4, true);
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
        setMonthIndexObject(EMonthsWeekIndxsValues.First5, true);
      } else if (fullWeeksLeft === 4 && remainingDays === 0) {
        setMonthIndexObject(EMonthsWeekIndxsValues.First4, true);
      } else if (fullWeeksLeft === 3 && remainingDays > 0) {
        setMonthIndexObject(EMonthsWeekIndxsValues.First4, true);
      }
      return;
    }
  }
};
