import { format, parseISO } from 'date-fns';

import { UI_DATE_FORMAT } from '@/constants';

export const formatDateToUI = (date: string | null | undefined, placeholder?: string) => {
  if (!date) return placeholder || '';
  return format(parseISO(date), UI_DATE_FORMAT);
};
