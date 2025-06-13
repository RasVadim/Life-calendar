/**
 * Returns the correct dative case word ending for 'год' (year) in Russian or English based on the number.
 *
 * @param {number} n - The number of years.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct word form for 'year' in dative case.
 */
export const getYearsWordDative = (n: number, lng: string): string => {
  if (lng === 'en') return n === 1 ? 'year' : 'years';
  if (lng === 'ru') {
    if (n % 10 === 1 && n % 100 !== 11) return 'год';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'года';
    return 'лет';
  }
  return '';
};
