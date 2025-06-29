import { TWeekZodiac } from '@/types/life';

/**
 * Returns Chinese zodiac by year
 * @param {number} year - Calendar year
 * @returns {TWeekZodiac} Zodiac name
 */
export const getZodiac = (year: number): TWeekZodiac => {
  const zodiacs: TWeekZodiac[] = [
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
  ];
  return zodiacs[(year - 4) % 12];
};
