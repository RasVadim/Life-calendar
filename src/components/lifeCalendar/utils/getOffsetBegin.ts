import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';

/**
 * Calculates the offset array for empty weeks to align the calendar grid
 * with the start of the current period (month/season) instead of birth date
 *
 * @param columns - Number of columns in the grid (4 for months, 13 for seasons, 52 for years)
 * @param birthDate - User's birth date in ISO string format
 * @returns Array of empty week indices to prepend to the weeks array
 *
 * @example
 * // For months mode (4 columns) - if user was born on 15th day of month
 * // Returns [0, 1] to add 2 empty weeks before the birth week
 * getOffsetBegin(4, '1991-07-15') // Returns [0, 1]
 *
 * @example
 * // For seasons mode (13 columns) - if user was born in 5th week of season
 * // Returns [0, 1, 2, 3] to add 4 empty weeks before the birth week
 * getOffsetBegin(13, '1991-07-07') // Returns [0, 1, 2, 3, 4, 5]
 *
 * @example
 * // For years mode (52 columns) - no offset needed
 * getOffsetBegin(52, '1991-07-07') // Returns []
 */
export const getOffsetBegin = (columns: number, birthDate?: string | null): number[] => {
  if (!birthDate) {
    return [];
  }

  const date = new Date(birthDate);

  // For years mode, no padding is needed
  if (columns === LIFE_GRID_ZOOM_LEVELS.years) {
    return [];
  }

  // For months mode (4 columns): calculate weeks from start of month to birth week
  if (columns === LIFE_GRID_ZOOM_LEVELS.months) {
    const dayOfMonth = date.getDate(); // 1-31
    const weekOfMonth = Math.ceil(dayOfMonth / 7) - 1; // 0-3 (0 = first week, 3 = last week)

    // Return array of empty weeks to fill from start of month to birth week
    return Array.from({ length: weekOfMonth }, (_, i) => i);
  }

  // For seasons mode (13 columns): calculate weeks from start of season to birth week
  if (columns === LIFE_GRID_ZOOM_LEVELS.seasons) {
    const month = date.getMonth(); // 0-11

    // Determine which season this month belongs to and its start month
    let seasonStartMonth: number;
    if (month >= 2 && month <= 4) {
      // Spring: March (2), April (3), May (4) - starts from March
      seasonStartMonth = 2;
    } else if (month >= 5 && month <= 7) {
      // Summer: June (5), July (6), August (7) - starts from June
      seasonStartMonth = 5;
    } else if (month >= 8 && month <= 10) {
      // Autumn: September (8), October (9), November (10) - starts from September
      seasonStartMonth = 8;
    } else {
      // Winter: December (11), January (0), February (1) - starts from December
      seasonStartMonth = 11;
    }

    // Calculate days from start of season to birth date
    const seasonStartDate = new Date(date.getFullYear(), seasonStartMonth, 1);
    const daysFromSeasonStart = Math.floor(
      (date.getTime() - seasonStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate which week of the season this is (0-12)
    const weekOfSeason = Math.ceil((daysFromSeasonStart + 1) / 7) - 1;

    // Return array of empty weeks to fill from start of season to birth week
    return Array.from({ length: weekOfSeason }, (_, i) => i);
  }

  // Default: no offset
  return [];
};
