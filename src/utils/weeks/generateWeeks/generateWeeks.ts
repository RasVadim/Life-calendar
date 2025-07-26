import {
  addYears,
  addDays,
  differenceInDays,
  getYear,
  getMonth,
  getDate,
  format,
  startOfDay,
} from 'date-fns';

import { DEFAULT_LIFE_SPAN_YEARS, ISO_DATE_FORMAT } from '@/constants';
import { IDrawWeekIndexes, IWeek } from '@/store/clientDB';
import { EWeekType } from '@/types/life';

import { getWeekHolidays, getWeekMeta, getWeekNumber, getWeekType, getZodiac } from './helpers';

export interface IGenerateWeeksResult {
  weeks: IWeek[];
  todayWeekId: string;
  todayWeekIndex: number;
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
) => {
  const weeks: IWeek[] = [];
  const birthDate = startOfDay(new Date(birthDateISO));
  let deathDate: Date;
  let yearsToGenerate: number;
  let todayWeekId: string = '';
  let todayWeekIndex: number = 0;
  const drawWeekIndexes: IDrawWeekIndexes = {
    yearsIndxs: {},
    seasonsIndxs: {},
    monthsIndxs: {},
    holidaysIndxs: {},
    seasonOffset: 0,
    monthOffset: 0,
  };

  if (deathDateISO) {
    const parsedDeath = new Date(deathDateISO);
    if (!isNaN(parsedDeath.getTime()) && parsedDeath > birthDate) {
      deathDate = startOfDay(parsedDeath);
      // Number of full years between dates
      yearsToGenerate = getYear(deathDate) - getYear(birthDate);
      // If death date is after the birthday in the year, add one more year
      if (
        getMonth(deathDate) > getMonth(birthDate) ||
        (getMonth(deathDate) === getMonth(birthDate) && getDate(deathDate) > getDate(birthDate))
      ) {
        yearsToGenerate += 1;
      }
      // If death date is exactly on the birthday, do not add an extra year
    } else {
      // Invalid death date — fallback to lifeSpanYears
      deathDate = startOfDay(addYears(birthDate, lifeSpanYears));
      yearsToGenerate = lifeSpanYears;
    }
  } else {
    deathDate = startOfDay(addYears(birthDate, lifeSpanYears));
    yearsToGenerate = lifeSpanYears;
  }

  for (let yearOfLife = 0; yearOfLife < yearsToGenerate; yearOfLife++) {
    const yearStart = yearOfLife === 0 ? birthDate : addYears(birthDate, yearOfLife);
    if (yearStart >= deathDate) break;
    const yearEnd =
      yearOfLife === yearsToGenerate - 1
        ? deathDate
        : addDays(addYears(birthDate, yearOfLife + 1), -1);
    let weeksInYear = [];
    let weekStart = yearStart;
    let weekIndex = 0;

    // First week: from birth date to nearest Sunday
    const dayOfWeek = weekStart.getDay(); // 0 - Sunday, 1 - Monday, ...
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const weekEnd = addDays(weekStart, daysToSunday);
    const firstWeekEnd = weekEnd > yearEnd ? yearEnd : weekEnd;
    const firstWeekDays = differenceInDays(firstWeekEnd, weekStart) + 1;
    if (firstWeekDays <= 3) {
      // Merge with the next week (first week will be long)
      let nextWeekEnd = addDays(firstWeekEnd, 7);
      if (nextWeekEnd > yearEnd) nextWeekEnd = yearEnd;
      weeksInYear.push({
        weekStart,
        weekEnd: nextWeekEnd,
      });
      weekStart = addDays(nextWeekEnd, 1);
      weekIndex++;
    } else {
      weeksInYear.push({
        weekStart,
        weekEnd: firstWeekEnd,
      });
      weekStart = addDays(firstWeekEnd, 1);
      weekIndex++;
    }

    // Remaining weeks (up to 51st)
    while (weekIndex < 51 && weekStart < yearEnd) {
      let weekEnd = addDays(weekStart, 6);
      if (weekEnd > yearEnd) weekEnd = yearEnd;
      weeksInYear.push({ weekStart, weekEnd });
      weekStart = addDays(weekEnd, 1);
      weekIndex++;
    }

    // Last week: all remaining days until the end of the life year
    if (weekStart < yearEnd) {
      const weekEnd = yearEnd;
      weeksInYear.push({ weekStart, weekEnd });
    }

    // Ensure exactly 52 weeks per life year
    if (weeksInYear.length < 52 && weeksInYear.length > 0) {
      // Add remaining days to the last week
      const last = weeksInYear[weeksInYear.length - 1];
      last.weekEnd = yearEnd;
    }
    if (weeksInYear.length > 52) {
      // Merge last weeks
      const last = weeksInYear[51];
      for (let i = 52; i < weeksInYear.length; i++) {
        last.weekEnd = weeksInYear[i].weekEnd;
      }
      weeksInYear = weeksInYear.slice(0, 52);
    }

    // Calculate additional fields for each week
    for (let i = 0; i < weeksInYear.length; i++) {
      const { weekStart, weekEnd } = weeksInYear[i];
      const meta = getWeekMeta({
        weekStart,
        weekEnd,
        yearOfLife,
        weekIndex: i,
        birthDate,
        previousWeek: weeks[i - 1] || null,
      });
      const type = getWeekType(weekStart, weekEnd);
      const holidays = getWeekHolidays(weekStart, weekEnd, birthDate, yearOfLife);
      // Efficient calculation of life month
      const yearsPassed = yearOfLife;
      const monthOfWeek = weekStart.getMonth(); // 0-11
      const monthOfBirth = birthDate.getMonth(); // 0-11
      let monthsFromBirth = yearsPassed * 12 + (monthOfWeek - monthOfBirth);
      if (monthOfWeek < monthOfBirth) {
        monthsFromBirth += 12;
      }
      const dayOfWeek = weekStart.getDate();
      const dayOfBirth = birthDate.getDate();
      if (dayOfWeek < dayOfBirth) {
        monthsFromBirth -= 1;
      }
      const lifeMonth = monthsFromBirth + 1;

      const weekId = `${String(meta.lifeYear).padStart(3, '0')}_w${getWeekNumber(i)}`;

      if (type === EWeekType.Present) {
        todayWeekId = weekId;
        todayWeekIndex = weeks.length;
      }

      weeks.push({
        id: weekId,
        dateStart: format(weekStart, ISO_DATE_FORMAT),
        dateEnd: format(weekEnd, ISO_DATE_FORMAT),
        type,
        lifeMonth,
        lifeYear: meta.lifeYear,
        year: meta.year,
        secondYear: meta.secondYear,
        month: meta.month,
        secondMonth: meta.secondMonth,
        season: meta.season,
        secondSeason: meta.secondSeason,
        isLeapYear: meta.isLeapYear,
        isSeasonPreview: meta.isSeasonPreview,
        isMonthPreview: meta.isMonthPreview,
        holidays,
        yearZodiacLabel: getZodiac(getYear(weekStart)),
        days: meta.days,
        comments: null,
        description: null,
      });
    }
  }

  return { weeks, todayWeekId, todayWeekIndex, drawWeekIndexes };
};
