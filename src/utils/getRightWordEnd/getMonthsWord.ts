/**
 * Returns the correct word ending for 'месяц' (month) in Russian or English based on the number.
 *
 * @param {number} n - The number of months.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct word form for 'month'.
 */
export const getMonthsWord = (n: number, lng: string): string => {
  if (lng === 'en') return n === 1 ? 'month' : 'months';
  if (lng === 'ru') {
    if (n % 10 === 1 && n % 100 !== 11) return 'месяц';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'месяца';
    return 'месяцев';
  }
  return '';
};
