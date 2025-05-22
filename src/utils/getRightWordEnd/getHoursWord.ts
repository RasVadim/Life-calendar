/**
 * Returns the correct word ending for 'час' (hour) in Russian or English based on the number.
 *
 * @param {number} n - The number of hours.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct word form for 'hour'.
 */
export function getHoursWord(n: number, lng: string): string {
  if (lng === 'en') return n === 1 ? 'hour' : 'hours';
  if (lng === 'ru') {
    if (n % 10 === 1 && n % 100 !== 11) return 'час';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'часа';
    return 'часов';
  }
  return '';
} 