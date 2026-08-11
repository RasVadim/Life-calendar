import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { IWeek } from '@/store/clientDB';
import { ESide } from '@/types/draw';
import { EWeekType, ESeason, EDayOfWeek } from '@/types/life';

import { calculateTodayDayInfo, TodayDayInfo } from '../calculateTodayDayInfo';

describe('calculateTodayDayInfo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockWeek = (days: string[], secondLifeYear: number | null = null): IWeek => ({
    id: 'test-week',
    dateStart: '2024-03-01',
    dateEnd: '2024-03-07',
    type: EWeekType.Present,
    month: '3',
    secondMonth: null,
    season: ESeason.Spring,
    secondSeason: null,
    year: '2024',
    secondYear: null,
    lifeYear: 35,
    secondLifeYear,
    lifeMonth: 3,
    isLeapYear: true,
    media: null,
    holidays: null,
    yearZodiacLabel: null,
    comments: null,
    description: null,
    days: days.map((date, index) => ({
      id: `w1_d${index + 1}`,
      date,
      dayOfWeek: EDayOfWeek.Monday,
      isWeekPreview: false,
      holidays: null,
      lifeDay: index + 1,
      comments: null,
      description: null,
    })),
  });

  const mockBirthDate = new Date('1989-03-01');

  describe('when today is in the week', () => {
    it('should return correct day info when today is in the middle of week', () => {
      // Set today to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const week = createMockWeek([
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07',
      ]);

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d4',
        todayDayIndex: 3,
        todayWeekYearHalf: null,
      });
    });

    it('should return correct day info when today is at week start', () => {
      // Set today to March 1, 2024
      vi.setSystemTime(new Date('2024-03-01T12:00:00.000Z'));

      const week = createMockWeek([
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07',
      ]);

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d1',
        todayDayIndex: 0,
        todayWeekYearHalf: null,
      });
    });

    it('should return correct day info when today is at week end', () => {
      // Set today to March 7, 2024
      vi.setSystemTime(new Date('2024-03-07T12:00:00.000Z'));

      const week = createMockWeek([
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07',
      ]);

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d7',
        todayDayIndex: 6,
        todayWeekYearHalf: null,
      });
    });
  });

  describe('when today is not in the week', () => {
    it('should return empty day info when today is before week', () => {
      // Set today to February 28, 2024
      vi.setSystemTime(new Date('2024-02-28T12:00:00.000Z'));

      const week = createMockWeek([
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07',
      ]);

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: '',
        todayDayIndex: 0,
        todayWeekYearHalf: null,
      });
    });

    it('should return empty day info when today is after week', () => {
      // Set today to March 8, 2024
      vi.setSystemTime(new Date('2024-03-08T12:00:00.000Z'));

      const week = createMockWeek([
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07',
      ]);

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: '',
        todayDayIndex: 0,
        todayWeekYearHalf: null,
      });
    });
  });

  describe('secondLifeYear scenarios', () => {
    it('should calculate Left half when today is before birth date', () => {
      // Set today to February 15, 2024 (before birth date March 1)
      vi.setSystemTime(new Date('2024-02-15T12:00:00.000Z'));

      const week = createMockWeek(
        [
          '2024-02-15',
          '2024-02-16',
          '2024-02-17',
          '2024-02-18',
          '2024-02-19',
          '2024-02-20',
          '2024-02-21',
        ],
        35,
      ); // secondLifeYear = 35

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d1',
        todayDayIndex: 0,
        todayWeekYearHalf: ESide.Left,
      });
    });

    it('should calculate Right half when today is after birth date', () => {
      // Set today to March 15, 2024 (after birth date March 1)
      vi.setSystemTime(new Date('2024-03-15T12:00:00.000Z'));

      const week = createMockWeek(
        [
          '2024-03-15',
          '2024-03-16',
          '2024-03-17',
          '2024-03-18',
          '2024-03-19',
          '2024-03-20',
          '2024-03-21',
        ],
        35,
      ); // secondLifeYear = 35

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d1',
        todayDayIndex: 0,
        todayWeekYearHalf: ESide.Right,
      });
    });

    it('should not calculate year half when secondLifeYear is null', () => {
      // Set today to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const week = createMockWeek(
        [
          '2024-03-01',
          '2024-03-02',
          '2024-03-03',
          '2024-03-04',
          '2024-03-05',
          '2024-03-06',
          '2024-03-07',
        ],
        null,
      ); // secondLifeYear = null

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d4',
        todayDayIndex: 3,
        todayWeekYearHalf: null,
      });
    });

    it('should not calculate year half when birthDate is null', () => {
      // Set today to March 4, 2024
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const week = createMockWeek(
        [
          '2024-03-01',
          '2024-03-02',
          '2024-03-03',
          '2024-03-04',
          '2024-03-05',
          '2024-03-06',
          '2024-03-07',
        ],
        35,
      ); // secondLifeYear = 35

      const result = calculateTodayDayInfo(week, new Date(), null); // birthDate = null

      expect(result).toEqual({
        todayDayId: 'w1_d4',
        todayDayIndex: 3,
        todayWeekYearHalf: null,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle single day week', () => {
      // Set today to March 1, 2024
      vi.setSystemTime(new Date('2024-03-01T12:00:00.000Z'));

      const week = createMockWeek(['2024-03-01']);

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d1',
        todayDayIndex: 0,
        todayWeekYearHalf: null,
      });
    });

    it('should handle empty days array', () => {
      // Set today to March 1, 2024
      vi.setSystemTime(new Date('2024-03-01T12:00:00.000Z'));

      const week = createMockWeek([]);

      const result = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(result).toEqual({
        todayDayId: '',
        todayDayIndex: 0,
        todayWeekYearHalf: null,
      });
    });

    it('should handle custom currentDate parameter', () => {
      const week = createMockWeek([
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07',
      ]);

      // Use custom date instead of current time
      const customDate = new Date('2024-03-04T12:00:00.000Z');
      const result = calculateTodayDayInfo(week, customDate, mockBirthDate);

      expect(result).toEqual({
        todayDayId: 'w1_d4',
        todayDayIndex: 3,
        todayWeekYearHalf: null,
      });
    });
  });

  describe('type safety', () => {
    it('should return correct TodayDayInfo type', () => {
      vi.setSystemTime(new Date('2024-03-04T12:00:00.000Z'));

      const week = createMockWeek([
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07',
      ]);

      const result: TodayDayInfo = calculateTodayDayInfo(week, new Date(), mockBirthDate);

      expect(typeof result.todayDayId).toBe('string');
      expect(typeof result.todayDayIndex).toBe('number');
      expect(
        result.todayWeekYearHalf === null ||
          result.todayWeekYearHalf === ESide.Left ||
          result.todayWeekYearHalf === ESide.Right,
      ).toBe(true);
    });
  });
});
