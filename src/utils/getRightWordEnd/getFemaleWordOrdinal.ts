/**
 * Returns the correct ordinal word ending for 'неделя' (week) in Russian or English based on the number.
 *
 * @param {number} n - The number of weeks.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct ordinal word form for 'week'.
 */
export const getFemaleWordOrdinal = (n: number, lng: string): string => {
  if (lng === 'en') {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
  }
  if (lng === 'ru') {
    // For Russian ordinal numbers with feminine gender (неделя)
    // 1-ая, 21-ая, 31-ая, etc.
    if (n % 10 === 1 && n % 100 !== 11) return `${n}-ая`;
    // 2-ая, 4-ая, 22-ая, 24-ая, etc.
    if ([2, 4].includes(n % 10) && ![12, 14].includes(n % 100)) return `${n}-ая`;
    // 3-тья, 23-тья, 43-тья, etc.
    if (n % 10 === 3 && n % 100 !== 13) return `${n}-тья`;
    // 5-ая, 6-ая, 7-ая, 8-ая, 9-ая, 10-ая, 11-ая, 12-ая, 13-ая, 14-ая, 15-ая, etc.
    return `${n}-ая`;
  }
  return '';
};
