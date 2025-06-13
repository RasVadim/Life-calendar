/**
 * Returns the correct genitive case word ending for 'год' (year) in Russian or English based on the number.
 *
 * @param {number} n - The number of years.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct word form for 'year' in genitive case.
 */
export const getYearsWordGenitive = (n: number, lng: string): string => {
  if (lng === 'en') return n === 1 ? 'year' : 'years';
  if (lng === 'ru') {
    if (n % 10 === 1 && n % 100 !== 11) return 'года';
    return 'лет';
  }
  return '';
};
