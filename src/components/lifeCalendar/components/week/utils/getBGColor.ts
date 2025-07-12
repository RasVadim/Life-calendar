import { HOLIDAY_NAMES } from '@/constants';
import { THolidayName } from '@/types';

export const getBGColor = (holidays: THolidayName[] | null) => {
  if (holidays?.[0] === HOLIDAY_NAMES.newYear) return 'var(--new-year-color)';
  if (holidays?.[0] === HOLIDAY_NAMES.birthday) return 'var(--birthday-color)';
  if (holidays?.[0] === HOLIDAY_NAMES.Feb23) return 'var(--feb-23-color)';
  if (holidays?.[0] === HOLIDAY_NAMES.Mar8) return 'var(--mar-8-color)';
  return 'var(--default-week-bg-color)';
};
