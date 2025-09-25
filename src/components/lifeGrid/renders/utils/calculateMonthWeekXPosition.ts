type TCalculateWeekXPositionParams = {
  currentCol: number;
  weekGap: number;
  containerWidth: number;
  accumulatedOffsetX: number;
  weeksPerRow: number;
  fixedWeekWidth: number;
  largeWeekWidth: number;
};

/**
 * Calculate X position for a week in months mode with conditional centering
 *
 * @param currentCol - Current column index (0-based)
 * @param weekGap - Gap between weeks in pixels
 * @param containerWidth - Total available width of the container
 * @param accumulatedOffsetX - Accumulated horizontal offset from large weeks in current row
 * @param weeksPerRow - Total number of weeks in the row (4 or 5)
 * @returns X coordinate for the week
 *
 */
export const calculateMonthWeekXPosition = ({
  currentCol,
  weekGap,
  containerWidth,
  accumulatedOffsetX,
  weeksPerRow,
  fixedWeekWidth,
  largeWeekWidth,
}: TCalculateWeekXPositionParams): number => {
  // Calculate actual row width with fixed week sizes
  const normalWeeksCount = weeksPerRow - 1;
  const gapsBetweenWeeks = (weeksPerRow - 1) * weekGap;

  const actualRowWidth = normalWeeksCount * fixedWeekWidth + largeWeekWidth + gapsBetweenWeeks;

  let rowStartX: number;

  if (weeksPerRow === 5) {
    // Full row: use side margins (content fills width with margins)
    const sideMargin = weekGap;
    rowStartX = sideMargin;
  } else {
    // Shorter row: center without side margins
    rowStartX = (containerWidth - actualRowWidth) / 2;
  }

  // Calculate base position for current column using fixed width
  const baseX = rowStartX + currentCol * (fixedWeekWidth + weekGap);

  // Add accumulated offset from large weeks that came before this position
  return baseX + accumulatedOffsetX;
};
