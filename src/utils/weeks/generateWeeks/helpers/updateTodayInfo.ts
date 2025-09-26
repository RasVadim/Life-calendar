import { IWeek } from '@/store/clientDB';
import { calculateTodayDayInfo } from '@/utils';

import { IGenerateWeeksResult } from '../types';

/**
 * Updates today's information when processing the present week
 * @param week - The week object containing days and metadata
 * @param birthDate - User's birth date for calculating life year segments
 * @param today - Today info object to be updated with current week/day data
 * @param weekIndex - Index of the current week in the life calendar
 */
export const updateTodayInfo = (
  week: IWeek,
  birthDate: Date,
  today: IGenerateWeeksResult['today'],
  weekIndex: number,
) => {
  today.todayWeekId = week.id;
  today.todayWeekIndex = weekIndex;

  // Calculate today's day information using shared logic
  const todayDayInfo = calculateTodayDayInfo(week, new Date(), birthDate);

  today.todayDayId = todayDayInfo.todayDayId;
  today.todayDayIndex = todayDayInfo.todayDayIndex;
  today.todayWeekYearHalf = todayDayInfo.todayWeekYearHalf;
};
