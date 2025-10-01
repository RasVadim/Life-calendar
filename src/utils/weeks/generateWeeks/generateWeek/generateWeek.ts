import { getYear, format } from 'date-fns';

import { ISO_DATE_FORMAT, COMPACT_DATE_FORMAT } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { TDrawWeekIndexes, TMedia, TMediaDatesMap } from '@/types';
import { getWeekType } from '@/utils';

import { getWeekHolidays, getLifeYear, formatWeekNumber } from '../helpers';
import { getWeekMeta, getZodiac, calculateCurrentLifeMonth } from './helpers';
import { updateDrawWeekIndexes } from '../updateDrawWeekIndexes';

type TGenerateWeekParams = {
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  weekIndex: number;
  birthDate: Date;
  weeks: IWeek[];
  drawWeekIndexes: TDrawWeekIndexes;
  media: TMediaDatesMap<TMedia>;
};

export const generateWeek = ({
  weekTimePoints,
  weekIndex,
  birthDate,
  weeks,
  drawWeekIndexes,
  media,
}: TGenerateWeekParams): IWeek => {
  const { weekStart, weekEnd } = weekTimePoints[weekIndex];
  const lifeYear = getLifeYear(birthDate, weekStart);
  const secondLifeYear = getLifeYear(birthDate, weekEnd);
  const previousWeek = weeks[weeks.length - 1] || null;

  // Generate week metadata
  const meta = getWeekMeta({
    weekStart,
    weekEnd,
    weekIndex,
    birthDate,
    previousWeek,
    media,
  });

  // Calculate week properties
  const type = getWeekType(weekStart, weekEnd);
  const holidays = getWeekHolidays(weekStart, weekEnd, birthDate);
  const lifeMonth = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);

  // Update draw week indexes
  updateDrawWeekIndexes({
    drawWeekIndexes,
    weekIndex,
    meta,
    lifeYear,
    secondLifeYear,
    weekTimePoints,
    currentWeekIndex: weeks.length,
    holidays,
    previousWeek,
  });

  // Pre-format dates to avoid repetition
  const dateStart = format(weekStart, ISO_DATE_FORMAT);
  const dateEnd = format(weekEnd, ISO_DATE_FORMAT);
  const weekId = `${format(weekStart, COMPACT_DATE_FORMAT)}_${formatWeekNumber(weekIndex)}`;

  return {
    id: weekId,
    index: weekIndex,
    dateStart,
    dateEnd,
    type,
    lifeMonth,
    lifeYear,
    secondLifeYear: secondLifeYear === lifeYear ? null : secondLifeYear,

    // Date segments from meta
    year: meta.year,
    secondYear: meta.secondYear,
    month: meta.month,
    secondMonth: meta.secondMonth,
    season: meta.season,
    secondSeason: meta.secondSeason,
    isLeapYear: meta.isLeapYear,
    days: meta.days,
    media: meta.media,
    // Flags and additional data
    holidays,
    yearZodiacLabel: getZodiac(getYear(weekStart)),
    // Null fields on generation step
    comments: null,
    description: null,
  };
};
