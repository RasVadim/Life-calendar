import { describe, it, expect, beforeEach } from 'vitest';

import { IWeek } from '@/store/clientDB';
import {
  EMonthsEndsIndxsValues,
  EMonthsWeekIndxsValues,
  TDrawWeekIndexes,
  EDayOfWeek,
  EWeekType,
  ESeason,
} from '@/types';

import { updateMonthWeekIndexes } from './updateMonthWeekIndxs';
import { TWeekMeta } from '../../types';

describe('updateMonthWeekIndexes', () => {
  let mockDrawWeekIndexes: TDrawWeekIndexes;
  let mockMeta: TWeekMeta;
  let mockWeekTimePoints: { weekStart: Date; weekEnd: Date }[];

  beforeEach(() => {
    mockDrawWeekIndexes = {
      monthsIndxs: {},
    } as TDrawWeekIndexes;

    mockMeta = {
      days: [
        {
          id: '1',
          date: '2024-01-01',
          dayOfWeek: EDayOfWeek.Monday,
          holidays: [],
          comments: null,
          description: null,
        },
        {
          id: '2',
          date: '2024-01-02',
          dayOfWeek: EDayOfWeek.Tuesday,
          holidays: [],
          lifeDay: 2,
          comments: null,
          description: null,
        },
        {
          id: '3',
          date: '2024-01-03',
          dayOfWeek: EDayOfWeek.Wednesday,
          holidays: [],
          lifeDay: 3,
          comments: null,
          description: null,
        },
        {
          id: '4',
          date: '2024-01-04',
          dayOfWeek: EDayOfWeek.Thursday,
          holidays: [],
          lifeDay: 4,
          comments: null,
          description: null,
        },
        {
          id: '5',
          date: '2024-01-05',
          dayOfWeek: EDayOfWeek.Friday,
          holidays: [],
          lifeDay: 5,
          comments: null,
          description: null,
        },
        {
          id: '6',
          date: '2024-01-06',
          dayOfWeek: EDayOfWeek.Saturday,
          holidays: [],
          lifeDay: 6,
          comments: null,
          description: null,
        },
        {
          id: '7',
          date: '2024-01-07',
          dayOfWeek: EDayOfWeek.Sunday,
          holidays: [],
          lifeDay: 7,
          comments: null,
          description: null,
        },
      ],
    } as unknown as TWeekMeta;

    mockWeekTimePoints = [
      { weekStart: new Date('2024-01-01'), weekEnd: new Date('2024-01-07') },
      { weekStart: new Date('2024-01-08'), weekEnd: new Date('2024-01-14') },
      { weekStart: new Date('2024-01-15'), weekEnd: new Date('2024-01-21') },
    ];
  });

  describe('Input validation', () => {
    it('should return early if drawWeekIndexes.monthsIndxs is undefined', () => {
      const invalidDrawWeekIndexes = {} as TDrawWeekIndexes;

      updateMonthWeekIndexes({
        drawWeekIndexes: invalidDrawWeekIndexes,
        currentWeekIndex: 0,
        weekTimePoints: mockWeekTimePoints,
        meta: mockMeta,
        previousWeek: null,
      });

      expect(invalidDrawWeekIndexes.monthsIndxs).toBeUndefined();
    });

    it('should return early if currentWeekIndex is negative', () => {
      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: -1,
        weekTimePoints: mockWeekTimePoints,
        meta: mockMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs).toEqual({});
    });
  });

  describe('First week of life', () => {
    it('should set HalfBorder for first week of life (currentWeekIndex === 0)', () => {
      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 0,
        weekTimePoints: mockWeekTimePoints,
        meta: mockMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![0]).toEqual({
        type: EMonthsEndsIndxsValues.HalfBorder,
        month: '01',
        year: '2024',
      });
    });
  });

  describe('Border week (contains two months)', () => {
    it('should set Border when meta.secondMonth is present', () => {
      const borderMeta = {
        ...mockMeta,
        secondMonth: '02',
      };

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1,
        weekTimePoints: mockWeekTimePoints,
        meta: borderMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.Border,
        month: '01',
        year: '2024',
      });
    });
  });

  describe('Border end week (month ends on Sunday)', () => {
    it('should set BorderEnd when month ends on Sunday', () => {
      // Week ending on January 31st (Sunday) - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2024-01-22'), weekEnd: new Date('2024-01-28') }, // Previous week
        { weekStart: new Date('2024-01-29'), weekEnd: new Date('2024-01-31') }, // Current week ending on Sunday
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.BorderEnd,
        month: '01',
        year: '2024',
      });
    });

    it('should not set BorderEnd when month does not end on Sunday', () => {
      // Week ending on January 30th (Saturday) - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2024-01-22'), weekEnd: new Date('2024-01-28') }, // Previous week
        { weekStart: new Date('2024-01-29'), weekEnd: new Date('2024-01-30') }, // Current week ending on Saturday
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toBeUndefined();
    });
  });

  describe('Month change scenarios', () => {
    it('should handle month change from previous week (border on week half)', () => {
      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2024-01-25',
        dateEnd: '2024-01-31', // January 31st
        type: EWeekType.Past,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        year: '2024',
        secondYear: null,
        lifeYear: 2024,
        secondLifeYear: null,
        lifeMonth: 1,
        isLeapYear: true,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      // Current week starts on February 1st - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2024-01-25'), weekEnd: new Date('2024-01-31') }, // Previous week
        { weekStart: new Date('2024-02-01'), weekEnd: new Date('2024-02-07') }, // Current week
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek,
      });

      // Should set FirstFull5 for February (29 days in leap year)
      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.FirstFull5,
        month: '02',
        year: '2024',
      });
    });

    it('should handle month change from previous week (border on week end)', () => {
      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2024-01-25',
        dateEnd: '2024-01-31', // Previous week spans two months
        type: EWeekType.Past,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        year: '2024',
        secondYear: null,
        lifeYear: 2024,
        secondLifeYear: null,
        lifeMonth: 1,
        isLeapYear: true,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      // Current week starts on February 1st - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2024-01-25'), weekEnd: new Date('2024-01-31') }, // Previous week
        { weekStart: new Date('2024-02-01'), weekEnd: new Date('2024-02-07') }, // Current week
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek,
      });

      // Should set FirstFull5 for February (29 days in leap year) - border on week half takes priority
      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.FirstFull5,
        month: '02',
        year: '2024',
      });
    });

    it('should handle both border conditions simultaneously', () => {
      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2024-01-25',
        dateEnd: '2024-01-31', // Both conditions: spans two months AND ends on month boundary
        type: EWeekType.Past,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        year: '2024',
        secondYear: null,
        lifeYear: 2024,
        secondLifeYear: null,
        lifeMonth: 1,
        isLeapYear: true,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      // Current week starts on February 1st - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2024-01-25'), weekEnd: new Date('2024-01-31') }, // Previous week
        { weekStart: new Date('2024-02-01'), weekEnd: new Date('2024-02-07') }, // Current week
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek,
      });

      // Should prioritize border on week half (FirstFull5)
      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.FirstFull5,
        month: '02',
        year: '2024',
      });
    });
  });

  describe('Different month types', () => {
    it('should return FirstFull4 for 28-day month (February in non-leap year)', () => {
      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2023-01-25',
        dateEnd: '2023-01-31',
        type: EWeekType.Past,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        year: '2023',
        secondYear: null,
        lifeYear: 2023,
        secondLifeYear: null,
        lifeMonth: 1,
        isLeapYear: false,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      // February 2023 (28 days) - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2023-01-25'), weekEnd: new Date('2023-01-31') }, // Previous week
        { weekStart: new Date('2023-02-01'), weekEnd: new Date('2023-02-07') }, // Current week
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.FirstFull4,
        month: '02',
        year: '2023',
      });
    });

    it('should return FirstFull5 for 30-day month', () => {
      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2024-03-25',
        dateEnd: '2024-03-31',
        type: EWeekType.Past,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
        year: '2024',
        secondYear: null,
        lifeYear: 2024,
        secondLifeYear: null,
        lifeMonth: 3,
        isLeapYear: true,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      // April 2024 (30 days) - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2024-03-25'), weekEnd: new Date('2024-03-31') }, // Previous week
        { weekStart: new Date('2024-04-01'), weekEnd: new Date('2024-04-07') }, // Current week
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.FirstFull5,
        month: '04',
        year: '2024',
      });
    });

    it('should return FirstFull5 for 31-day month', () => {
      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2024-01-25',
        dateEnd: '2024-01-31',
        type: EWeekType.Past,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        year: '2024',
        secondYear: null,
        lifeYear: 2024,
        secondLifeYear: null,
        lifeMonth: 1,
        isLeapYear: true,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      // February 2024 (29 days in leap year) - NOT first week
      const weekTimePoints = [
        { weekStart: new Date('2024-01-25'), weekEnd: new Date('2024-01-31') }, // Previous week
        { weekStart: new Date('2024-02-01'), weekEnd: new Date('2024-02-07') }, // Current week
      ];

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1, // NOT first week
        weekTimePoints,
        meta: mockMeta,
        previousWeek,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.FirstFull5,
        month: '02',
        year: '2024',
      });
    });
  });

  describe('No previous week', () => {
    it('should not set any month type when no previous week', () => {
      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1,
        weekTimePoints: mockWeekTimePoints,
        meta: mockMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toBeUndefined();
    });
  });

  describe('No month change', () => {
    it('should not set any month type when no month change from previous week', () => {
      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2024-01-15',
        dateEnd: '2024-01-21', // Same month as current week
        type: EWeekType.Past,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        year: '2024',
        secondYear: null,
        lifeYear: 2024,
        secondLifeYear: null,
        lifeMonth: 1,
        isLeapYear: true,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1,
        weekTimePoints: mockWeekTimePoints,
        meta: mockMeta,
        previousWeek,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![1]).toBeUndefined();
    });
  });

  describe('Media handling', () => {
    it('should include media in month object when present', () => {
      const mediaMeta = {
        ...mockMeta,
        media: 'test-media-url',
      };

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 0,
        weekTimePoints: mockWeekTimePoints,
        meta: mediaMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![0]).toEqual({
        type: EMonthsEndsIndxsValues.HalfBorder,
        month: '01',
        year: '2024',
        media: 'test-media-url',
      });
    });

    it('should not include media when not present', () => {
      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 0,
        weekTimePoints: mockWeekTimePoints,
        meta: mockMeta,
        previousWeek: null,
      });

      expect(mockDrawWeekIndexes.monthsIndxs![0]).toEqual({
        type: EMonthsEndsIndxsValues.HalfBorder,
        month: '01',
        year: '2024',
      });
      expect(mockDrawWeekIndexes.monthsIndxs![0]).not.toHaveProperty('media');
    });
  });

  describe('Priority order', () => {
    it('should prioritize first week over other conditions', () => {
      const borderMeta = {
        ...mockMeta,
        secondMonth: '02',
      };

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 0, // First week
        weekTimePoints: mockWeekTimePoints,
        meta: borderMeta,
        previousWeek: null,
      });

      // Should be HalfBorder, not Border
      expect(mockDrawWeekIndexes.monthsIndxs![0]).toEqual({
        type: EMonthsEndsIndxsValues.HalfBorder,
        month: '01',
        year: '2024',
      });
    });

    it('should prioritize border week over month change conditions', () => {
      const borderMeta = {
        ...mockMeta,
        secondMonth: '02',
      };

      const previousWeek: IWeek = {
        id: 'prev-week',
        dateStart: '2024-01-25',
        dateEnd: '2024-01-31',
        type: EWeekType.Past,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
        year: '2024',
        secondYear: null,
        lifeYear: 2024,
        secondLifeYear: null,
        lifeMonth: 1,
        isLeapYear: true,
        media: null,
        holidays: null,
        yearZodiacLabel: null,
        comments: null,
        description: null,
        days: [],
      };

      updateMonthWeekIndexes({
        drawWeekIndexes: mockDrawWeekIndexes,
        currentWeekIndex: 1,
        weekTimePoints: mockWeekTimePoints,
        meta: borderMeta,
        previousWeek,
      });

      // Should be Border, not month change type
      expect(mockDrawWeekIndexes.monthsIndxs![1]).toEqual({
        type: EMonthsWeekIndxsValues.Border,
        month: '01',
        year: '2024',
      });
    });
  });
});
