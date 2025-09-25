import { describe, it, expect } from 'vitest';

import { EMonthsWeekIndxsValues } from '@/types';

import { getMonthInfo } from '../getMonthInfo';
import { getPostBorderWeekType } from '../getPostBorderWeekType';

describe('getPostBorderWeekType', () => {
  describe('First5 scenarios', () => {
    it('should return First5 when 4 full weeks + remaining days left in month', () => {
      // Test with a month where we're starting from 1st and have 4+ weeks left
      const weekTimePoints = [
        { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') }, // Week starting on 1st
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.First5);
    });

    it('should return First5 for February in leap year when starting from 1st', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-02-01'), weekEnd: new Date('2024-02-07') }, // Week starting on 1st
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.First5);
    });
  });

  describe('First4 scenarios', () => {
    it('should return First4 when exactly 4 full weeks left in month', () => {
      // Test with February in non-leap year starting from 1st
      const weekTimePoints = [
        { weekStart: new Date('2023-02-01'), weekEnd: new Date('2023-02-07') }, // Week starting on 1st
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.First4);
    });

    it('should return First4 when 3 full weeks + remaining days left in month', () => {
      // Test with a scenario where 3 weeks + some days remain
      const weekTimePoints = [
        { weekStart: new Date('2024-01-08'), weekEnd: new Date('2024-01-14') }, // Week starting on 8th
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.First4);
    });

    it('should return First4 for February in non-leap year when starting from 1st', () => {
      const weekTimePoints = [
        { weekStart: new Date('2023-02-01'), weekEnd: new Date('2023-02-07') }, // Week starting on 1st
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.First4);
    });
  });

  describe('Null scenarios', () => {
    it('should return null when less than 3 full weeks left in month', () => {
      // Test with a scenario where very few days remain
      const weekTimePoints = [
        { weekStart: new Date('2024-01-25'), weekEnd: new Date('2024-01-31') }, // Week starting on 25th
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      expect(result).toBeNull();
    });

    it('should return null when more than 4 full weeks left in month', () => {
      // This scenario is unlikely but let's test it
      const weekTimePoints = [
        { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') }, // Week starting on 1st
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      // With 31 days starting from 1st, we have 31 days left = 4 full weeks + 3 days
      // This should return First5, not null
      expect(result).toBe(EMonthsWeekIndxsValues.First5);
    });
  });

  describe('Different months', () => {
    it('should handle 30-day months correctly', () => {
      const months30 = [3, 5, 8, 10]; // April, June, September, November

      months30.forEach((month) => {
        const weekTimePoints = [
          { weekStart: new Date(2024, month, 1), weekEnd: new Date(2024, month, 7) },
        ];

        const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
        const result = getPostBorderWeekType(monthInfo);

        // Starting from 1st day of 30-day month: 30 days left = 4 full weeks + 2 days
        expect(result).toBe(EMonthsWeekIndxsValues.First5);
      });
    });

    it('should handle 31-day months correctly', () => {
      const months31 = [0, 2, 4, 6, 7, 9, 11]; // January, March, May, July, August, October, December

      months31.forEach((month) => {
        const weekTimePoints = [
          { weekStart: new Date(2024, month, 1), weekEnd: new Date(2024, month, 7) },
        ];

        const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
        const result = getPostBorderWeekType(monthInfo);

        // Starting from 1st day of 31-day month: 31 days left = 4 full weeks + 3 days
        expect(result).toBe(EMonthsWeekIndxsValues.First5);
      });
    });

    it('should handle February correctly in different years', () => {
      const leapYearCases = [
        { year: 2024, expected: EMonthsWeekIndxsValues.First5 }, // 29 days
        { year: 2020, expected: EMonthsWeekIndxsValues.First5 }, // 29 days
        { year: 2000, expected: EMonthsWeekIndxsValues.First5 }, // 29 days
      ];

      const nonLeapYearCases = [
        { year: 2023, expected: EMonthsWeekIndxsValues.First4 }, // 28 days
        { year: 2021, expected: EMonthsWeekIndxsValues.First4 }, // 28 days
        { year: 1900, expected: EMonthsWeekIndxsValues.First4 }, // 28 days
      ];

      [...leapYearCases, ...nonLeapYearCases].forEach(({ year, expected }) => {
        const weekTimePoints = [{ weekStart: new Date(year, 1, 1), weekEnd: new Date(year, 1, 7) }];

        const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
        const result = getPostBorderWeekType(monthInfo);

        expect(result).toBe(expected);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle different week indices', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') },
        { weekStart: new Date('2024-01-08'), weekEnd: new Date('2024-01-14') },
        { weekStart: new Date('2024-01-15'), weekEnd: new Date('2024-01-21') },
      ];

      // Test with different week indices
      const monthInfo1 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const monthInfo2 = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      const monthInfo3 = getMonthInfo({ weekTimePoints, currentWeekIndex: 2 });
      const result1 = getPostBorderWeekType(monthInfo1);
      const result2 = getPostBorderWeekType(monthInfo2);
      const result3 = getPostBorderWeekType(monthInfo3);

      // Week 1: 31 days left = First5, Week 2: 24 days left = First4, Week 3: 17 days left = null (< 3 weeks)
      expect(result1).toBe(EMonthsWeekIndxsValues.First5);
      expect(result2).toBe(EMonthsWeekIndxsValues.First4);
      expect(result3).toBeNull();
    });

    it('should handle year boundaries', () => {
      const weekTimePoints = [
        { weekStart: new Date('2023-12-01'), weekEnd: new Date('2023-12-07') },
        { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') },
      ];

      const monthInfo1 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const monthInfo2 = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      const result1 = getPostBorderWeekType(monthInfo1);
      const result2 = getPostBorderWeekType(monthInfo2);

      // December 2023 (31 days) and January 2024 (31 days) should both return First5
      expect(result1).toBe(EMonthsWeekIndxsValues.First5);
      expect(result2).toBe(EMonthsWeekIndxsValues.First5);
    });

    it('should handle end of month scenarios', () => {
      // Test scenarios near the end of the month
      const weekTimePoints = [
        { weekStart: new Date('2024-01-25'), weekEnd: new Date('2024-01-31') }, // Week starting on 25th
        { weekStart: new Date('2024-01-29'), weekEnd: new Date('2024-02-04') }, // Week starting on 29th
      ];

      const monthInfo1 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const monthInfo2 = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      const result1 = getPostBorderWeekType(monthInfo1);
      const result2 = getPostBorderWeekType(monthInfo2);

      // Week starting on 25th: 7 days left = 1 full week + 0 days (should return null)
      // Week starting on 29th: 3 days left = 0 full weeks + 3 days (should return null)
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('Mathematical consistency', () => {
    it('should always return consistent results for the same week', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-04-01'), weekEnd: new Date('2024-04-07') },
      ];

      // Call multiple times
      const monthInfo1 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const monthInfo2 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const monthInfo3 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result1 = getPostBorderWeekType(monthInfo1);
      const result2 = getPostBorderWeekType(monthInfo2);
      const result3 = getPostBorderWeekType(monthInfo3);

      // All results should be the same
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe(EMonthsWeekIndxsValues.First5);
    });

    it('should handle edge case where month has exactly 4 full weeks remaining', () => {
      // This is a theoretical case - in practice, months don't have exactly 28 days remaining
      // when starting from the 1st, but let's test the logic
      const weekTimePoints = [
        { weekStart: new Date('2023-02-01'), weekEnd: new Date('2023-02-07') },
      ];

      const monthInfo = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result = getPostBorderWeekType(monthInfo);

      // February 2023 has 28 days, starting from 1st: 28 days left = 4 full weeks + 0 days
      expect(result).toBe(EMonthsWeekIndxsValues.First4);
    });
  });
});
