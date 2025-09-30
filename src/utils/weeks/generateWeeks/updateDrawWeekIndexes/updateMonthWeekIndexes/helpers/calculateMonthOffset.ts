import { checkNextWeekBorder } from './checkNextWeekBorder';
import { getMondayOfWeek } from './getMondayOfWeek';
import { getWeekOfCalendar } from './getWeekOfCalendar';

// Maximum offsets for different week types
const MAX_OFFSET_BORDER_WEEK = 3;
const MAX_OFFSET_NORMAL_WEEK = 4;

type TCalculateMonthOffsetParams = {
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  currentWeekIndex: number;
  meta: {
    month: string;
    year: string;
    secondMonth: string | null;
  };
};

/**
 * Calculates month offset for proper positioning of first week in month row
 * based on calendar view (Monday-Sunday weeks)
 *
 * @param weekTimePoints - Array of week time points
 * @param currentWeekIndex - Current week index (0 for first week)
 * @param meta - Week metadata containing month, year, secondMonth
 * @returns Month offset (0-4)
 */
export const calculateMonthOffset = ({
  weekTimePoints,
  currentWeekIndex,
  meta,
}: TCalculateMonthOffsetParams): number => {
  const { weekStart } = weekTimePoints[currentWeekIndex];
  const birthMonth = parseInt(meta.month) - 1; // Convert "07" to 6 (0-indexed)
  const birthYear = parseInt(meta.year);

  // Find Monday of the birth week
  const mondayOfBirthWeek = getMondayOfWeek(weekStart);

  // Find Monday of the first calendar week of the birth month
  const firstDayOfMonth = new Date(birthYear, birthMonth, 1);
  const mondayOfFirstCalendarWeek = getMondayOfWeek(firstDayOfMonth);

  // Calculate which week of the calendar this is
  const weekOfCalendar = getWeekOfCalendar(mondayOfBirthWeek, mondayOfFirstCalendarWeek);

  // Check if next week is a border week
  const hasBorderWeek = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);

  // Return appropriate offset based on week type
  const maxOffset = hasBorderWeek ? MAX_OFFSET_BORDER_WEEK : MAX_OFFSET_NORMAL_WEEK;
  return Math.min(weekOfCalendar, maxOffset);
};
