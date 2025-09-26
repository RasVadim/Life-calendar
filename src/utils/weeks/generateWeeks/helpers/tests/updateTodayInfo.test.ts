import { describe, it, expect } from 'vitest';

import { EWeekType, ESeason, EDayOfWeek } from '@/types';

import { updateTodayInfo } from '../updateTodayInfo';

// Helper function to create mock week
function createMockWeek(type: EWeekType, days: string[], secondLifeYear = false) {
  return {
    id: 'test-week',
    dateStart: '2024-01-01',
    dateEnd: '2024-01-07',
    type,
    month: '1',
    secondMonth: null,
    season: ESeason.Winter,
    secondSeason: null,
    year: '2024',
    secondYear: null,
    lifeYear: 1,
    secondLifeYear: secondLifeYear ? 1 : null,
    lifeMonth: 1,
    isLeapYear: false,
    isSeasonPreview: false,
    isMonthPreview: false,
    holidays: null,
    yearZodiacLabel: null,
    comments: null,
    description: null,
    media: null,
    days: days.map((date, index) => ({
      id: `day-${index}`,
      date,
      isToday: false,
      isPast: false,
      isFuture: false,
      dayOfWeek: EDayOfWeek.Monday,
      isWeekPreview: false,
      holidays: null,
      lifeDay: index + 1,
      lifeWeek: 1,
      lifeMonth: 1,
      comments: null,
      description: null,
    })),
  };
}

describe('updateTodayInfo', () => {
  describe('Present week scenarios', () => {
    it('should update today info when present week contains today', () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const week = createMockWeek(EWeekType.Present, [
        '2024-01-01',
        '2024-01-02',
        today,
        '2024-01-04',
        '2024-01-05',
        '2024-01-06',
        '2024-01-07',
      ]);

      const todayInfo = {
        todayWeekId: '',
        todayWeekIndex: 0,
        todayWeekYearHalf: null,
        todayDayId: '',
        todayDayIndex: 0,
      };

      updateTodayInfo(week, new Date('1990-01-01'), todayInfo, 5);

      expect(todayInfo.todayWeekId).toBe('test-week');
      expect(todayInfo.todayWeekIndex).toBe(5);
      expect(todayInfo.todayDayId).toBe('day-2');
      expect(todayInfo.todayDayIndex).toBe(2);
    });

    it('should update week info but not day info when present week does not contain today', () => {
      const week = createMockWeek(EWeekType.Present, [
        '2024-01-01',
        '2024-01-02',
        '2024-01-03',
        '2024-01-04',
        '2024-01-05',
        '2024-01-06',
        '2024-01-07',
      ]);

      const todayInfo = {
        todayWeekId: '',
        todayWeekIndex: 0,
        todayWeekYearHalf: null,
        todayDayId: '',
        todayDayIndex: 0,
      };

      updateTodayInfo(week, new Date('1990-01-01'), todayInfo, 5);

      expect(todayInfo.todayWeekId).toBe('test-week');
      expect(todayInfo.todayWeekIndex).toBe(5);
      expect(todayInfo.todayDayId).toBe('');
      expect(todayInfo.todayDayIndex).toBe(0);
    });
  });

  describe('Past week scenarios', () => {
    it('should update week info but not day info for past weeks', () => {
      const week = createMockWeek(EWeekType.Past, [
        '2024-01-01',
        '2024-01-02',
        '2024-01-03',
        '2024-01-04',
        '2024-01-05',
        '2024-01-06',
        '2024-01-07',
      ]);

      const todayInfo = {
        todayWeekId: '',
        todayWeekIndex: 0,
        todayWeekYearHalf: null,
        todayDayId: '',
        todayDayIndex: 0,
      };

      updateTodayInfo(week, new Date('1990-01-01'), todayInfo, 5);

      expect(todayInfo.todayWeekId).toBe('test-week');
      expect(todayInfo.todayWeekIndex).toBe(5);
      expect(todayInfo.todayDayId).toBe('');
      expect(todayInfo.todayDayIndex).toBe(0);
    });
  });
});
