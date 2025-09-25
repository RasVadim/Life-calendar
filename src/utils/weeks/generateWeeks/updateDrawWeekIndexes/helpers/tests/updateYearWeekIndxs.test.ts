import { describe, it, expect, beforeEach } from 'vitest';

import { HOLIDAY_NAMES } from '@/constants';
import { EYearsWeekIndxsValues, TDrawWeekIndexes, EDayOfWeek } from '@/types';

import { TWeekMeta } from '../../../types';
import { updateYearWeekIndexes } from '../updateYearWeekIndxs';

describe('updateYearWeekIndexes', () => {
  let mockDrawWeekIndexes: TDrawWeekIndexes;
  let mockMeta: TWeekMeta;

  beforeEach(() => {
    mockDrawWeekIndexes = {
      yearsIndxs: {},
    } as TDrawWeekIndexes;

    mockMeta = {
      days: [
        {
          id: '1',
          date: '2024-01-01',
          dayOfWeek: EDayOfWeek.Monday,
          isWeekPreview: false,
          holidays: [],
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
    } as unknown as TWeekMeta;
  });

  describe('HalfLeap scenario', () => {
    it('should set HalfLeap when leap year week spans two years and Tuesday is in next year', () => {
      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      // Create meta where Tuesday (day 2) falls in next year
      const tuesdayInNextYearMeta = {
        ...mockMeta,
        days: [
          mockMeta.days[0], // Monday in 2024
          {
            ...mockMeta.days[1],
            date: '2025-01-02', // Tuesday in 2025
          },
          ...mockMeta.days.slice(2),
        ],
      };

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 2025,
        currentWeekIndex: 0,
        weekIndex: 0,
        weekDuration: 7,
        isLeapYear: true,
        weekTimePoints,
        meta: tuesdayInNextYearMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.HalfLeap);
    });

    it('should not set HalfLeap when not a leap year', () => {
      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 2025,
        currentWeekIndex: 0,
        weekIndex: 0,
        weekDuration: 7,
        isLeapYear: false,
        weekTimePoints,
        meta: mockMeta,
      });

      // Should set Half instead because week spans two years
      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.Half);
    });
  });

  describe('Half scenario', () => {
    it('should set Half when week spans two life years', () => {
      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 2025,
        currentWeekIndex: 0,
        weekIndex: 0,
        weekDuration: 7,
        isLeapYear: false,
        weekTimePoints,
        meta: mockMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.Half);
    });

    it('should set Half when this is first week of life with less than 7 days', () => {
      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 0,
        currentWeekIndex: 0,
        weekIndex: 0,
        weekDuration: 5, // Less than 7 days
        isLeapYear: false,
        weekTimePoints,
        meta: mockMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.Half);
    });

    it('should set Half when this is last week of life with less than 7 days', () => {
      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
        {
          weekStart: new Date('2024-01-08'),
          weekEnd: new Date('2024-01-14'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 0,
        currentWeekIndex: 0,
        weekIndex: 1, // Last week
        weekDuration: 3, // Less than 7 days
        isLeapYear: false,
        weekTimePoints,
        meta: mockMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.Half);
    });
  });

  describe('FullFirst scenario', () => {
    it('should set FullFirst when week starts from birthday', () => {
      const birthdayMeta = {
        ...mockMeta,
        days: [
          {
            ...mockMeta.days[0],
            holidays: [HOLIDAY_NAMES.birthday],
          },
          ...mockMeta.days.slice(1),
        ],
      };

      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 0,
        currentWeekIndex: 0,
        weekIndex: 5, // Not first or last week
        weekDuration: 7,
        isLeapYear: false,
        weekTimePoints,
        meta: birthdayMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.FullFirst);
    });

    it('should not set FullFirst when week does not start from birthday', () => {
      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 0,
        currentWeekIndex: 0,
        weekIndex: 5, // Not first or last week
        weekDuration: 7,
        isLeapYear: false,
        weekTimePoints,
        meta: mockMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBeUndefined();
    });
  });

  describe('Priority order', () => {
    it('should prioritize HalfLeap over Half when both conditions are met', () => {
      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      // Create meta where Tuesday (day 2) falls in next year
      const tuesdayInNextYearMeta = {
        ...mockMeta,
        days: [
          mockMeta.days[0], // Monday in 2024
          {
            ...mockMeta.days[1],
            date: '2025-01-02', // Tuesday in 2025
          },
          ...mockMeta.days.slice(2),
        ],
      };

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 2025, // Week spans two years
        currentWeekIndex: 0,
        weekIndex: 0,
        weekDuration: 5, // First week with less than 7 days
        isLeapYear: true,
        weekTimePoints,
        meta: tuesdayInNextYearMeta,
      });

      // Should be HalfLeap, not Half
      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.HalfLeap);
    });

    it('should prioritize Half over FullFirst when both conditions are met', () => {
      const birthdayMeta = {
        ...mockMeta,
        days: [
          {
            ...mockMeta.days[0],
            holidays: [HOLIDAY_NAMES.birthday],
          },
          ...mockMeta.days.slice(1),
        ],
      };

      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 2025, // Week spans two years
        currentWeekIndex: 0,
        weekIndex: 5, // Not first or last week
        weekDuration: 7,
        isLeapYear: false,
        weekTimePoints,
        meta: birthdayMeta,
      });

      // Should be Half, not FullFirst
      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBe(EYearsWeekIndxsValues.Half);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty holidays array', () => {
      const emptyHolidaysMeta = {
        ...mockMeta,
        days: [
          {
            ...mockMeta.days[0],
            holidays: [],
          },
          ...mockMeta.days.slice(1),
        ],
      };

      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 0,
        currentWeekIndex: 0,
        weekIndex: 5,
        weekDuration: 7,
        isLeapYear: false,
        weekTimePoints,
        meta: emptyHolidaysMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBeUndefined();
    });

    it('should handle undefined holidays', () => {
      const undefinedHolidaysMeta = {
        ...mockMeta,
        days: [
          {
            ...mockMeta.days![0],
            holidays: null,
          },
          ...mockMeta.days!.slice(1),
        ],
      };

      const weekTimePoints = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
        },
      ];

      updateYearWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        lifeYear: 2024,
        secondLifeYear: 0,
        currentWeekIndex: 0,
        weekIndex: 5,
        weekDuration: 7,
        isLeapYear: false,
        weekTimePoints,
        meta: undefinedHolidaysMeta,
      });

      expect(mockDrawWeekIndexes.yearsIndxs![0]).toBeUndefined();
    });
  });
});
