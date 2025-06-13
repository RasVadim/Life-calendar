import { getDaysWord } from './getDaysWord';

/**
 * Returns the correct sentence for the remaining days in Russian or English based on the number.
 *
 * @param {number} days - The number of days.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct sentence for the remaining days.
 */
export const getRestDaysSentence = (days: number, lng: string): string => {
  if (days === 0) return '';
  if (lng === 'en') return ` and ${days} ${getDaysWord(days, lng)}`;
  if (lng === 'ru') return ` и ${days} ${getDaysWord(days, lng)}`;
  return '';
};
