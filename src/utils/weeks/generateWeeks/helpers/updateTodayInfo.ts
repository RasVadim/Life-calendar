import { format } from 'date-fns';

import { ISO_DATE_FORMAT } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { ESide } from '@/types';

import { IGenerateWeeksResult } from '../types';
import { getIsDateEarly } from './getIsDateEarly';

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

  // Find today's day
  const todayDateString = format(new Date(), ISO_DATE_FORMAT);
  const todayDayIndex = week.days.findIndex((day) => day.date === todayDateString);

  if (todayDayIndex === -1) {
    // Today is not in this week
    today.todayDayId = '';
    today.todayDayIndex = 0;
    return;
  }

  // Today is in this week
  today.todayDayId = week.days[todayDayIndex].id;
  today.todayDayIndex = todayDayIndex;

  // Calculate week half for secondLifeYear scenarios
  if (week.secondLifeYear) {
    const todayDate = new Date(todayDateString);
    today.todayWeekHalf = getIsDateEarly(todayDate, birthDate) ? ESide.Left : ESide.Right;
  }
};
