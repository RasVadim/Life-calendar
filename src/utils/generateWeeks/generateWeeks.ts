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
import { ESeason, EWeekType, HOLIDAY_NAMES } from '@/types/life';

import {getMajorityDate} from './getMajorityDate';
import {getZodiac} from './getZodiac';

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
  const weeks = [];
  const birthDate = startOfDay(new Date(birthDateISO));
  const deathDate = startOfDay(addYears(birthDate, lifeSpanYears));

  for (let yearOfLife = 0; yearOfLife < lifeSpanYears; yearOfLife++) {
    const yearStart = yearOfLife === 0 ? birthDate : addYears(birthDate, yearOfLife);
    const yearEnd = yearOfLife === lifeSpanYears - 1 ? deathDate : addYears(birthDate, yearOfLife + 1);
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
      weeksInYear.push({ weekStart, weekEnd: nextWeekEnd, isExpandedByYear: true });
      weekStart = addDays(nextWeekEnd, 1);
      weekIndex++;
    } else {
      weeksInYear.push({ weekStart, weekEnd: firstWeekEnd, isExpandedByYear: false });
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
      const isExpanded = (differenceInDays(weekEnd, weekStart) + 1) > 7;
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
      const days: Date[] = [];
      for (
        let d = weekStart;
        d <= weekEnd;
        d = addDays(d, 1)
      ) {
        days.push(d);
      }
      const dateYear = getMajorityDate(days, 'year');
      const dateMonth = String(getMonth(weekStart) + 1).padStart(2, '0');
      const dateSeason = getMajorityDate(days, 'season') as ESeason;
      const year = yearOfLife + 1; // life year number: 1 — from birth to 1 year, 2 — from 1 to 2 years, etc.
      const isFirst = i === 0;
      const isLast = i === weeksInYear.length - 1;
      const isFirstInYear = isFirst;
      const isLastInYear = isLast;
      const isFirstInMonth = getDate(weekStart) === 1;
      const isLastInMonth = getDate(weekEnd) === getDate(addDays(weekEnd, 1)) - 1;
      const isLeap = isLeapYear(weekStart);
      const zodiac = getZodiac(getYear(weekStart));

      // Определяем текущую дату для расчёта type
      const today = startOfDay(new Date());
      let type: EWeekType = EWeekType.Past;
      if (today >= weekStart && today <= weekEnd) {
        type = EWeekType.Present;
      } else if (today < weekStart) {
        type = EWeekType.Future;
      }

      // isExpandedByDateSeason: first or last week of season and days > 7
      const isFirstInSeason = i === 0 || dateSeason !== getMajorityDate(Array.from({length: 7}, (_, k) => addDays(weekStart, -k-1)).map(d => d), 'season');
      const isLastInSeason = i === weeksInYear.length - 1 || dateSeason !== getMajorityDate(Array.from({length: 7}, (_, k) => addDays(weekEnd, k+1)).map(d => d), 'season');
      const isExpandedByDateSeason = (isFirstInSeason || isLastInSeason) && days.length > 7;

      // isExpandedByDateMonth: first or last week of month and days > 7
      const isExpandedByDateMonth = (isFirstInMonth || isLastInMonth) && days.length > 7;

      // isPartialByYear: first or last week of life year and days < 7
      const isPartialByYear = (isFirst || isLast) && days.length < 7;
      // isPartialByDateSeason: first or last week of season and days < 7
      const isPartialByDateSeason = (isFirstInSeason || isLastInSeason) && days.length < 7;
      // isPartialByDateMonth: first or last week of month and days < 7
      const isPartialByDateMonth = (isFirstInMonth || isLastInMonth) && days.length < 7;

      // Efficient calculation of life month
      const yearsPassed = yearOfLife;
      const monthOfWeek = getMonth(weekStart); // 0-11
      const monthOfBirth = getMonth(birthDate); // 0-11
      let monthsFromBirth = yearsPassed * 12 + (monthOfWeek - monthOfBirth);
      if (monthOfWeek < monthOfBirth) {
        monthsFromBirth += 12;
      }
      const dayOfWeek = getDate(weekStart);
      const dayOfBirth = getDate(birthDate);
      if (dayOfWeek < dayOfBirth) {
        monthsFromBirth -= 1;
      }
      const lifeMonth = monthsFromBirth + 1;

      // Calculate holidays for the week
      const holidays: typeof HOLIDAY_NAMES[keyof typeof HOLIDAY_NAMES][] = [];
      // Birthday
      const birthDay = getDate(birthDate);
      const birthMonth = getMonth(birthDate) + 1;
      for (let d = weekStart; d <= weekEnd; d = addDays(d, 1)) {
        if (getDate(d) === birthDay && getMonth(d) + 1 === birthMonth) {
          holidays.push(HOLIDAY_NAMES.birthday);
          break;
        }
      }
      // New Year
      for (let d = weekStart; d <= weekEnd; d = addDays(d, 1)) {
        if (getDate(d) === 1 && getMonth(d) + 1 === 1) {
          holidays.push(HOLIDAY_NAMES.newYear);
          break;
        }
      }
      // 23 February
      for (let d = weekStart; d <= weekEnd; d = addDays(d, 1)) {
        if (getDate(d) === 23 && getMonth(d) + 1 === 2) {
          holidays.push(HOLIDAY_NAMES.Feb23);
          break;
        }
      }
      // 8 March
      for (let d = weekStart; d <= weekEnd; d = addDays(d, 1)) {
        if (getDate(d) === 8 && getMonth(d) + 1 === 3) {
          holidays.push(HOLIDAY_NAMES.Mar8);
          break;
        }
      }
      // Birthday always first if present
      if (holidays.includes(HOLIDAY_NAMES.birthday)) {
        const filtered = holidays.filter(h => h !== HOLIDAY_NAMES.birthday);
        holidays.splice(0, holidays.length, HOLIDAY_NAMES.birthday, ...filtered);
      }

      weeks.push({
        id: `w${String(year).padStart(2, '0')}_${String(i + 1).padStart(2, '0')}`,
        dateStart: format(weekStart, 'yyyy-MM-dd'),
        dateEnd: format(weekEnd, 'yyyy-MM-dd'),
        type,
        month: lifeMonth,
        year,
        dateYear,
        dateMonth,
        dateSeason,
        numberOfDays: days.length,
        isFirst,
        isLast,
        isFirstInYear,
        isLastInYear,
        isFirstInMonth,
        isLastInMonth,
        isExpandedByYear,
        isExpandedByDateSeason,
        isExpandedByDateMonth,
        isPartialByYear,
        isPartialByDateSeason,
        isPartialByDateMonth,
        isLeapYear: isLeap,
        holidays: holidays.length ? holidays : null,
        yearZodiacLabel: zodiac,
      });
    }
  }
  return weeks;
};
