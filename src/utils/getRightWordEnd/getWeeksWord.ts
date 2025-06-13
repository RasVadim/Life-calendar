/**
 * Returns the correct word ending for 'неделя' (week) in Russian or English based on the number.
 *
 * @param {number} n - The number of weeks.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct word form for 'week'.
 */
export const getWeeksWord = (n: number, lng: string): string => {
  if (lng === 'en') return n === 1 ? 'week' : 'weeks';
  if (lng === 'ru') {
    if (n % 10 === 1 && n % 100 !== 11) return 'неделя';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'недели';
    return 'недель';
  }
  return '';
};
