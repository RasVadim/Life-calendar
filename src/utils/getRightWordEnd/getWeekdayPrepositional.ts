/**
 * Returns the correct prepositional form of a weekday in Russian (e.g. 'в среду', 'в пятницу').
 * For English, returns the original weekday string.
 *
 * @param {string} weekday - The weekday name (e.g. 'понедельник', 'Monday').
 * @param {string} lng - The language code ('ru' or 'en').
 * @returns {string} The correct prepositional form for the weekday.
 */
export function getWeekdayPrepositional(weekday: string, lng: string): string {
  if (lng !== 'ru') return weekday;
  switch (weekday.toLowerCase()) {
    case 'понедельник':
      return 'в понедельник';
    case 'вторник':
      return 'во вторник';
    case 'среда':
      return 'в среду';
    case 'четверг':
      return 'в четверг';
    case 'пятница':
      return 'в пятницу';
    case 'суббота':
      return 'в субботу';
    case 'воскресенье':
      return 'в воскресенье';
    default:
      return `в ${weekday}`;
  }
}
