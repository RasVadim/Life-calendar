import type { TItem } from './generateYearItems';
import { getDaysInMonth } from './getDaysInMonth';

export const generateDayItems = (year: number, month: number): TItem[] => {
  const days = getDaysInMonth(year, month);
  return Array.from({ length: days }, (_, i) => ({ value: i + 1, label: (i + 1).toString() }));
}; 