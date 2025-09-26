import { format } from 'date-fns';

import { ISO_DATE_FORMAT } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { ESide } from '@/types/draw';

import { isDateBefore } from './compareDatesWithoutYear';

export type TodayDayInfo = {
  todayDayId: string;
  todayDayIndex: number;
  todayWeekYearHalf: ESide | null;
};

/**
 * Calculate today's day information for the given week
 * Common logic used by both actualizeWeeks and generateWeeks
 */
export const calculateTodayDayInfo = (
  week: IWeek,
  currentDate: Date,
  birthDate: Date | null,
): TodayDayInfo => {
  const todayDateString = format(currentDate, ISO_DATE_FORMAT);
  const todayDayIndex = week.days.findIndex((day) => day.date === todayDateString);

  let todayDayId = '';
  let todayDayIndexValue = 0;
  let todayWeekYearHalf: ESide | null = null;

  if (todayDayIndex !== -1) {
    // Today is in this week
    todayDayId = week.days[todayDayIndex].id;
    todayDayIndexValue = todayDayIndex;

    // Calculate week half for secondLifeYear scenarios
    if (week.secondLifeYear && birthDate) {
      const todayDate = new Date(todayDateString);
      todayWeekYearHalf = isDateBefore(todayDate, birthDate) ? ESide.Left : ESide.Right;
    }
  }

  return {
    todayDayId,
    todayDayIndex: todayDayIndexValue,
    todayWeekYearHalf,
  };
};
