import { describe, it, expect } from 'vitest';

import { calculateWeeksInMonth } from '../calculateWeeksInMonth';

describe('calculateWeeksInMonth', () => {
  describe('Basic functionality', () => {
    it('should calculate full weeks and remaining days correctly', () => {
      const result = calculateWeeksInMonth(30);

      expect(result).toEqual({
        fullWeeks: 4,
        remainingDays: 2,
      });
    });

    it('should handle exact week multiples', () => {
      const result = calculateWeeksInMonth(28);

      expect(result).toEqual({
        fullWeeks: 4,
        remainingDays: 0,
      });
    });

    it('should handle single week', () => {
      const result = calculateWeeksInMonth(7);

      expect(result).toEqual({
        fullWeeks: 1,
        remainingDays: 0,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle zero days', () => {
      const result = calculateWeeksInMonth(0);

      expect(result).toEqual({
        fullWeeks: 0,
        remainingDays: 0,
      });
    });

    it('should handle single day', () => {
      const result = calculateWeeksInMonth(1);

      expect(result).toEqual({
        fullWeeks: 0,
        remainingDays: 1,
      });
    });

    it('should handle less than a week', () => {
      const result = calculateWeeksInMonth(6);

      expect(result).toEqual({
        fullWeeks: 0,
        remainingDays: 6,
      });
    });
  });

  describe('Real month scenarios', () => {
    it('should handle February (28 days)', () => {
      const result = calculateWeeksInMonth(28);

      expect(result).toEqual({
        fullWeeks: 4,
        remainingDays: 0,
      });
    });

    it('should handle February leap year (29 days)', () => {
      const result = calculateWeeksInMonth(29);

      expect(result).toEqual({
        fullWeeks: 4,
        remainingDays: 1,
      });
    });

    it('should handle 30-day months (April, June, September, November)', () => {
      const result = calculateWeeksInMonth(30);

      expect(result).toEqual({
        fullWeeks: 4,
        remainingDays: 2,
      });
    });

    it('should handle 31-day months (January, March, May, July, August, October, December)', () => {
      const result = calculateWeeksInMonth(31);

      expect(result).toEqual({
        fullWeeks: 4,
        remainingDays: 3,
      });
    });
  });

  describe('Large numbers', () => {
    it('should handle large number of days', () => {
      const result = calculateWeeksInMonth(100);

      expect(result).toEqual({
        fullWeeks: 14,
        remainingDays: 2,
      });
    });

    it('should handle very large number of days', () => {
      const result = calculateWeeksInMonth(365);

      expect(result).toEqual({
        fullWeeks: 52,
        remainingDays: 1,
      });
    });
  });

  describe('Mathematical properties', () => {
    it('should always satisfy: fullWeeks * 7 + remainingDays = input', () => {
      const testCases = [0, 1, 6, 7, 28, 29, 30, 31, 100, 365];

      testCases.forEach((days) => {
        const result = calculateWeeksInMonth(days);
        const total = result.fullWeeks * 7 + result.remainingDays;

        expect(total).toBe(days);
      });
    });

    it('should always have remainingDays between 0 and 6', () => {
      const testCases = [0, 1, 6, 7, 28, 29, 30, 31, 100, 365];

      testCases.forEach((days) => {
        const result = calculateWeeksInMonth(days);

        expect(result.remainingDays).toBeGreaterThanOrEqual(0);
        expect(result.remainingDays).toBeLessThan(7);
      });
    });

    it('should always have non-negative fullWeeks', () => {
      const testCases = [0, 1, 6, 7, 28, 29, 30, 31, 100, 365];

      testCases.forEach((days) => {
        const result = calculateWeeksInMonth(days);

        expect(result.fullWeeks).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
