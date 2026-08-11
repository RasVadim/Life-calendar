import { describe, it, expect, beforeEach } from 'vitest';

import { THolidayName, TDrawWeekIndexes } from '@/types';

import { updateHolidaysIndxs } from '../updateHolidaysIndxs';

describe('updateHolidaysIndxs', () => {
  let mockDrawWeekIndexes: TDrawWeekIndexes;

  beforeEach(() => {
    mockDrawWeekIndexes = {
      holidaysIndxs: {},
    } as TDrawWeekIndexes;
  });

  describe('Basic functionality', () => {
    it('should set first holiday when holidays array is provided', () => {
      const holidays: THolidayName[] = ['birthday', 'newYear'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('birthday');
    });

    it('should not set anything when holidays array is empty', () => {
      const holidays: THolidayName[] = [];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBeUndefined();
    });

    it('should not set anything when holidays is undefined', () => {
      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays: undefined,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBeUndefined();
    });

    it('should not set anything when holidays is not provided', () => {
      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBeUndefined();
    });
  });

  describe('Different week indices', () => {
    it('should work with different week indices', () => {
      const holidays: THolidayName[] = ['birthday'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 5,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![5]).toBe('birthday');
      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBeUndefined();
    });

    it('should work with multiple week indices', () => {
      const holidays1: THolidayName[] = ['birthday'];
      const holidays2: THolidayName[] = ['newYear'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays: holidays1,
      });

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 1,
        holidays: holidays2,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('birthday');
      expect(mockDrawWeekIndexes.holidaysIndxs![1]).toBe('newYear');
    });
  });

  describe('Holiday types', () => {
    it('should work with birthday holiday', () => {
      const holidays: THolidayName[] = ['birthday'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('birthday');
    });

    it('should work with newYear holiday', () => {
      const holidays: THolidayName[] = ['newYear'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('newYear');
    });

    it('should work with Feb23 holiday', () => {
      const holidays: THolidayName[] = ['23Feb'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('23Feb');
    });

    it('should work with Mar8 holiday', () => {
      const holidays: THolidayName[] = ['8Mar'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('8Mar');
    });
  });

  describe('Multiple holidays handling', () => {
    it('should only use first holiday when multiple holidays are provided', () => {
      const holidays: THolidayName[] = ['birthday', 'newYear', '23Feb'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('birthday');
    });

    it('should overwrite existing holiday when called multiple times', () => {
      const holidays1: THolidayName[] = ['birthday'];
      const holidays2: THolidayName[] = ['newYear'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays: holidays1,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('birthday');

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays: holidays2,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('newYear');
    });
  });

  describe('Edge cases', () => {
    it('should handle weekIndex 0', () => {
      const holidays: THolidayName[] = ['birthday'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![0]).toBe('birthday');
    });

    it('should handle large weekIndex', () => {
      const holidays: THolidayName[] = ['birthday'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 1000,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![1000]).toBe('birthday');
    });

    it('should handle negative weekIndex', () => {
      const holidays: THolidayName[] = ['birthday'];

      updateHolidaysIndxs({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: -1,
        holidays,
      });

      expect(mockDrawWeekIndexes.holidaysIndxs![-1]).toBe('birthday');
    });
  });
});
