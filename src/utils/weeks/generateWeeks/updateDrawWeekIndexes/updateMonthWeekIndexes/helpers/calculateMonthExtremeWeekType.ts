import { EMonthsEndsIndxsValues } from '@/types';

export enum EWeekPosition {
  First = 'first',
  Last = 'last',
}

/**
 * Calculates the type of the first or last week of life based on its position relative to months
 * @param weekTimePoints - Array of week time points
 * @param position - Whether this is the first or last week
 * @returns The appropriate EMonthsEndsIndxsValues type for the week
 */
export const calculateMonthExtremeWeekType = (
  weekTimePoints: { weekStart: Date; weekEnd: Date }[],
  position: EWeekPosition,
): EMonthsEndsIndxsValues => {
  // First week is index 0; last week is the real (possibly partial) death week
  // at length-1 — it ends exactly on the death date, so its day may be any weekday.
  const weekIndex = position === EWeekPosition.First ? 0 : weekTimePoints.length - 1;
  const weekStart = weekTimePoints[weekIndex].weekStart;
  const weekEnd = weekTimePoints[weekIndex].weekEnd;

  // For first week: check if starts on Monday, for last week: check if ends on Sunday
  const isFullWeek =
    position === EWeekPosition.First
      ? weekStart.getDay() === 1 // Monday
      : weekEnd.getDay() === 0; // Sunday

  // Check if start and end are in the same month
  const isSameMonth = weekStart.getMonth() === weekEnd.getMonth();

  // Check border condition: for first week check next week, for last week check previous week
  const borderWeek =
    position === EWeekPosition.First
      ? weekTimePoints[weekIndex + 1]?.weekStart
      : weekTimePoints[weekIndex - 1]?.weekEnd;

  const isBorderCondition = borderWeek
    ? position === EWeekPosition.First
      ? weekStart.getMonth() !== borderWeek.getMonth()
      : weekEnd.getMonth() !== borderWeek.getMonth()
    : false;

  if (isFullWeek) {
    if (isSameMonth) {
      return isBorderCondition ? EMonthsEndsIndxsValues.FullBorderEnd : EMonthsEndsIndxsValues.Full;
    } else {
      return EMonthsEndsIndxsValues.FullBorder;
    }
  } else {
    if (isSameMonth) {
      return isBorderCondition ? EMonthsEndsIndxsValues.HalfBorderEnd : EMonthsEndsIndxsValues.Half;
    } else {
      return EMonthsEndsIndxsValues.HalfBorder;
    }
  }
};
