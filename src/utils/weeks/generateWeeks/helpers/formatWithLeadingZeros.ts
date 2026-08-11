/**
 * Formats a number with leading zeros
 * @param value - Number to format
 * @param length - Target length with leading zeros
 * @returns Formatted string with leading zeros
 */
export const formatWithLeadingZeros = (value: number, length: number): string => {
  return String(value).padStart(length, '0');
};

/**
 * Formats week number with leading zeros (4 digits)
 * @param weekIndex - week index in year
 * @returns week number as a string with leading zeros
 */
export const formatWeekNumber = (weekIndex: number): string => {
  return formatWithLeadingZeros(weekIndex + 1, 4);
};

/**
 * Formats month number with leading zeros (2 digits)
 * @param month - month number (0-11)
 * @returns month number as a string with leading zeros
 */
export const formatMonthNumber = (month: number): string => {
  return formatWithLeadingZeros(month + 1, 2);
};
