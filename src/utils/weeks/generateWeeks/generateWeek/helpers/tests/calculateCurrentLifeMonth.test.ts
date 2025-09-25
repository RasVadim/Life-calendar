import { describe, it, expect } from 'vitest';

import { calculateCurrentLifeMonth } from '../calculateCurrentLifeMonth';

// Helper function to create date
const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day); // month is 1-indexed in function, 0-indexed in Date
};

describe('calculateCurrentLifeMonth', () => {
  describe('Basic month calculations', () => {
    it('should calculate first month of life correctly', () => {
      const birthDate = createDate(1990, 1, 15); // Jan 15, 1990
      const weekStart = createDate(1990, 1, 20); // Jan 20, 1990 (same month, after birth)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(1); // First month of life
    });

    it('should calculate month correctly when in same year after birth month', () => {
      const birthDate = createDate(1990, 1, 15); // Jan 15, 1990
      const weekStart = createDate(1990, 3, 10); // Mar 10, 1990 (before 15th)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(2); // Second month since day 10 < day 15 (subtract 1)
    });

    it('should calculate month correctly for subsequent years', () => {
      const birthDate = createDate(1990, 6, 15); // Jun 15, 1990
      const weekStart = createDate(1992, 8, 20); // Aug 20, 1992 (2+ years later)
      const lifeYear = 2;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(27); // 2 * 12 + (8 - 6) + 1 = 27
    });
  });

  describe('Year boundary adjustments', () => {
    it('should adjust when current month is earlier in year than birth month', () => {
      const birthDate = createDate(1990, 6, 15); // Jun 15, 1990
      const weekStart = createDate(1991, 3, 10); // Mar 10, 1991 (before June in next year)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(9); // 0 * 12 + (3 - 6) + 12 - 1 + 1 = 9 (day adjustment)
    });

    it('should handle December to January transition', () => {
      const birthDate = createDate(1990, 12, 15); // Dec 15, 1990
      const weekStart = createDate(1991, 1, 10); // Jan 10, 1991 (before 15th)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(1); // 0 * 12 + (1 - 12) + 12 - 1 + 1 = 1 (day adjustment)
    });
  });

  describe('Day-level adjustments', () => {
    it('should subtract month when current day is before birth day', () => {
      const birthDate = createDate(1990, 1, 15); // Jan 15, 1990
      const weekStart = createDate(1990, 2, 10); // Feb 10, 1990 (before 15th)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(1); // 0 * 12 + (2 - 1) - 1 + 1 = 1 (still first month)
    });

    it('should not subtract when current day equals birth day', () => {
      const birthDate = createDate(1990, 1, 15); // Jan 15, 1990
      const weekStart = createDate(1990, 2, 15); // Feb 15, 1990 (exactly one month)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(2); // 0 * 12 + (2 - 1) + 1 = 2
    });

    it('should not subtract when current day is after birth day', () => {
      const birthDate = createDate(1990, 1, 15); // Jan 15, 1990
      const weekStart = createDate(1990, 2, 20); // Feb 20, 1990 (after 15th)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(2); // 0 * 12 + (2 - 1) + 1 = 2
    });
  });

  describe('Complex scenarios', () => {
    it('should handle both year and day adjustments', () => {
      const birthDate = createDate(1990, 6, 20); // Jun 20, 1990
      const weekStart = createDate(1991, 3, 15); // Mar 15, 1991 (before June, before 20th)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(9); // 0 * 12 + (3 - 6) + 12 - 1 + 1 = 9
    });

    it('should handle multi-year calculation with day adjustment', () => {
      const birthDate = createDate(1990, 6, 20); // Jun 20, 1990
      const weekStart = createDate(1993, 8, 15); // Aug 15, 1993 (before 20th)
      const lifeYear = 3;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(38); // 3 * 12 + (8 - 6) - 1 + 1 = 38
    });
  });

  describe('Edge cases', () => {
    it('should handle leap year births', () => {
      const birthDate = createDate(1992, 2, 29); // Feb 29, 1992 (leap year)
      const weekStart = createDate(1993, 3, 1); // Mar 1, 1993 (after Feb 29, 1 year later)
      const lifeYear = 1;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(13); // 1 * 12 + (3 - 2) + 1 = 14, but day adjustment: 1 < 29, so -1 = 13
    });

    it('should handle end of month births', () => {
      const birthDate = createDate(1990, 1, 31); // Jan 31, 1990
      const weekStart = createDate(1990, 2, 28); // Feb 28, 1990 (Feb has no 31st)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(1); // Still first month since 28 < 31
    });

    it('should handle January 1st birth', () => {
      const birthDate = createDate(1990, 1, 1); // Jan 1, 1990
      const weekStart = createDate(1990, 1, 1); // Jan 1, 1990 (same day)
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(1); // First month of life
    });

    it('should handle December 31st scenarios', () => {
      const birthDate = createDate(1989, 12, 31); // Dec 31, 1989
      const weekStart = createDate(1990, 12, 30); // Dec 30, 1990 (before 31st)
      const lifeYear = 1;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(12); // 1 * 12 + (12 - 12) - 1 + 1 = 12
    });
  });

  describe('Validation of 1-based indexing', () => {
    it('should always return values >= 1', () => {
      const birthDate = createDate(1990, 1, 1);
      const weekStart = createDate(1990, 1, 1);
      const lifeYear = 0;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('should return correct month for large lifeYear values', () => {
      const birthDate = createDate(1990, 6, 15);
      const weekStart = createDate(2090, 8, 20); // 100 years later
      const lifeYear = 100;

      const result = calculateCurrentLifeMonth(birthDate, weekStart, lifeYear);
      expect(result).toBe(1203); // 100 * 12 + (8 - 6) + 1 = 1203
    });
  });
});
