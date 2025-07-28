import { HOLIDAY_NAMES } from '@/constants';
import { THolidayName } from '@/types';

/**
 * Returns HEX color for week background based on holidays and theme.
 *
 * @param theme - Theme palette object with HEX color values.
 * @param holiday - holiday name for the week (may be null or empty).
 * @returns HEX color string for the background of the week.
 *
 */
export const getBGColor = (
  theme: Record<string, string>,
  holidays?: THolidayName | null,
): string => {
  if (!holidays) return theme.defaultWeekBg;
  if (holidays === HOLIDAY_NAMES.newYear) return theme.newYear;
  if (holidays === HOLIDAY_NAMES.birthday) return theme.birthday;
  if (holidays === HOLIDAY_NAMES.Feb23) return theme.feb23;
  if (holidays === HOLIDAY_NAMES.Mar8) return theme.mar8;
  return theme.defaultWeekBg;
};
