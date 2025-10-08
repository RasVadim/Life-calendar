/**
 * Returns the correct verb form for "был/было" in Russian based on the number of years.
 *
 * @param {number} n - The number of years.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct verb form.
 */
export const getWereWord = (n: number, lng: string): string => {
  if (lng === 'en') return 'were'; // Always "were" in English
  if (lng === 'ru') {
    // For Russian: "был" for 1, 21, 31, etc. and "было" for others
    if (n % 10 === 1 && n % 100 !== 11) return 'был';
    return 'было';
  }
  return '';
};
