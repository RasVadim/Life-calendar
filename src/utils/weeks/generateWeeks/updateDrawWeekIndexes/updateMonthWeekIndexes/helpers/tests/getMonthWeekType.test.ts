import { describe, it, expect } from 'vitest';

import { EMonthsWeekIndxsValues } from '@/types';

import { TMonthInfo } from '../getMonthInfo';
import { getMonthWeekType, EMonthWeekTypeCalculation } from '../getMonthWeekType';

describe('getMonthWeekType', () => {
  const createMonthInfo = (daysInMonth: number, currentWeekStartDay: number = 1): TMonthInfo => ({
    year: 2024,
    month: 2, // March
    daysInMonth,
    currentWeekStartDay,
  });

  describe('start calculation type', () => {
    it('should return FirstFull5 for 4 full weeks with remaining days', () => {
      const monthInfo = createMonthInfo(29); // 4 weeks + 1 day
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should return FirstFull4 for exactly 4 full weeks', () => {
      const monthInfo = createMonthInfo(28); // Exactly 4 weeks
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull4);
    });

    it('should return null for less than 4 full weeks', () => {
      const monthInfo = createMonthInfo(21); // 3 weeks
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBeNull();
    });

    it('should return null for more than 4 full weeks', () => {
      const monthInfo = createMonthInfo(35); // 5 weeks
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBeNull();
    });
  });

  describe('postBorder calculation type', () => {
    it('should return First5 for 4 full weeks with remaining days', () => {
      const monthInfo = createMonthInfo(29, 1); // 29 days left = 4 weeks + 1 day
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.PostBorder);
      expect(result).toBe(EMonthsWeekIndxsValues.First5);
    });

    it('should return First4 for exactly 4 full weeks', () => {
      const monthInfo = createMonthInfo(28, 1); // 28 days left = exactly 4 weeks
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.PostBorder);
      expect(result).toBe(EMonthsWeekIndxsValues.First4);
    });

    it('should return First4 for 3 full weeks with remaining days', () => {
      const monthInfo = createMonthInfo(22, 1); // 22 days left = 3 weeks + 1 day
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.PostBorder);
      expect(result).toBe(EMonthsWeekIndxsValues.First4);
    });

    it('should return null for less than 3 full weeks', () => {
      const monthInfo = createMonthInfo(20, 1); // 20 days left = 2 weeks + 6 days
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.PostBorder);
      expect(result).toBeNull();
    });

    it('should handle mid-month scenarios', () => {
      const monthInfo = createMonthInfo(31, 15); // 17 days left = 2 weeks + 3 days
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.PostBorder);
      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle February in leap year', () => {
      const monthInfo = createMonthInfo(29); // February in leap year
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should handle February in non-leap year', () => {
      const monthInfo = createMonthInfo(28); // February in non-leap year
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull4);
    });

    it('should handle 31-day months', () => {
      const monthInfo = createMonthInfo(31); // January, March, May, etc.
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should handle 30-day months', () => {
      const monthInfo = createMonthInfo(30); // April, June, September, November
      const result = getMonthWeekType(monthInfo, EMonthWeekTypeCalculation.Start);
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });
  });
});
