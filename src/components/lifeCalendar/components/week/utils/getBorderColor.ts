import { EWeekType } from '@/types';

export const getBorderColor = (type: EWeekType) => {
  if (type === EWeekType.Past) return 'var(--week-past-color)';
  if (type === EWeekType.Present) return 'var(--week-present-color)';
  if (type === EWeekType.Future) return 'var(--week-future-color)';
};
