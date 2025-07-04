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
import { updateDBTodayWeek } from '@/store/clientDB';
import { EWeekType } from '@/types/life';

import { getWeekHolidays } from './getWeekHolidays';
import { getWeekMeta } from './getWeekMeta';
import { getWeekType } from './getWeekType';
import { getZodiac } from './getZodiac';

/**
 * Generates an array of life weeks for a given birth date and lifespan or death date.
 * Each year of life will always have exactly 52 weeks (with possible expanded first/last week).
 *
 * @param {string} birthDateISO - User's birth date in ISO format (e.g. '1990-03-07')
 * @param {number} [lifeSpanYears=DEFAULT_LIFE_SPAN_YEARS] - Expected lifespan in years
 * @param {string} [deathDateISO] - Optional death date in ISO format (e.g. '2080-03-07')
 * @returns {IWeek[]} Array of week objects for the entire life
 */
export const generateWeeks = (
  birthDateISO: string,
  lifeSpanYears: number = DEFAULT_LIFE_SPAN_YEARS,
  deathDateISO?: string,
) => {
  const weeks = [];
  const birthDate = startOfDay(new Date(birthDateISO));
  let deathDate: Date;
  let yearsToGenerate: number;

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
        isExpandedByYear: true,
      });
      weekStart = addDays(nextWeekEnd, 1);
      weekIndex++;
    } else {
      weeksInYear.push({
        weekStart,
        weekEnd: firstWeekEnd,
        isExpandedByYear: false,
      });
      weekStart = addDays(firstWeekEnd, 1);
      weekIndex++;
    }

    // Remaining weeks (up to 51st)
    while (weekIndex < 51 && weekStart < yearEnd) {
      let weekEnd = addDays(weekStart, 6);
      if (weekEnd > yearEnd) weekEnd = yearEnd;
      weeksInYear.push({ weekStart, weekEnd, isExpandedByYear: false });
      weekStart = addDays(weekEnd, 1);
      weekIndex++;
    }

    // Last week: all remaining days until the end of the life year
    if (weekStart < yearEnd) {
      const weekEnd = yearEnd;
      const isExpanded = differenceInDays(weekEnd, weekStart) + 1 > 7;
      weeksInYear.push({ weekStart, weekEnd, isExpandedByYear: isExpanded });
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
      last.isExpandedByYear = true;
    }

    // Calculate additional fields for each week
    for (let i = 0; i < weeksInYear.length; i++) {
      const { weekStart, weekEnd, isExpandedByYear } = weeksInYear[i];
      const meta = getWeekMeta(weekStart, weekEnd, yearOfLife, i, weeksInYear.length);
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

      const weekId = `w${String(meta.year).padStart(3, '0')}_${String(i + 1).padStart(2, '0')}`;

      if (type === EWeekType.Present) {
        updateDBTodayWeek({ todayWeekId: weekId, todayWeekIndex: weeks.length });
      }

      weeks.push({
        id: weekId,
        dateStart: format(weekStart, ISO_DATE_FORMAT),
        dateEnd: format(weekEnd, ISO_DATE_FORMAT),
        type,
        month: lifeMonth,
        year: meta.year,
        dateYear: meta.dateYear,
        dateMonth: meta.dateMonth,
        dateSeason: meta.dateSeason,
        numberOfDays: meta.days.length,
        isFirst: meta.isFirst,
        isLast: meta.isLast,
        isFirstInYear: meta.isFirstInYear,
        isLastInYear: meta.isLastInYear,
        isFirstInMonth: meta.isFirstInMonth,
        isLastInMonth: meta.isLastInMonth,
        isExpandedByYear,
        isExpandedByDateSeason:
          (meta.isFirstInSeason || meta.isLastInSeason) && meta.days.length > 7,
        isExpandedByDateMonth: (meta.isFirstInMonth || meta.isLastInMonth) && meta.days.length > 7,
        isPartialByYear: (meta.isFirst || meta.isLast) && meta.days.length < 7,
        isPartialByDateSeason:
          (meta.isFirstInSeason || meta.isLastInSeason) && meta.days.length < 7,
        isPartialByDateMonth: (meta.isFirstInMonth || meta.isLastInMonth) && meta.days.length < 7,
        isLeapYear: meta.isLeap,
        holidays,
        yearZodiacLabel: getZodiac(getYear(weekStart)),
      });
    }
  }
  return weeks;
};
