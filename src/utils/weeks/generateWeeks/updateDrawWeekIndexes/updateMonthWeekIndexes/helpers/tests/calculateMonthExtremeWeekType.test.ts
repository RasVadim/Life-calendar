import { describe, it, expect } from 'vitest';

import { EMonthsEndsIndxsValues } from '@/types';

import { calculateMonthExtremeWeekType, EWeekPosition } from '../calculateMonthExtremeWeekType';

describe('calculateMonthExtremeWeekType', () => {
  const createWeekTimePoints = (weeks: Array<{ start: Date; end: Date }>) =>
    weeks.map((week) => ({ weekStart: week.start, weekEnd: week.end }));

  describe('first week (EWeekPosition.First)', () => {
    it('should return Full when week starts on Monday, ends in same month, next week in same month', () => {
      // Monday, March 4, 2024 to Sunday, March 10, 2024
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 4), end: new Date(2024, 2, 10) }, // First week
        { start: new Date(2024, 2, 11), end: new Date(2024, 2, 17) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.Full);
    });

    it('should return FullBorder when week starts on Monday, ends in different month', () => {
      // Monday, March 25, 2024 to Sunday, March 31, 2024 (March to April)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 25), end: new Date(2024, 3, 1) }, // First week
        { start: new Date(2024, 3, 2), end: new Date(2024, 3, 8) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.FullBorder);
    });

    it('should return FullBorderEnd when week starts on Monday, ends in same month, next week in different month', () => {
      // Monday, March 25, 2024 to Sunday, March 31, 2024 (next week starts in April)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 25), end: new Date(2024, 2, 31) }, // First week
        { start: new Date(2024, 3, 1), end: new Date(2024, 3, 7) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.FullBorderEnd);
    });

    it('should return Half when week does not start on Monday, ends in same month, next week in same month', () => {
      // Wednesday, March 6, 2024 to Sunday, March 10, 2024
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 6), end: new Date(2024, 2, 10) }, // First week
        { start: new Date(2024, 2, 11), end: new Date(2024, 2, 17) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.Half);
    });

    it('should return HalfBorder when week does not start on Monday, ends in different month', () => {
      // Wednesday, March 27, 2024 to Sunday, March 31, 2024 (March to April)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 27), end: new Date(2024, 3, 1) }, // First week
        { start: new Date(2024, 3, 2), end: new Date(2024, 3, 8) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.HalfBorder);
    });

    it('should return HalfBorderEnd when week does not start on Monday, ends in same month, next week in different month', () => {
      // Wednesday, March 27, 2024 to Sunday, March 31, 2024 (next week starts in April)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 27), end: new Date(2024, 2, 31) }, // First week
        { start: new Date(2024, 3, 1), end: new Date(2024, 3, 7) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.HalfBorderEnd);
    });
  });

  describe('last week (EWeekPosition.Last)', () => {
    it('should return Full when week ends on Sunday, starts in same month, previous week in same month', () => {
      // Monday, March 25, 2024 to Sunday, March 31, 2024
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 18), end: new Date(2024, 2, 24) }, // Previous week
        { start: new Date(2024, 2, 25), end: new Date(2024, 2, 31) }, // Last week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.Last);
      expect(result).toBe(EMonthsEndsIndxsValues.Full);
    });

    it('should return HalfBorder when week does not end on Sunday, starts in different month', () => {
      // Monday, March 25, 2024 to Monday, April 1, 2024 (March to April)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 18), end: new Date(2024, 2, 24) }, // Previous week
        { start: new Date(2024, 2, 25), end: new Date(2024, 3, 1) }, // Last week (starts in March, ends on Monday in April)
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.Last);
      expect(result).toBe(EMonthsEndsIndxsValues.HalfBorder);
    });

    it('should return FullBorderEnd when week ends on Sunday, starts in same month, previous week in different month', () => {
      // Monday, March 25, 2024 to Sunday, March 31, 2024 (previous week ended in February)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 1, 26), end: new Date(2024, 1, 29) }, // Previous week (February)
        { start: new Date(2024, 2, 25), end: new Date(2024, 2, 31) }, // Last week (March)
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.Last);
      expect(result).toBe(EMonthsEndsIndxsValues.FullBorderEnd);
    });

    it('should return Half when week does not end on Sunday, starts in same month, previous week in same month', () => {
      // Monday, March 25, 2024 to Friday, March 29, 2024
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 18), end: new Date(2024, 2, 24) }, // Previous week
        { start: new Date(2024, 2, 25), end: new Date(2024, 2, 29) }, // Last week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.Last);
      expect(result).toBe(EMonthsEndsIndxsValues.Half);
    });

    it('should return HalfBorder when week does not end on Sunday, starts in different month', () => {
      // Monday, March 25, 2024 to Friday, March 29, 2024 (March to April)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 18), end: new Date(2024, 2, 24) }, // Previous week
        { start: new Date(2024, 2, 25), end: new Date(2024, 3, 1) }, // Last week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.Last);
      expect(result).toBe(EMonthsEndsIndxsValues.HalfBorder);
    });

    it('should return HalfBorderEnd when week does not end on Sunday, starts in same month, previous week in different month', () => {
      // Monday, March 25, 2024 to Friday, March 29, 2024 (previous week ended in February)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 1, 26), end: new Date(2024, 1, 29) }, // Previous week (February)
        { start: new Date(2024, 2, 25), end: new Date(2024, 2, 29) }, // Last week (March)
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.Last);
      expect(result).toBe(EMonthsEndsIndxsValues.HalfBorderEnd);
    });
  });

  describe('edge cases', () => {
    it('should handle single week array for first week', () => {
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 4), end: new Date(2024, 2, 10) }, // Only one week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.Full);
    });

    it('should handle single week array for last week', () => {
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 2, 4), end: new Date(2024, 2, 10) }, // Only one week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.Last);
      expect(result).toBe(EMonthsEndsIndxsValues.Full);
    });

    it('should handle leap year February', () => {
      // Monday, February 26, 2024 to Sunday, March 3, 2024 (leap year)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 1, 26), end: new Date(2024, 2, 3) }, // First week
        { start: new Date(2024, 2, 4), end: new Date(2024, 2, 10) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.FullBorder);
    });

    it('should handle year boundary (December to January)', () => {
      // Monday, December 30, 2024 to Sunday, January 5, 2025
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2024, 11, 30), end: new Date(2025, 0, 5) }, // First week
        { start: new Date(2025, 0, 6), end: new Date(2025, 0, 12) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.FullBorder);
    });

    it('should handle non-leap year February', () => {
      // Monday, February 27, 2023 to Sunday, March 5, 2023 (non-leap year)
      const weekTimePoints = createWeekTimePoints([
        { start: new Date(2023, 1, 27), end: new Date(2023, 2, 5) }, // First week (starts on Monday, ends in different month)
        { start: new Date(2023, 2, 6), end: new Date(2023, 2, 12) }, // Next week
      ]);

      const result = calculateMonthExtremeWeekType(weekTimePoints, EWeekPosition.First);
      expect(result).toBe(EMonthsEndsIndxsValues.FullBorder);
    });
  });
});
