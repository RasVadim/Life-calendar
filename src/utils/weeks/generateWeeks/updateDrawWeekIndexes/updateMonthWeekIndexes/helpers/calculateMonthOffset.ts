type TCalculateMonthOffsetParams = {
  firstDayDate: string;
};

/**
 * Calculates month offset for proper positioning of first week in month row
 *
 * @param firstDayDate - Date string of first day of week (YYYY-MM-DD format)
 * @returns Month offset (0-4)
 */
export const calculateMonthOffset = ({ firstDayDate }: TCalculateMonthOffsetParams): number => {
  // Calculate offset from month start to first week
  const firstWeekDate = new Date(firstDayDate);
  const firstWeekMonth = firstWeekDate.getMonth();
  const firstWeekYear = firstWeekDate.getFullYear();
  const monthStart = new Date(firstWeekYear, firstWeekMonth, 1);

  // Calculate days from month start to first day of week
  const daysFromMonthStart = Math.floor(
    (firstWeekDate.getTime() - monthStart.getTime()) / (24 * 60 * 60 * 1000),
  );

  // Convert days to weeks offset
  const weekOffset = Math.floor(daysFromMonthStart / 7);

  return Math.min(weekOffset, 4);
};
