import { EDateSegment, ESeason } from '@/types';

import { getDateSegment } from '../../helpers';

/**
 * Extracts date segments for start and end dates of a week.
 * Returns segments with null for secondX values when they match the start date.
 *
 * @param weekStart - Start date of the week
 * @param weekEnd - End date of the week
 * @returns Object with year, month, season segments and their optional second values
 */
export const extractDateSegments = (weekStart: Date, weekEnd: Date) => {
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
