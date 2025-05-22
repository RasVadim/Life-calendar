import { LIFE_GRID_ZOOM_LEVELS } from "@/constants";

// Constants for gap calculation
const MAX_COLUMNS = LIFE_GRID_ZOOM_LEVELS.years;    // Maximum number of columns in the grid (52 weeks)
const MIN_COLUMNS = LIFE_GRID_ZOOM_LEVELS.months;  // Minimum number of columns in the grid (4 seasons)
const MEDIUM_COLUMNS = LIFE_GRID_ZOOM_LEVELS.seasons; // Middle point where gap = MEDIUM_GAP (12 months)

const MIN_GAP = 1;   // Minimum gap (in px) when columns = MAX_COLUMNS
const MAX_GAP = 55;  // Maximum gap (in px) when columns = MIN_COLUMNS
const MEDIUM_GAP = 25; // Gap value at the middle point (in px)

/**
 * Calculates the row gap size based on the current number of columns.
 * The gap changes dynamically with each column count change:
 * - For years view (52 columns): gap = 1px
 * - For months view (12 columns): gap = 25px
 * - For seasons view (4 columns): gap = 55px
 * Linear interpolation is used between these points.
 *
 * @param {number} columns - The current number of columns in the grid.
 * 
 * @returns {number} The calculated row gap size in pixels.
 */
export const calculateRowGapSize = (columns: number): number => {
  if (columns >= MAX_COLUMNS) return MIN_GAP;
  if (columns <= MIN_COLUMNS) return MAX_GAP;

  // For range between months and years view
  if (columns > MEDIUM_COLUMNS) {
    const range = MAX_COLUMNS - MEDIUM_COLUMNS;
    const position = columns - MEDIUM_COLUMNS;
    const gapDiff = MEDIUM_GAP - MIN_GAP;
    return Math.round(MEDIUM_GAP - (gapDiff * position) / range);
  }
  
  // For range between seasons and months view
  const range = MEDIUM_COLUMNS - MIN_COLUMNS;
  const position = columns - MIN_COLUMNS;
  const gapDiff = MAX_GAP - MEDIUM_GAP;
  return Math.round(MAX_GAP - (gapDiff * position) / range);
}; 