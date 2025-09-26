import { EDateSegment, ESeason } from '@/types';

/**
 * Returns season by month
 * @param {number} month - Month number (0-11)
 * @returns {ESeason} Season name
 */
const getSeason = (month: number): ESeason => {
  if (month === 11 || month === 0 || month === 1) return ESeason.Winter;
  if (month >= 2 && month <= 4) return ESeason.Spring;
  if (month >= 5 && month <= 7) return ESeason.Summer;
  return ESeason.Autumn;
};

/**
 * Determines which year/month/season the date belongs to
 * @param {Date} date - Date to determine the segment for
 * @param {EDateSegment} type - Type of segment to determine
 * @returns {string} Year/month/season
 */
export const getDateSegment = (date: Date, type: EDateSegment) => {
  switch (type) {
    case EDateSegment.Year:
      return String(date.getFullYear());
    case EDateSegment.Month:
      return String(date.getMonth() + 1).padStart(2, '0');
    case EDateSegment.Season:
      return getSeason(date.getMonth());
    default:
      return null;
  }
};

/**
 * Extracts all date segments for start and end dates of a week.
 * Returns segments with null for secondX values when they match the start date.
 *
 * @param weekStart - Start date of the week
 * @param weekEnd - End date of the week
 * @returns Object with year, month, season segments and their optional second values
 */
export const getDateSegments = (weekStart: Date, weekEnd: Date) => {
  const year = getDateSegment(weekStart, EDateSegment.Year)!;
  const secondYear = getDateSegment(weekEnd, EDateSegment.Year);

  const month = getDateSegment(weekStart, EDateSegment.Month)!;
  const secondMonth = getDateSegment(weekEnd, EDateSegment.Month);

  const season = getDateSegment(weekStart, EDateSegment.Season) as ESeason;
  const secondSeason = getDateSegment(weekEnd, EDateSegment.Season) as ESeason;

  return {
    year,
    secondYear: year === secondYear ? null : secondYear,
    month,
    secondMonth: month === secondMonth ? null : secondMonth,
    season,
    secondSeason: season === secondSeason ? null : secondSeason,
  };
};
