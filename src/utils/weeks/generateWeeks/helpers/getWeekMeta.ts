import { addDays, isLeapYear } from 'date-fns';

import { IWeek } from '@/store/clientDB';
import { EDateSegment, EDayOfWeek, ESeason, TDay } from '@/types';

import { generateDay } from '../generateDay';
import { getDateSegment } from './getDateSegment';

type TGetWeekMetaParams = {
  weekStart: Date;
  weekEnd: Date;
  yearOfLife: number;
  birthDate: Date;
  weekIndex: number;
  previousWeek: IWeek | null;
};

type TGetWeekMetaResult = Pick<
  IWeek,
  | 'lifeYear'
  | 'isLeapYear'
  | 'isSeasonPreview'
  | 'isMonthPreview'
  | 'days'
  | 'month'
  | 'secondMonth'
  | 'year'
  | 'secondYear'
  | 'season'
  | 'secondSeason'
>;

/**
 * Returns meta info for the week
 * @param {Date} weekStart
 * @param {Date} weekEnd
 * @param {number} yearOfLife
 * @param {Date} birthDate
 * @param {number} weekIndex - week index in year
 * @returns {object} meta info
 */
export const getWeekMeta = ({
  weekStart,
  weekEnd,
  yearOfLife,
  weekIndex,
  birthDate,
  previousWeek,
}: TGetWeekMetaParams): TGetWeekMetaResult => {
  const days: TDay[] = [];
  for (let d = weekStart; d <= weekEnd; d = addDays(d, 1)) {
    const day = generateDay({ date: d, weekStart, weekIndex, birthDate, yearOfLife });
    days.push(day);
  }

  const year = getDateSegment(weekStart, EDateSegment.Year)!;
  const secondYear = getDateSegment(weekEnd, EDateSegment.Year);
  // Ensure dateMonth is always two digits (e.g. '01', '02', ..., '12')
  const month = getDateSegment(weekStart, EDateSegment.Month)!;
  const secondMonth = getDateSegment(weekEnd, EDateSegment.Month);
  const season = getDateSegment(weekStart, EDateSegment.Season) as ESeason;
  const secondSeason = getDateSegment(weekEnd, EDateSegment.Season) as ESeason;
  const lifeYear = yearOfLife + 1;
  const isLeap = isLeapYear(weekStart);

  // Check if week starts on Monday (day 1) and is the first week of a new season
  const isWeekStartMonday = days[0].dayOfWeek === EDayOfWeek.Monday; // Monday is day 1

  const isMonthPreview =
    !!previousWeek?.secondMonth || (previousWeek?.month !== month && isWeekStartMonday);
  const isSeasonPreview =
    !!previousWeek?.secondSeason || (previousWeek?.season !== season && isWeekStartMonday);

  return {
    days,
    month,
    secondMonth: month === secondMonth ? null : secondMonth,
    year,
    secondYear: year === secondYear ? null : secondYear,
    season,
    secondSeason: season === secondSeason ? null : secondSeason,
    lifeYear,
    isLeapYear: isLeap,
    isMonthPreview,
    isSeasonPreview,
  };
};
