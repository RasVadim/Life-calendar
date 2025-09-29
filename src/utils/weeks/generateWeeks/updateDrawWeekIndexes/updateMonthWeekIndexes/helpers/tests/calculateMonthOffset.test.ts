import { describe, it, expect } from 'vitest';

import { calculateMonthOffset } from '../calculateMonthOffset';

describe('calculateMonthOffset', () => {
  describe('Basic functionality', () => {
    it('should return 0 for first day of month', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-01' });
      expect(result).toBe(0);
    });

    it('should return 1 for 8th day of month', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-08' });
      expect(result).toBe(1);
    });

    it('should return 2 for 15th day of month', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-15' });
      expect(result).toBe(2);
    });

    it('should return 3 for 22nd day of month', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-22' });
      expect(result).toBe(3);
    });

    it('should return 4 for 29th day of month', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-29' });
      expect(result).toBe(4);
    });
  });

  describe('Edge cases', () => {
    it('should handle 30th day of month', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-30' });
      expect(result).toBe(4);
    });

    it('should handle 31st day of month', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-31' });
      expect(result).toBe(4);
    });

    it('should cap at maximum offset of 4', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-31' });
      expect(result).toBe(4);
    });
  });

  describe('Real-world scenarios from July 1991', () => {
    it('should return correct offset for July 1, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-01' });
      expect(result).toBe(0);
    });

    it('should return correct offset for July 7, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-07' });
      expect(result).toBe(0);
    });

    it('should return correct offset for July 8, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-08' });
      expect(result).toBe(1);
    });

    it('should return correct offset for July 14, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-14' });
      expect(result).toBe(1);
    });

    it('should return correct offset for July 15, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-15' });
      expect(result).toBe(2);
    });

    it('should return correct offset for July 21, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-21' });
      expect(result).toBe(2);
    });

    it('should return correct offset for July 22, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-22' });
      expect(result).toBe(3);
    });

    it('should return correct offset for July 28, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-28' });
      expect(result).toBe(3);
    });

    it('should return correct offset for July 29, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-29' });
      expect(result).toBe(4);
    });

    it('should return correct offset for July 30, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-30' });
      expect(result).toBe(4);
    });

    it('should return correct offset for July 31, 1991', () => {
      const result = calculateMonthOffset({ firstDayDate: '1991-07-31' });
      expect(result).toBe(4);
    });
  });
});
