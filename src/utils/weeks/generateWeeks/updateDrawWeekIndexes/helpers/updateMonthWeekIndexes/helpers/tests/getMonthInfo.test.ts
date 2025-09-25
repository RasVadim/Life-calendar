import { describe, it, expect } from 'vitest';

import { getMonthInfo } from '../getMonthInfo';

describe('getMonthInfo', () => {
  describe('Basic functionality', () => {
    it('should return correct month info for January 2024', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') },
      ];

      const result = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });

      expect(result).toEqual({
        year: 2024,
        month: 0, // January is month 0
        daysInMonth: 31,
        currentWeekStartDay: 1,
      });
    });

    it('should return correct month info for February 2024 (leap year)', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-02-01'), weekEnd: new Date('2024-02-07') },
      ];

      const result = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });

      expect(result).toEqual({
        year: 2024,
        month: 1, // February is month 1
        daysInMonth: 29, // Leap year
        currentWeekStartDay: 1,
      });
    });

    it('should return correct month info for February 2023 (non-leap year)', () => {
      const weekTimePoints = [
        { weekStart: new Date('2023-02-01'), weekEnd: new Date('2023-02-07') },
      ];

      const result = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });

      expect(result).toEqual({
        year: 2023,
        month: 1, // February is month 1
        daysInMonth: 28, // Non-leap year
        currentWeekStartDay: 1,
      });
    });
  });

  describe('Different months', () => {
    it('should handle all 30-day months correctly', () => {
      const months = [
        { name: 'April', month: 3, days: 30 },
        { name: 'June', month: 5, days: 30 },
        { name: 'September', month: 8, days: 30 },
        { name: 'November', month: 10, days: 30 },
      ];

      months.forEach(({ month, days }) => {
        const weekTimePoints = [
          {
            weekStart: new Date(`2024-${String(month + 1).padStart(2, '0')}-01`),
            weekEnd: new Date(`2024-${String(month + 1).padStart(2, '0')}-07`),
          },
        ];

        const result = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });

        expect(result).toEqual({
          year: 2024,
          month,
          daysInMonth: days,
          currentWeekStartDay: 1,
        });
      });
    });

    it('should handle all 31-day months correctly', () => {
      const months = [
        { name: 'January', month: 0, days: 31 },
        { name: 'March', month: 2, days: 31 },
        { name: 'May', month: 4, days: 31 },
        { name: 'July', month: 6, days: 31 },
        { name: 'August', month: 7, days: 31 },
        { name: 'October', month: 9, days: 31 },
        { name: 'December', month: 11, days: 31 },
      ];

      months.forEach(({ month, days }) => {
        const weekTimePoints = [
          {
            weekStart: new Date(`2024-${String(month + 1).padStart(2, '0')}-01`),
            weekEnd: new Date(`2024-${String(month + 1).padStart(2, '0')}-07`),
          },
        ];

        const result = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });

        expect(result).toEqual({
          year: 2024,
          month,
          daysInMonth: days,
          currentWeekStartDay: 1,
        });
      });
    });
  });

  describe('Different week indices', () => {
    it('should return correct info for different week indices', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') }, // Week 0
        { weekStart: new Date('2024-01-08'), weekEnd: new Date('2024-01-14') }, // Week 1
        { weekStart: new Date('2024-01-15'), weekEnd: new Date('2024-01-21') }, // Week 2
        { weekStart: new Date('2024-01-22'), weekEnd: new Date('2024-01-28') }, // Week 3
        { weekStart: new Date('2024-01-29'), weekEnd: new Date('2024-02-04') }, // Week 4
      ];

      // Week 0: January 1st
      const result0 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      expect(result0).toEqual({
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 1,
      });

      // Week 1: January 8th
      const result1 = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      expect(result1).toEqual({
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 8,
      });

      // Week 2: January 15th
      const result2 = getMonthInfo({ weekTimePoints, currentWeekIndex: 2 });
      expect(result2).toEqual({
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 15,
      });

      // Week 3: January 22nd
      const result3 = getMonthInfo({ weekTimePoints, currentWeekIndex: 3 });
      expect(result3).toEqual({
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 22,
      });

      // Week 4: January 29th
      const result4 = getMonthInfo({ weekTimePoints, currentWeekIndex: 4 });
      expect(result4).toEqual({
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 29,
      });
    });
  });

  describe('Year boundaries', () => {
    it('should handle December to January transition', () => {
      const weekTimePoints = [
        { weekStart: new Date('2023-12-25'), weekEnd: new Date('2023-12-31') },
        { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') },
      ];

      // December week
      const decemberResult = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      expect(decemberResult).toEqual({
        year: 2023,
        month: 11, // December
        daysInMonth: 31,
        currentWeekStartDay: 25,
      });

      // January week
      const januaryResult = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      expect(januaryResult).toEqual({
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 1,
      });
    });

    it('should handle leap year transition', () => {
      const weekTimePoints = [
        { weekStart: new Date('2023-02-27'), weekEnd: new Date('2023-03-05') },
        { weekStart: new Date('2024-02-26'), weekEnd: new Date('2024-03-03') },
      ];

      // 2023 February (non-leap)
      const feb2023Result = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      expect(feb2023Result).toEqual({
        year: 2023,
        month: 1, // February
        daysInMonth: 28,
        currentWeekStartDay: 27,
      });

      // 2024 February (leap)
      const feb2024Result = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      expect(feb2024Result).toEqual({
        year: 2024,
        month: 1, // February
        daysInMonth: 29,
        currentWeekStartDay: 26,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle month boundaries correctly', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-01-31'), weekEnd: new Date('2024-02-06') }, // Last day of January
        { weekStart: new Date('2024-02-01'), weekEnd: new Date('2024-02-07') }, // First day of February
      ];

      // Last day of January
      const januaryResult = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      expect(januaryResult).toEqual({
        year: 2024,
        month: 0, // January
        daysInMonth: 31,
        currentWeekStartDay: 31,
      });

      // First day of February
      const februaryResult = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      expect(februaryResult).toEqual({
        year: 2024,
        month: 1, // February
        daysInMonth: 29, // Leap year
        currentWeekStartDay: 1,
      });
    });

    it('should handle different years correctly', () => {
      const weekTimePoints = [
        { weekStart: new Date('2020-02-29'), weekEnd: new Date('2020-03-06') }, // Leap year
        { weekStart: new Date('2021-02-28'), weekEnd: new Date('2021-03-06') }, // Non-leap year
        { weekStart: new Date('2022-02-28'), weekEnd: new Date('2022-03-06') }, // Non-leap year
        { weekStart: new Date('2023-02-28'), weekEnd: new Date('2023-03-06') }, // Non-leap year
        { weekStart: new Date('2024-02-29'), weekEnd: new Date('2024-03-06') }, // Leap year
      ];

      // 2020 (leap year)
      const result2020 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      expect(result2020).toEqual({
        year: 2020,
        month: 1, // February
        daysInMonth: 29,
        currentWeekStartDay: 29,
      });

      // 2021 (non-leap year)
      const result2021 = getMonthInfo({ weekTimePoints, currentWeekIndex: 1 });
      expect(result2021).toEqual({
        year: 2021,
        month: 1, // February
        daysInMonth: 28,
        currentWeekStartDay: 28,
      });

      // 2024 (leap year)
      const result2024 = getMonthInfo({ weekTimePoints, currentWeekIndex: 4 });
      expect(result2024).toEqual({
        year: 2024,
        month: 1, // February
        daysInMonth: 29,
        currentWeekStartDay: 29,
      });
    });
  });

  describe('Mathematical consistency', () => {
    it('should always return consistent results for the same week', () => {
      const weekTimePoints = [
        { weekStart: new Date('2024-04-01'), weekEnd: new Date('2024-04-07') },
      ];

      // Call multiple times
      const result1 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result2 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });
      const result3 = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });

      // All results should be identical
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1).toEqual({
        year: 2024,
        month: 3, // April
        daysInMonth: 30,
        currentWeekStartDay: 1,
      });
    });

    it('should handle edge case where month has exactly 4 full weeks', () => {
      const weekTimePoints = [
        { weekStart: new Date('2023-02-01'), weekEnd: new Date('2023-02-07') },
      ];

      const result = getMonthInfo({ weekTimePoints, currentWeekIndex: 0 });

      expect(result).toEqual({
        year: 2023,
        month: 1, // February
        daysInMonth: 28, // Exactly 4 weeks
        currentWeekStartDay: 1,
      });
    });
  });
});
