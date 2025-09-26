import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { IWeek } from '@/store/clientDB';
import { EWeekType, ESeason, EDayOfWeek } from '@/types/life';

import { findCurrentWeek } from '../findCurrentWeek';

describe('findCurrentWeek', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockWeek = (
    id: string,
    dateStart: string,
    dateEnd: string,
    type: EWeekType = EWeekType.Present,
  ): IWeek => ({
    id,
    dateStart,
    dateEnd,
    type,
    month: '3',
    secondMonth: null,
    season: ESeason.Spring,
    secondSeason: null,
    year: '2024',
    secondYear: null,
    lifeYear: 35,
    secondLifeYear: null,
    lifeMonth: 3,
    isLeapYear: true,
    media: null,
    holidays: null,
    yearZodiacLabel: null,
    comments: null,
    description: null,
    days: [
      {
        id: 'w1_d1',
        date: dateStart,
        dayOfWeek: EDayOfWeek.Monday,
        isWeekPreview: false,
        holidays: null,
        lifeDay: 1,
        comments: null,
        description: null,
      },
    ],
  });

  describe('when current date is within a week', () => {
    it('should find week when current date is in the middle of week', () => {
      // Set current date to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
        createMockWeek('week-3', '2024-03-15', '2024-03-21'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toEqual({
        item: weeks[0],
        index: 0,
      });
    });

    it('should find week when current date is at week start', () => {
      // Set current date to March 1, 2024
      vi.setSystemTime(new Date('2024-03-01T00:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toEqual({
        item: weeks[0],
        index: 0,
      });
    });

    it('should find week when current date is at week end', () => {
      // Set current date to March 7, 2024
      vi.setSystemTime(new Date('2024-03-07T00:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toEqual({
        item: weeks[0],
        index: 0,
      });
    });

    it('should find correct week when multiple weeks exist', () => {
      // Set current date to March 12, 2024
      vi.setSystemTime(new Date('2024-03-12T12:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
        createMockWeek('week-3', '2024-03-15', '2024-03-21'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toEqual({
        item: weeks[1],
        index: 1,
      });
    });
  });

  describe('when current date is not within any week', () => {
    it('should return undefined when current date is before all weeks', () => {
      // Set current date to February 28, 2024
      vi.setSystemTime(new Date('2024-02-28T12:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toBeUndefined();
    });

    it('should return undefined when current date is after all weeks', () => {
      // Set current date to March 15, 2024
      vi.setSystemTime(new Date('2024-03-15T12:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toBeUndefined();
    });

    it('should return undefined when there is a gap between weeks', () => {
      // Set current date to March 10, 2024 (gap between weeks)
      vi.setSystemTime(new Date('2024-03-10T12:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-15', '2024-03-21'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toBeUndefined();
    });
  });

  describe('when weeks have invalid date ranges', () => {
    it('should skip weeks with null dateStart', () => {
      // Set current date to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const weeks = [
        { ...createMockWeek('week-1', '2024-03-01', '2024-03-07'), dateStart: null },
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toBeUndefined();
    });

    it('should skip weeks with null dateEnd', () => {
      // Set current date to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const weeks = [
        { ...createMockWeek('week-1', '2024-03-01', '2024-03-07'), dateEnd: null },
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toBeUndefined();
    });

    it('should skip weeks with undefined dateStart', () => {
      // Set current date to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const weeks = [
        { ...createMockWeek('week-1', '2024-03-01', '2024-03-07'), dateStart: undefined },
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toBeUndefined();
    });

    it('should skip weeks with undefined dateEnd', () => {
      // Set current date to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const weeks = [
        { ...createMockWeek('week-1', '2024-03-01', '2024-03-07'), dateEnd: undefined },
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty weeks array', () => {
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const result = findCurrentWeek([], new Date());

      expect(result).toBeUndefined();
    });

    it('should handle single week array', () => {
      // Set current date to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const weeks = [createMockWeek('week-1', '2024-03-01', '2024-03-07')];

      const result = findCurrentWeek(weeks, new Date());

      expect(result).toEqual({
        item: weeks[0],
        index: 0,
      });
    });

    it('should handle custom currentDate parameter', () => {
      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      // Use custom date instead of current time
      const customDate = new Date('2024-03-12T12:00:00.000Z');
      const result = findCurrentWeek(weeks, customDate);

      expect(result).toEqual({
        item: weeks[1],
        index: 1,
      });
    });

    it('should handle weeks with same date ranges', () => {
      // Set current date to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-01', '2024-03-07'), // Same date range
      ];

      const result = findCurrentWeek(weeks, new Date());

      // Should return the first matching week
      expect(result).toEqual({
        item: weeks[0],
        index: 0,
      });
    });
  });

  describe('date boundary conditions', () => {
    it('should handle exact date boundaries', () => {
      const weeks = [
        createMockWeek('week-1', '2024-03-01', '2024-03-07'),
        createMockWeek('week-2', '2024-03-08', '2024-03-14'),
      ];

      // Test exact start boundary
      const startResult = findCurrentWeek(weeks, new Date('2024-03-01T00:00:00.000Z'));
      expect(startResult).toEqual({
        item: weeks[0],
        index: 0,
      });

      // Test exact end boundary
      const endResult = findCurrentWeek(weeks, new Date('2024-03-07T00:00:00.000Z'));
      expect(endResult).toEqual({
        item: weeks[0],
        index: 0,
      });
    });

    it('should handle leap year dates', () => {
      const weeks = [
        createMockWeek('week-1', '2024-02-29', '2024-03-06'), // Leap year
        createMockWeek('week-2', '2024-03-07', '2024-03-13'),
      ];

      const result = findCurrentWeek(weeks, new Date('2024-02-29T12:00:00.000Z'));

      expect(result).toEqual({
        item: weeks[0],
        index: 0,
      });
    });
  });
});
