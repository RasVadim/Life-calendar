import { TWeekZodiac } from '@/types/life';

// Chinese zodiac animals in 12-year cycle order
const ZODIAC_ANIMALS: readonly TWeekZodiac[] = [
  'rat',
  'ox',
  'tiger',
  'rabbit',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
] as const;

/**
 * Returns Chinese zodiac by year
 *
 * Uses 12-year cycle where year 4 AD corresponds to Rat (first animal).
 * Formula: (year - 4) % 12 ensures proper cycle calculation.
 *
 * @param {number} year - Calendar year
 * @returns {TWeekZodiac} Zodiac name
 */
export const getZodiac = (year: number): TWeekZodiac => {
  // Calculate zodiac index with proper handling of negative years
  const zodiacIndex = (year - 4) % 12;
  return ZODIAC_ANIMALS[zodiacIndex];
};
