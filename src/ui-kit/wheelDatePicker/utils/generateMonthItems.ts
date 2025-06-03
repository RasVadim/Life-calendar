import { format } from 'date-fns';
import type { Locale } from 'date-fns';

import type { TItem } from './generateYearItems';

export const generateMonthItems = (locale?: Locale): TItem[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: format(new Date(2000, i, 1), 'LLLL', { locale })
  }));
}; 