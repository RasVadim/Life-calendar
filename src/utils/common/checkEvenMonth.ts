/**
 * Determines if a month is even-numbered based on its string representation
 * @param month - Month as string ('01', '02', '12', etc.)
 * @returns {boolean} true if month number is even, false if odd
 */
export const checkEvenMonth = (month?: string | null): boolean | null => {
  if (!month) return null;
  const monthNumber = parseInt(month, 10);
  return monthNumber % 2 === 0;
};
