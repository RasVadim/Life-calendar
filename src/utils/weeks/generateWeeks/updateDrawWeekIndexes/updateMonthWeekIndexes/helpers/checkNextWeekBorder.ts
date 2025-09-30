/**
 * Checks if the next week is a border week (starts in birth month, ends in different month)
 * @param weekTimePoints - Array of week time points
 * @param currentWeekIndex - Current week index
 * @param birthMonth - Birth month (0-indexed)
 * @returns True if next week is a border week
 */
export const checkNextWeekBorder = (
  weekTimePoints: { weekStart: Date; weekEnd: Date }[],
  currentWeekIndex: number,
  birthMonth: number,
): boolean => {
  const nextWeek = weekTimePoints[currentWeekIndex + 1];
  return !!(
    nextWeek &&
    nextWeek.weekStart.getMonth() === birthMonth &&
    nextWeek.weekEnd.getMonth() !== birthMonth
  );
};
