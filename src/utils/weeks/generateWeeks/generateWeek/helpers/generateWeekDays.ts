import { addDays } from 'date-fns';

import { TDay } from '@/types';

import { generateDay } from '../../generateDay';

/**
 * Generates an array of day objects for the specified week period.
 * Iterates through each day from weekStart to weekEnd and creates day objects.
 *
 * @param weekStart - Start date of the week
 * @param weekEnd - End date of the week
 * @param weekIndex - Index of the week in the overall calendar
 * @param birthDate - User's birth date for calculating life-related data
 * @returns Array of day objects for the week
 */
export const generateWeekDays = (
  weekStart: Date,
  weekEnd: Date,
  weekIndex: number,
  birthDate: Date,
): TDay[] => {
  const days: TDay[] = [];
  for (let d = weekStart; d <= weekEnd; d = addDays(d, 1)) {
    const day = generateDay({ date: d, weekStart, weekIndex, birthDate });
    days.push(day);
  }
  return days;
};
