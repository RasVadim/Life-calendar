import { HOLIDAY_NAMES } from '@/constants';
import { EWeekType, THolidayName } from '@/types';

// Theme-preview cell colours as CSS vars. Kept local to the preview — the live
// grid is canvas-rendered and computes colours from the theme object instead.
export const getBGColor = (holidays: THolidayName[] | null) => {
  if (holidays?.[0] === HOLIDAY_NAMES.newYear) return 'var(--new-year-color)';
  if (holidays?.[0] === HOLIDAY_NAMES.birthday) return 'var(--birthday-color)';
  if (holidays?.[0] === HOLIDAY_NAMES.Feb23) return 'var(--feb-23-color)';
  if (holidays?.[0] === HOLIDAY_NAMES.Mar8) return 'var(--mar-8-color)';
  return 'var(--default-week-bg-color)';
};

export const getBorderColor = (type: EWeekType) => {
  if (type === EWeekType.Past) return 'var(--week-past-color)';
  if (type === EWeekType.Present) return 'var(--week-present-color)';
  if (type === EWeekType.Future) return 'var(--week-future-color)';
};
