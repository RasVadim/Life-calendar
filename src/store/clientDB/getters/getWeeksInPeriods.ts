import { lifeCalendarDB } from '@/store/clientDB';
import { IWeek } from '@/store/clientDB';

/**
 * Loads weeks for month and season in parallel
 */
export const getWeeksInPeriods = async (
  month: string,
  season: string,
  year: string,
): Promise<[IWeek[], IWeek[]]> => {
  return Promise.all([
    lifeCalendarDB.weeks
      .where('month')
      .equals(month)
      .and((w) => w.year === year)
      .toArray(),

    lifeCalendarDB.weeks
      .where('season')
      .equals(season)
      .and((w) => w.year === year)
      .toArray(),
  ]);
};
