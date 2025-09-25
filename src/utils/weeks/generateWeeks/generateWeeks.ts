import { startOfDay } from 'date-fns';

import { DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { ESide, EWeekType, TDrawWeekIndexes, TMedia, TMediaDatesMap } from '@/types';

import { generateWeek } from './generateWeek';
import { getDeathDate, generateWeekTimePoints, updateTodayInfo } from './helpers';
import { IGenerateWeeksResult } from './types';

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

  // Generate week time points
  const weekTimePoints = generateWeekTimePoints(birthDate, deathDate);

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
      updateTodayInfo(week, birthDate, today, weeks.length);
    }

    weeks.push(week);
  }

  return { weeks, today, drawWeekIndexes, media };
};
