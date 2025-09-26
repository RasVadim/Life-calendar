import { describe, it, expect, beforeEach } from 'vitest';

import { HOLIDAY_NAMES } from '@/constants';
import { TDrawWeekIndexes, THolidayName, EDayOfWeek, ESeason, EWeekType } from '@/types';

import { TWeekMeta } from '../../types';
import { updateDrawWeekIndexes } from '../updateDrawWeekIndexes';

describe('updateDrawWeekIndexes', () => {
  let mockDrawWeekIndexes: TDrawWeekIndexes;
  let mockMeta: TWeekMeta;
  let mockWeekTimePoints: { weekStart: Date; weekEnd: Date }[];
  let mockHolidays: THolidayName[];

  beforeEach(() => {
    mockDrawWeekIndexes = {
      yearsIndxs: {},
      seasonsIndxs: {},
      monthsIndxs: {},
      holidaysIndxs: {},
      seasonOffset: 0,
      monthOffset: 0,
      yearRows: 90,
      lastWeekIndex: 0,
    };

    mockMeta = {
      days: [
        {
          id: '1',
          date: '2024-01-01',
          dayOfWeek: EDayOfWeek.Monday,
          isWeekPreview: false,
          holidays: [HOLIDAY_NAMES.birthday],
          lifeDay: 1,
          comments: null,
          description: null,
        },
        {
          id: '2',
          date: '2024-01-02',
          dayOfWeek: EDayOfWeek.Tuesday,
          isWeekPreview: false,
          holidays: [],
          lifeDay: 2,
          comments: null,
          description: null,
        },
        {
          id: '3',
          date: '2024-01-03',
          dayOfWeek: EDayOfWeek.Wednesday,
          isWeekPreview: false,
          holidays: [],
          lifeDay: 3,
          comments: null,
          description: null,
        },
        {
          id: '4',
          date: '2024-01-04',
          dayOfWeek: EDayOfWeek.Thursday,
          isWeekPreview: false,
          holidays: [],
          lifeDay: 4,
          comments: null,
          description: null,
        },
        {
          id: '5',
          date: '2024-01-05',
          dayOfWeek: EDayOfWeek.Friday,
          isWeekPreview: false,
          holidays: [],
          lifeDay: 5,
          comments: null,
          description: null,
        },
        {
          id: '6',
          date: '2024-01-06',
          dayOfWeek: EDayOfWeek.Saturday,
          isWeekPreview: false,
          holidays: [],
          lifeDay: 6,
          comments: null,
          description: null,
        },
        {
          id: '7',
          date: '2024-01-07',
          dayOfWeek: EDayOfWeek.Sunday,
          isWeekPreview: false,
          holidays: [],
          lifeDay: 7,
          comments: null,
          description: null,
        },
      ],
      year: '2024',
      secondYear: null,
      month: '01',
      secondMonth: null,
      season: ESeason.Winter,
      secondSeason: null,
      isLeapYear: false,
      media: null,
    };

    mockWeekTimePoints = [
      { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') },
      { weekStart: new Date('2024-01-08'), weekEnd: new Date('2024-01-14') },
      { weekStart: new Date('2024-01-15'), weekEnd: new Date('2024-01-21') },
    ];

    mockHolidays = [HOLIDAY_NAMES.birthday];
  });

  describe('Basic functionality', () => {
    it('should set lastWeekIndex to weekTimePoints.length - 1', () => {
      updateDrawWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        meta: mockMeta,
        lifeYear: 1,
        secondLifeYear: 1,
        weekTimePoints: mockWeekTimePoints,
        currentWeekIndex: 0,
        holidays: mockHolidays,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.lastWeekIndex).toBe(2); // 3 weeks - 1 = 2
    });

    it('should not throw errors with valid input', () => {
      expect(() => {
        updateDrawWeekIndexes({
          drawWeekIndexes: mockDrawWeekIndexes,
          weekIndex: 0,
          meta: mockMeta,
          lifeYear: 1,
          secondLifeYear: 1,
          weekTimePoints: mockWeekTimePoints,
          currentWeekIndex: 0,
          holidays: mockHolidays,
          previousWeek: null,
        });
      }).not.toThrow();
    });
  });

  describe('Different scenarios', () => {
    it('should handle different week durations', () => {
      const shortWeekMeta = {
        ...mockMeta,
        days: mockMeta.days.slice(0, 3), // Only 3 days
      };

      expect(() => {
        updateDrawWeekIndexes({
          drawWeekIndexes: mockDrawWeekIndexes,
          weekIndex: 0,
          meta: shortWeekMeta,
          lifeYear: 1,
          secondLifeYear: 1,
          weekTimePoints: mockWeekTimePoints,
          currentWeekIndex: 0,
          holidays: mockHolidays,
          previousWeek: null,
        });
      }).not.toThrow();
    });

    it('should handle different life years', () => {
      expect(() => {
        updateDrawWeekIndexes({
          drawWeekIndexes: mockDrawWeekIndexes,
          weekIndex: 0,
          meta: mockMeta,
          lifeYear: 5,
          secondLifeYear: 6,
          weekTimePoints: mockWeekTimePoints,
          currentWeekIndex: 0,
          holidays: mockHolidays,
          previousWeek: null,
        });
      }).not.toThrow();
    });

    it('should handle leap year', () => {
      const leapYearMeta = {
        ...mockMeta,
        isLeapYear: true,
      };

      expect(() => {
        updateDrawWeekIndexes({
          drawWeekIndexes: mockDrawWeekIndexes,
          weekIndex: 0,
          meta: leapYearMeta,
          lifeYear: 1,
          secondLifeYear: 1,
          weekTimePoints: mockWeekTimePoints,
          currentWeekIndex: 0,
          holidays: mockHolidays,
          previousWeek: null,
        });
      }).not.toThrow();
    });

    it('should handle different week indices', () => {
      expect(() => {
        updateDrawWeekIndexes({
          drawWeekIndexes: mockDrawWeekIndexes,
          weekIndex: 5,
          meta: mockMeta,
          lifeYear: 1,
          secondLifeYear: 1,
          weekTimePoints: mockWeekTimePoints,
          currentWeekIndex: 2,
          holidays: mockHolidays,
          previousWeek: null,
        });
      }).not.toThrow();
    });

    it('should handle previous week', () => {
      const mockPreviousWeek = {
        id: 'prev-week',
        dateStart: '2023-12-25',
        dateEnd: '2023-12-31',
        type: EWeekType.Past,
        lifeMonth: 12,
        lifeYear: 1,
        secondLifeYear: null,
        year: '2023',
        secondYear: null,
        month: '12',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        isLeapYear: false,
        days: [],
        media: null,
        holidays: [],
        yearZodiacLabel: 'rat' as const,
        comments: null,
        description: null,
      };

      expect(() => {
        updateDrawWeekIndexes({
          drawWeekIndexes: mockDrawWeekIndexes,
          weekIndex: 0,
          meta: mockMeta,
          lifeYear: 1,
          secondLifeYear: 1,
          weekTimePoints: mockWeekTimePoints,
          currentWeekIndex: 0,
          holidays: mockHolidays,
          previousWeek: mockPreviousWeek,
        });
      }).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty holidays array', () => {
      expect(() => {
        updateDrawWeekIndexes({
          drawWeekIndexes: mockDrawWeekIndexes,
          weekIndex: 0,
          meta: mockMeta,
          lifeYear: 1,
          secondLifeYear: 1,
          weekTimePoints: mockWeekTimePoints,
          currentWeekIndex: 0,
          holidays: [],
          previousWeek: null,
        });
      }).not.toThrow();
    });

    it('should handle single week in weekTimePoints', () => {
      const singleWeekTimePoints = [mockWeekTimePoints[0]];

      updateDrawWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        weekIndex: 0,
        meta: mockMeta,
        lifeYear: 1,
        secondLifeYear: 1,
        weekTimePoints: singleWeekTimePoints,
        currentWeekIndex: 0,
        holidays: mockHolidays,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.lastWeekIndex).toBe(0); // 1 - 1 = 0
    });
  });
});
