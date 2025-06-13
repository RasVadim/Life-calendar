/**
 * Returns the correct word ending for 'день' (day) in Russian or English based on the number.
 *
 * @param {number} n - The number of days.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct word form for 'day'.
 */
export const getDaysWord = (n: number, lng: string): string => {
  if (lng === 'en') return n === 1 ? 'day' : 'days';
  if (lng === 'ru') {
    if (n % 10 === 1 && n % 100 !== 11) return 'день';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дня';
    return 'дней';
  }
  return '';
};
