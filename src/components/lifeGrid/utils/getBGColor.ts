import { HOLIDAY_NAMES } from '@/constants';
import { THolidayName } from '@/types';

/**
 * Returns HEX color for week background based on holidays and theme.
 *
 * @param holidays - Array of holiday names for the week (may be null or empty).
 * @param theme - Theme palette object with HEX color values.
 * @returns HEX color string for the background of the week.
 *
 */
export const getBGColor = (
  holidays: THolidayName[] | null,
  theme: Record<string, string>,
): string => {
  if (!holidays || !holidays.length) return theme.defaultWeekBg;
  if (holidays[0] === HOLIDAY_NAMES.newYear) return theme.newYear;
  if (holidays[0] === HOLIDAY_NAMES.birthday) return theme.birthday;
  if (holidays[0] === HOLIDAY_NAMES.Feb23) return theme.feb23;
  if (holidays[0] === HOLIDAY_NAMES.Mar8) return theme.mar8;
  return theme.defaultWeekBg;
};
