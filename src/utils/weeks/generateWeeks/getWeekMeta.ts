import { addDays, getDate, isLeapYear } from 'date-fns';

import { ESeason } from '@/types/life';

import { getMajorityDate } from './getMajorityDate';

/**
 * Returns meta info for the week
 * @param {Date} weekStart
 * @param {Date} weekEnd
 * @param {number} yearOfLife
 * @param {Date} birthDate
 * @param {number} i - week index in year
 * @param {number} weeksInYearLength
 * @returns {object} meta info
 */
export const getWeekMeta = (
  weekStart: Date,
  weekEnd: Date,
  yearOfLife: number,
  i: number,
  weeksInYearLength: number,
) => {
  const days: Date[] = [];
  for (let d = weekStart; d <= weekEnd; d = addDays(d, 1)) {
    days.push(d);
  }
  const dateYear = getMajorityDate(days, 'year');
  // Ensure dateMonth is always two digits (e.g. '01', '02', ..., '12')
  const rawMonth = getMajorityDate(days, 'month');
  const dateMonth = String(rawMonth).padStart(2, '0');
  const dateSeason = getMajorityDate(days, 'season') as ESeason;
  const year = yearOfLife + 1;
  const isFirst = i === 0;
  const isLast = i === weeksInYearLength - 1;
  const isFirstInYear = isFirst;
  const isLastInYear = isLast;
  const isFirstInMonth = getDate(weekStart) === 1;
  const isLastInMonth = getDate(weekEnd) === getDate(addDays(weekEnd, 1)) - 1;
  const isLeap = isLeapYear(weekStart);

  // Calculate isFirstInSeason and isLastInSeason
  const isFirstInSeason =
    i === 0 ||
    dateSeason !==
      getMajorityDate(
        Array.from({ length: 7 }, (_, k) => new Date(weekStart.getTime() - (k + 1) * 86400000)),
        'season',
      );
  const isLastInSeason =
    i === weeksInYearLength - 1 ||
    dateSeason !==
      getMajorityDate(
        Array.from({ length: 7 }, (_, k) => new Date(weekEnd.getTime() + (k + 1) * 86400000)),
        'season',
      );

  return {
    days,
    dateYear,
    dateMonth,
    dateSeason,
    year,
    isFirst,
    isLast,
    isFirstInYear,
    isLastInYear,
    isFirstInMonth,
    isLastInMonth,
    isLeap,
    isFirstInSeason,
    isLastInSeason,
  };
};
