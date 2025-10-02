import { format, parseISO } from 'date-fns';

import { COMPACT_DATE_FORMAT } from '@/constants';

/**
 * Formats a date (string or Date object) to Key format (yyyyMMdd).
 * If the date is null or undefined, returns a placeholder or empty string.
 *
 * @param {string | Date | null | undefined} date - The date string in ISO format or Date object to format.
 * @param {string} [placeholder] - Optional placeholder text to return if date is null/undefined.
 * @returns {string} The formatted date string in UI format or placeholder/empty string.
 */
export const formatDateToKey = (date: string | Date | null | undefined, placeholder?: string) => {
  if (!date) return placeholder || '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, COMPACT_DATE_FORMAT);
};
