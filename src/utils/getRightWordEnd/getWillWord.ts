/**
 * Returns the correct word for future/past tense based on the language.
 *
 * @param {boolean} isFuture - Whether the date is in the future.
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct word for future/past tense.
 */
export const getWillWord = (isFuture: boolean, lng: string): string => {
  if (lng === 'en') {
    return isFuture ? 'will be' : 'are';
  }
  if (lng === 'ru') {
    return isFuture ? 'будет' : '';
  }
  return '';
};
