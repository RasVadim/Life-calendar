import { addDays, format, startOfDay } from 'date-fns';

import { DEFAULT_LIFE_SPAN_YEARS, ISO_DATE_FORMAT } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { ESide, EWeekType, TDrawWeekIndexes, TMedia, TMediaDatesMap } from '@/types';

import { generateWeek } from './generateWeek';
import { getDeathDate, getIsDateEarly } from './helpers';

export interface IGenerateWeeksResult {
  weeks: IWeek[];
  today: {
    todayWeekId: string;
    todayWeekIndex: number;
    todayDayId: string;
    todayDayIndex: number;
    todayWeekHalf: ESide | null;
  };
  drawWeekIndexes: TDrawWeekIndexes;
  media: TMediaDatesMap<TMedia>;
}

/**
 * Generates an array of life weeks for a given birth date and lifespan or death date.
 * Each year of life will always have exactly 52 weeks (with possible expanded first/last week).
 *
 * @param {string} birthDateISO - User's birth date in ISO format (e.g. '1990-03-07')
 * @param {number} [lifeSpanYears=DEFAULT_LIFE_SPAN_YEARS] - Expected lifespan in years
 * @param {string} [deathDateISO] - Optional death date in ISO format (e.g. '2080-03-07')
 * @returns {IGenerateWeeksResult} Array of week objects for the entire life, and today Week Id and Index
 */
export const generateWeeks = (
  birthDateISO: string,
  lifeSpanYears: number = DEFAULT_LIFE_SPAN_YEARS,
  deathDateISO?: string,
): IGenerateWeeksResult => {
  const weeks: IWeek[] = [];
  const birthDate = startOfDay(new Date(birthDateISO));
  const today = {
    todayWeekId: '',
    todayWeekIndex: 0,
    todayWeekHalf: null as ESide | null,
    todayDayId: '',
    todayDayIndex: 0,
  };

  const drawWeekIndexes: TDrawWeekIndexes = {
    yearsIndxs: {},
    seasonsIndxs: {},
    monthsIndxs: {},
    holidaysIndxs: {},
    mediaIndxs: {},
    seasonOffset: 0,
    monthOffset: 0,
    yearRows: Math.ceil(lifeSpanYears),
    lastWeekIndex: 0,
  };

  const media: TMediaDatesMap<TMedia> = {};

  const deathDate = getDeathDate({
    birthDate,
    deathDateISO,
    lifeSpanYears,
  });

  let weekStart = birthDate;
  const weekTimePoints: { weekStart: Date; weekEnd: Date }[] = [];

  // Generate weeks with proper rules
  let isFirstWeek = true;
  while (weekStart < deathDate) {
    let weekEnd;

    if (isFirstWeek) {
      isFirstWeek = false;
      const startDayOfWeek = weekStart.getDay();
      if (startDayOfWeek !== 1) {
        const daysToSunday = startDayOfWeek === 0 ? 0 : 7 - startDayOfWeek;
        weekEnd = addDays(weekStart, daysToSunday);
        weekTimePoints.push({ weekStart, weekEnd });

        weekStart = addDays(weekEnd, 1);
        continue;
      }
    }

    weekEnd = addDays(weekStart, 6);
    if (weekEnd > deathDate) weekEnd = deathDate;
    weekTimePoints.push({ weekStart, weekEnd });

    weekStart = addDays(weekEnd, 1);
  }

  // Calculate additional fields for each week
  for (let i = 0; i < weekTimePoints.length; i++) {
    const week = generateWeek({
      weekTimePoints,
      weekIndex: i,
      birthDate,
      weeks,
      drawWeekIndexes,
      media,
    });

    if (week.type === EWeekType.Present) {
      today.todayWeekId = week.id;
      today.todayWeekIndex = weeks.length;

      // Find today's day in one pass
      const todayDayIndex = week.days.findIndex(
        (day) => day.date === format(new Date(), ISO_DATE_FORMAT),
      );

      if (week.secondLifeYear) {
        const todayDate = new Date(week.days[todayDayIndex].date);
        today.todayWeekHalf = getIsDateEarly(todayDate, birthDate) ? ESide.Left : ESide.Right;
      }

      today.todayDayId = todayDayIndex !== -1 ? week.days[todayDayIndex].id : '';
      today.todayDayIndex = todayDayIndex !== -1 ? todayDayIndex : 0;
    }

    weeks.push(week);
  }

  return { weeks, today, drawWeekIndexes, media };
};
