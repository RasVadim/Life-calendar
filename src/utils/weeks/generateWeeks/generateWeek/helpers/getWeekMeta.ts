import { isLeapYear } from 'date-fns';

import { IWeek } from '@/store/clientDB';
import { EDayOfWeek, TMedia, TMediaDatesMap } from '@/types';

import { extractDateSegments } from './extractDateSegments';
import { generateWeekDays } from './generateWeekDays';
import { setDefaultPreviewFlags } from './setDefaultPreviewFlags';
import { TWeekMeta } from '../../types';

type TGetWeekMetaParams = {
  weekStart: Date;
  weekEnd: Date;
  birthDate: Date;
  weekIndex: number;
  previousWeek: IWeek | null;
  media: TMediaDatesMap<TMedia>;
};

/**
 * Returns meta information for the week including days, date segments, and preview flags
 * @param weekStart - Start date of the week
 * @param weekEnd - End date of the week
 * @param birthDate - User's birth date for generating day info
 * @param weekIndex - Index of the week in the overall calendar
 * @param previousWeek - Previous week object for preview calculations
 * @returns Complete week metadata
 */
export const getWeekMeta = ({
  weekStart,
  weekEnd,
  weekIndex,
  birthDate,
  previousWeek,
  media,
}: TGetWeekMetaParams): TWeekMeta => {
  // Generate all days for the week
  const days = generateWeekDays(weekStart, weekEnd, weekIndex, birthDate);

  // Extract date segments for week boundaries
  const dateSegments = extractDateSegments(weekStart, weekEnd);

  // Calculate additional week properties
  const isLeap = isLeapYear(weekStart);
  const isWeekStartMonday = days[0].dayOfWeek === EDayOfWeek.Monday;

  // Calculate preview flags based on previous week
  const weekMedia = setDefaultPreviewFlags({
    weekStart,
    previousWeek,
    currentMonth: dateSegments.month,
    currentSeason: dateSegments.season,
    isWeekStartMonday,
    media,
  });

  return {
    days,
    ...dateSegments,
    isLeapYear: isLeap,
    media: weekMedia,
  };
};
