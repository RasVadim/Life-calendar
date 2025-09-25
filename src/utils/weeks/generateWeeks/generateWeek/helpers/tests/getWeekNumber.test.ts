import { describe, it, expect } from 'vitest';

import { getWeekNumber } from '../getWeekNumber';

describe('getWeekNumber', () => {
  describe('basic functionality', () => {
    it('should convert 0-based index to 1-based week number with leading zeros', () => {
      expect(getWeekNumber(0)).toBe('0001');
      expect(getWeekNumber(1)).toBe('0002');
      expect(getWeekNumber(9)).toBe('0010');
      expect(getWeekNumber(51)).toBe('0052');
    });

    it('should handle typical year week numbers', () => {
      expect(getWeekNumber(0)).toBe('0001'); // First week of year
      expect(getWeekNumber(25)).toBe('0026'); // Mid year (week 26)
      expect(getWeekNumber(51)).toBe('0052'); // Last week of typical year
    });
  });

  describe('padding behavior', () => {
    it('should pad single digit numbers with three leading zeros', () => {
      expect(getWeekNumber(0)).toBe('0001');
      expect(getWeekNumber(8)).toBe('0009');
    });

    it('should pad double digit numbers with two leading zeros', () => {
      expect(getWeekNumber(9)).toBe('0010');
      expect(getWeekNumber(51)).toBe('0052');
    });

    it('should pad triple digit numbers with one leading zero', () => {
      expect(getWeekNumber(99)).toBe('0100');
      expect(getWeekNumber(999)).toBe('1000');
    });

    it('should not pad 4-digit numbers', () => {
      expect(getWeekNumber(9999)).toBe('10000');
    });
  });

  describe('edge cases', () => {
    it('should handle first week correctly', () => {
      expect(getWeekNumber(0)).toBe('0001');
    });

    it('should handle large week numbers', () => {
      expect(getWeekNumber(2599)).toBe('2600'); // ~50 years of weeks
      expect(getWeekNumber(4159)).toBe('4160'); // ~80 years of weeks
    });

    it('should handle maximum safe integer', () => {
      const maxIndex = Number.MAX_SAFE_INTEGER - 1;
      const result = getWeekNumber(maxIndex);
      expect(result).toBe(String(Number.MAX_SAFE_INTEGER));
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical life calendar week indexes', () => {
      // Birth week
      expect(getWeekNumber(0)).toBe('0001');

      // 1 year = ~52 weeks
      expect(getWeekNumber(51)).toBe('0052');

      // 10 years = ~520 weeks
      expect(getWeekNumber(519)).toBe('0520');

      // 50 years = ~2600 weeks
      expect(getWeekNumber(2599)).toBe('2600');

      // 80 years = ~4160 weeks (typical life expectancy)
      expect(getWeekNumber(4159)).toBe('4160');
    });

    it('should provide consistent string format for sorting', () => {
      const weekNumbers = [
        getWeekNumber(0),
        getWeekNumber(9),
        getWeekNumber(99),
        getWeekNumber(999),
      ];

      // Should be sortable alphabetically due to leading zeros
      const sorted = [...weekNumbers].sort();
      expect(sorted).toEqual(weekNumbers);
    });
  });
});
