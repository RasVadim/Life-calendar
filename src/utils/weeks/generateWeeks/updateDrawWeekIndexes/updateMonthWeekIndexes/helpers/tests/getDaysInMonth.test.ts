import { describe, it, expect } from 'vitest';

import { getDaysInMonth } from '../getDaysInMonth';

describe('getDaysInMonth', () => {
  describe('Regular months', () => {
    it('should return 31 days for January (month 0)', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('should return 29 days for February (month 1) in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('should return 31 days for March (month 2)', () => {
      expect(getDaysInMonth(2024, 2)).toBe(31);
    });

    it('should return 30 days for April (month 3)', () => {
      expect(getDaysInMonth(2024, 3)).toBe(30);
    });

    it('should return 31 days for May (month 4)', () => {
      expect(getDaysInMonth(2024, 4)).toBe(31);
    });

    it('should return 30 days for June (month 5)', () => {
      expect(getDaysInMonth(2024, 5)).toBe(30);
    });

    it('should return 31 days for July (month 6)', () => {
      expect(getDaysInMonth(2024, 6)).toBe(31);
    });

    it('should return 31 days for August (month 7)', () => {
      expect(getDaysInMonth(2024, 7)).toBe(31);
    });

    it('should return 30 days for September (month 8)', () => {
      expect(getDaysInMonth(2024, 8)).toBe(30);
    });

    it('should return 31 days for October (month 9)', () => {
      expect(getDaysInMonth(2024, 9)).toBe(31);
    });

    it('should return 30 days for November (month 10)', () => {
      expect(getDaysInMonth(2024, 10)).toBe(30);
    });

    it('should return 31 days for December (month 11)', () => {
      expect(getDaysInMonth(2024, 11)).toBe(31);
    });
  });

  describe('Leap years', () => {
    it('should return 29 days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29); // 2024 is a leap year
    });

    it('should return 28 days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28); // 2023 is not a leap year
    });

    it('should handle century leap years correctly', () => {
      expect(getDaysInMonth(2000, 1)).toBe(29); // 2000 is a leap year
      expect(getDaysInMonth(1900, 1)).toBe(28); // 1900 is not a leap year
    });
  });

  describe('Edge cases', () => {
    it('should handle year 0', () => {
      expect(getDaysInMonth(0, 1)).toBe(28); // Year 0 is not a leap year
    });

    it('should handle negative years', () => {
      expect(getDaysInMonth(-1, 1)).toBe(28); // Year -1 is not a leap year
    });

    it('should handle very large years', () => {
      expect(getDaysInMonth(9999, 1)).toBe(28); // Year 9999 is not a leap year
    });

    it('should handle month 0 (January)', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('should handle month 11 (December)', () => {
      expect(getDaysInMonth(2024, 11)).toBe(31);
    });
  });

  describe('Leap year validation', () => {
    it('should correctly identify leap years', () => {
      const leapYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024];
      const nonLeapYears = [1900, 2001, 2002, 2003, 2005, 2006, 2007];

      leapYears.forEach((year) => {
        expect(getDaysInMonth(year, 1)).toBe(29);
      });

      nonLeapYears.forEach((year) => {
        expect(getDaysInMonth(year, 1)).toBe(28);
      });
    });
  });

  describe('All months consistency', () => {
    it('should return consistent results for all months in a year', () => {
      const year = 2024;
      const expectedDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      expectedDays.forEach((expected, month) => {
        expect(getDaysInMonth(year, month)).toBe(expected);
      });
    });

    it('should return consistent results for all months in a non-leap year', () => {
      const year = 2023;
      const expectedDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      expectedDays.forEach((expected, month) => {
        expect(getDaysInMonth(year, month)).toBe(expected);
      });
    });
  });

  describe('Mathematical properties', () => {
    it('should always return a positive number', () => {
      const testCases = [
        { year: 2024, month: 0 },
        { year: 2024, month: 1 },
        { year: 2024, month: 11 },
        { year: 0, month: 1 },
        { year: -1, month: 1 },
        { year: 9999, month: 1 },
      ];

      testCases.forEach(({ year, month }) => {
        const result = getDaysInMonth(year, month);
        expect(result).toBeGreaterThan(0);
      });
    });

    it('should always return a number between 28 and 31', () => {
      const testCases = [
        { year: 2024, month: 0 },
        { year: 2024, month: 1 },
        { year: 2024, month: 2 },
        { year: 2024, month: 3 },
        { year: 2024, month: 4 },
        { year: 2024, month: 5 },
        { year: 2024, month: 6 },
        { year: 2024, month: 7 },
        { year: 2024, month: 8 },
        { year: 2024, month: 9 },
        { year: 2024, month: 10 },
        { year: 2024, month: 11 },
      ];

      testCases.forEach(({ year, month }) => {
        const result = getDaysInMonth(year, month);
        expect(result).toBeGreaterThanOrEqual(28);
        expect(result).toBeLessThanOrEqual(31);
      });
    });
  });
});
