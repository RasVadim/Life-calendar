import {
  addYears,
  addDays,
  differenceInDays,
  getYear,
  getMonth,
  getDate,
  isLeapYear,
  format,
  startOfDay,
} from 'date-fns';

import { DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { TSeason, TWeekType } from '@/types/life';
import { getZodiac } from './generateWeeks/getZodiac';
import { getSeason } from './generateWeeks/getSeason';
import { getMajorityDate } from './generateWeeks/getMajorityDate';

/**
 * Generates an array of life weeks for a given birth date and lifespan.
 * Each year of life will always have exactly 52 weeks (with possible expanded first/last week).
 *
 * @param {string} birthDateISO - User's birth date in ISO format (e.g. '1990-03-07')
 * @param {number} [lifeSpanYears=DEFAULT_LIFE_SPAN_YEARS] - Expected lifespan in years
 * @returns {IWeek[]} Array of week objects for the entire life
 */
export const generateWeeks = (
  birthDateISO: string,
  lifeSpanYears = DEFAULT_LIFE_SPAN_YEARS
) => {
  // ... existing code ...
} 