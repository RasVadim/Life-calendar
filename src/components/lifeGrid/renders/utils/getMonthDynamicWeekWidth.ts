import { LARGE_MONTH_WEEK_SIZE_MULTIPLIER } from '../../constants';

/**
 * Calculate dynamic week width for any row configuration with side margins
 *
 * @param weeksPerRow - Total number of weeks in the row (4 or 5)
 * @param containerWidth - Total available width of the container
 * @param weekGap - Gap between weeks in pixels
 * @returns Width of a normal week in pixels
 */
export const getMonthDynamicWeekWidth = (
  weeksPerRow: number,
  containerWidth: number,
  weekGap: number,
): number => {
  const gapsBetweenWeeks = (weeksPerRow - 1) * weekGap;
  const sideMargins = 2 * weekGap; // Left and right margins equal to weekGap
  const totalGaps = gapsBetweenWeeks + sideMargins;
  const totalWeekWidthMultiplier = weeksPerRow - 1 + LARGE_MONTH_WEEK_SIZE_MULTIPLIER;
  return (containerWidth - totalGaps) / totalWeekWidthMultiplier;
};
