import { format, parseISO } from 'date-fns';

import { UI_DATE_FORMAT } from '@/constants';

/**
 * Formats a date string from ISO format (yyyy-MM-dd) to UI format (yyyy.MM.dd).
 * If the date is null or undefined, returns a placeholder or empty string.
 *
 * @param {string | null | undefined} date - The date string in ISO format to format.
 * @param {string} [placeholder] - Optional placeholder text to return if date is null/undefined.
 * @returns {string} The formatted date string in UI format or placeholder/empty string.
 */
export const formatDateToUI = (date: string | null | undefined, placeholder?: string) => {
  if (!date) return placeholder || '';
  return format(parseISO(date), UI_DATE_FORMAT);
};
