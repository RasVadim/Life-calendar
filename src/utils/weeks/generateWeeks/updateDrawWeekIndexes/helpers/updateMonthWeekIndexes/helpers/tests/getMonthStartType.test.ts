import { describe, it, expect } from 'vitest';

import { EMonthsWeekIndxsValues } from '@/types';

import { TMonthInfo } from '../getMonthInfo';
import { getMonthStartType } from '../getMonthStartType';

describe('getMonthStartType', () => {
  describe('FirstFull5 scenarios', () => {
    it('should return FirstFull5 for 30-day month (4 full weeks + 2 remaining days)', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 3, // April (0-indexed)
        daysInMonth: 30,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should return FirstFull5 for 31-day month (4 full weeks + 3 remaining days)', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 0, // January (0-indexed)
        daysInMonth: 31,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should return FirstFull5 for February in leap year (4 full weeks + 1 remaining day)', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 1, // February (0-indexed)
        daysInMonth: 29,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });
  });

  describe('FirstFull4 scenarios', () => {
    it('should return FirstFull4 for 28-day month (4 full weeks + 0 remaining days)', () => {
      const monthInfo: TMonthInfo = {
        year: 2023,
        month: 1, // February (0-indexed)
        daysInMonth: 28,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull4);
    });
  });

  describe('Real calendar scenarios', () => {
    it('should handle real calendar months correctly', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 0, // January (0-indexed)
        daysInMonth: 31,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      // With real data (31 days), this should return FirstFull5
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should handle edge case where month has exactly 4 full weeks', () => {
      const monthInfo: TMonthInfo = {
        year: 2023,
        month: 1, // February (0-indexed)
        daysInMonth: 28,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull4);
    });
  });

  describe('Different months', () => {
    it('should handle all 30-day months correctly', () => {
      const months30 = [
        { month: 3, name: 'April' },
        { month: 5, name: 'June' },
        { month: 8, name: 'September' },
        { month: 10, name: 'November' },
      ];

      months30.forEach(({ month }) => {
        const monthInfo: TMonthInfo = {
          year: 2024,
          month,
          daysInMonth: 30,
          currentWeekStartDay: 1,
        };

        const result = getMonthStartType(monthInfo);

        expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
      });
    });

    it('should handle all 31-day months correctly', () => {
      const months31 = [
        { month: 0, name: 'January' },
        { month: 2, name: 'March' },
        { month: 4, name: 'May' },
        { month: 6, name: 'July' },
        { month: 7, name: 'August' },
        { month: 9, name: 'October' },
        { month: 11, name: 'December' },
      ];

      months31.forEach(({ month }) => {
        const monthInfo: TMonthInfo = {
          year: 2024,
          month,
          daysInMonth: 31,
          currentWeekStartDay: 1,
        };

        const result = getMonthStartType(monthInfo);

        expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
      });
    });

    it('should handle February in different years correctly', () => {
      const leapYearCases = [
        { year: 2024, daysInMonth: 29, expected: EMonthsWeekIndxsValues.FirstFull5 },
        { year: 2020, daysInMonth: 29, expected: EMonthsWeekIndxsValues.FirstFull5 },
        { year: 2000, daysInMonth: 29, expected: EMonthsWeekIndxsValues.FirstFull5 },
      ];

      const nonLeapYearCases = [
        { year: 2023, daysInMonth: 28, expected: EMonthsWeekIndxsValues.FirstFull4 },
        { year: 2021, daysInMonth: 28, expected: EMonthsWeekIndxsValues.FirstFull4 },
        { year: 1900, daysInMonth: 28, expected: EMonthsWeekIndxsValues.FirstFull4 },
      ];

      [...leapYearCases, ...nonLeapYearCases].forEach(({ year, daysInMonth, expected }) => {
        const monthInfo: TMonthInfo = {
          year,
          month: 1, // February
          daysInMonth,
          currentWeekStartDay: 1,
        };

        const result = getMonthStartType(monthInfo);

        expect(result).toBe(expected);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle different currentWeekStartDay values', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      // Should return FirstFull5 for January (31 days)
      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should handle year boundaries', () => {
      const decemberInfo: TMonthInfo = {
        year: 2023,
        month: 11, // December
        daysInMonth: 31,
        currentWeekStartDay: 1,
      };

      const januaryInfo: TMonthInfo = {
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 1,
      };

      const result1 = getMonthStartType(decemberInfo);
      const result2 = getMonthStartType(januaryInfo);

      // December 2023 (31 days) and January 2024 (31 days) should both return FirstFull5
      expect(result1).toBe(EMonthsWeekIndxsValues.FirstFull5);
      expect(result2).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });
  });

  describe('Mathematical consistency', () => {
    it('should always return consistent results for the same month', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 3, // April
        daysInMonth: 30,
        currentWeekStartDay: 1,
      };

      // Call multiple times
      const result1 = getMonthStartType(monthInfo);
      const result2 = getMonthStartType(monthInfo);
      const result3 = getMonthStartType(monthInfo);

      // All results should be the same
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe(EMonthsWeekIndxsValues.FirstFull5);
    });

    it('should handle edge case where month has exactly 4 full weeks', () => {
      const monthInfo: TMonthInfo = {
        year: 2023,
        month: 1, // February
        daysInMonth: 28,
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBe(EMonthsWeekIndxsValues.FirstFull4);
    });

    it('should return null for months with less than 4 full weeks', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 0, // January
        daysInMonth: 20, // Less than 4 full weeks
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBeNull();
    });

    it('should return null for months with more than 4 full weeks', () => {
      const monthInfo: TMonthInfo = {
        year: 2024,
        month: 0, // January
        daysInMonth: 35, // More than 4 full weeks
        currentWeekStartDay: 1,
      };

      const result = getMonthStartType(monthInfo);

      expect(result).toBeNull();
    });
  });
});
