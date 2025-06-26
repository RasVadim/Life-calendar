import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';

/**
 * Calculates the top padding for the grid container based on the number of columns.
 * - For 52 columns: padding = 2px
 * - For 13 columns and less: padding = 40px
 * - Linear interpolation between 52 and 13 columns
 *
 * @param {number} columns - The current number of columns in the grid.
 *
 * @returns {number} The calculated top padding in pixels.
 */
export const calculateTopPadding = (columns: number): number => {
  const MAX_COLUMNS = LIFE_GRID_ZOOM_LEVELS.years; // 52
  const COLUMNS_AT_13 = 13;
  const PADDING_AT_13 = 40;
  const MIN_PADDING = 2;

  if (columns >= MAX_COLUMNS) return MIN_PADDING;
  if (columns <= COLUMNS_AT_13) return PADDING_AT_13;

  // Linear interpolation between 2 and 40
  const range = MAX_COLUMNS - COLUMNS_AT_13;
  const position = columns - COLUMNS_AT_13;
  return Math.round(PADDING_AT_13 - ((PADDING_AT_13 - MIN_PADDING) * position) / range);
};
