import { ESeason } from '@/types/life';

/**
 * Returns season by month
 * @param {number} month - Month number (0-11)
 * @returns {ESeason} Season name
 */
export const getSeason = (month: number): ESeason => {
  if (month === 11 || month === 0 || month === 1) return ESeason.Winter;
  if (month >= 2 && month <= 4) return ESeason.Spring;
  if (month >= 5 && month <= 7) return ESeason.Summer;
  return ESeason.Autumn;
};
