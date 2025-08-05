import { EWeekType } from '@/types';

/**
 * Returns HEX color for week border based on week type and theme.
 *
 * @param type - Type of the week (Past, Present, Future).
 * @param theme - Theme palette object with HEX color values.
 * @returns HEX color string for the border of the week.
 *
 */
export const getBorderColor = (type: EWeekType, theme: Record<string, string>): string => {
  if (type === EWeekType.Past) return theme.weekPast;
  if (type === EWeekType.Present) return theme.weekPresent;
  if (type === EWeekType.Future) return theme.weekFuture;
  return theme.defaultWeekBorder;
};
