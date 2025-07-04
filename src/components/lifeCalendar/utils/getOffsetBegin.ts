import { LIFE_MODES } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { TLifeMode } from '@/types';

/**
 * Calculates the offset array for empty weeks to align the calendar grid
 * with the start of the current period (month/season) instead of birth date
 *
 * @param columns - Number of columns in the grid (4 for months, 13 for seasons, 52 for years)
 * @param firstWeeks - first 5 (for months) or 14 (for seasons) weeks from weeks
 * @returns Array of empty week indices to prepend to the weeks array
 */
export const getOffsetBegin = (lifeMode: TLifeMode, firstWeeks?: IWeek[]): number[] => {
  // For months mode (4 columns): calculate how many weeks from the first 5 fall into the month of the first week
  if (lifeMode === LIFE_MODES.MONTHS && firstWeeks && firstWeeks.length) {
    const firstMonth = firstWeeks[0].dateMonth;
    const inMonth = firstWeeks.filter((w) => w.dateMonth === firstMonth).length;
    if (inMonth < 4) {
      return Array.from({ length: 4 - inMonth }, (_, i) => i);
    }
    return [];
  }

  // For seasons mode (13 columns): calculate how many weeks from the first 14 fall into the season of the first week
  if (lifeMode === LIFE_MODES.SEASONS && firstWeeks && firstWeeks.length) {
    const firstSeason = firstWeeks[0].dateSeason;
    const inSeason = firstWeeks.filter((w) => w.dateSeason === firstSeason).length;
    if (inSeason < 13) {
      return Array.from({ length: 13 - inSeason }, (_, i) => i);
    }
    return [];
  }

  // For years mode, no padding is needed
  if (lifeMode === LIFE_MODES.YEARS) {
    return [];
  }

  // Default: no offset
  return [];
};
