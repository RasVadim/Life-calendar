import { differenceInDays, format } from 'date-fns';

import { ISO_DATE_FORMAT } from '@/constants';
import { EDayOfWeek, TDay } from '@/types';

import { getWeekHolidays } from '../helpers';

// Mapping array for day of week (0 = Sunday, 1 = Monday, etc.)
const DAY_OF_WEEK_MAP: EDayOfWeek[] = [
  EDayOfWeek.Sunday,
  EDayOfWeek.Monday,
  EDayOfWeek.Tuesday,
  EDayOfWeek.Wednesday,
  EDayOfWeek.Thursday,
  EDayOfWeek.Friday,
  EDayOfWeek.Saturday,
];

type TGenerateDayParams = {
  date: Date;
  weekStart: Date;
  weekIndex: number;
  birthDate: Date;
};

export const generateDay = ({
  date,
  weekStart,
  weekIndex,
  birthDate,
}: TGenerateDayParams): TDay => {
  // Calculate day index in week (0-6)
  const dayIndexInWeek = date.getDay();

  // Generate unique ID: weekIndex + dayIndexInWeek
  const id = `w${weekIndex + 1}_d${dayIndexInWeek || 7}`;

  // Calculate life day (days since birth)
  const lifeDay = differenceInDays(date, birthDate);

  // Check if this is the first day of the week
  const isWeekPreview = date.getTime() === weekStart.getTime();

  // Get day of week as string using mapping array
  const dayOfWeek = DAY_OF_WEEK_MAP[dayIndexInWeek];

  // Get holidays for this week
  const dayHolidays = getWeekHolidays(date, date, birthDate);

  return {
    id,
    date: format(date, ISO_DATE_FORMAT),
    dayOfWeek,
    isWeekPreview,
    holidays: dayHolidays.length > 0 ? dayHolidays : null,
    lifeDay,
    comments: null,
    description: null,
  };
};
