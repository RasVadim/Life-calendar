import { describe, it, expect, beforeEach } from 'vitest';

import { IWeek } from '@/store/clientDB';
import { ESeason, TMedia, TMediaDatesMap, EWeekType } from '@/types';

import { setDefaultPreviewFlags } from '../setDefaultPreviewFlags';

// Helper function to create a test week
const createTestWeek = (
  month: string,
  season: ESeason,
  secondMonth?: string | null,
  secondSeason?: ESeason | null,
): IWeek => ({
  id: 'test-week',
  dateStart: '2024-01-01',
  dateEnd: '2024-01-07',
  type: EWeekType.Present,
  lifeMonth: 1,
  lifeYear: 0,
  secondLifeYear: null,
  year: '2024',
  secondYear: null,
  month,
  secondMonth: secondMonth || null,
  season,
  secondSeason: secondSeason || null,
  isLeapYear: false,
  days: [],
  holidays: [],
  yearZodiacLabel: 'dragon',
  comments: null,
  description: null,
  media: null,
});

describe('setDefaultPreviewFlags', () => {
  let media: TMediaDatesMap<TMedia>;
  let weekStart: Date;

  beforeEach(() => {
    media = {};
    weekStart = new Date(2024, 2, 4); // March 4, 2024 (Monday)
  });

  describe('first week of life', () => {
    it('should set both month and season preview when previousWeek is null', () => {
      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek: null,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        isMonthPreview: true,
        isSeasonPreview: true,
      });
    });

    it('should return date key for first week regardless of Monday start', () => {
      const weekStartTuesday = new Date(2024, 2, 5); // Tuesday

      const result = setDefaultPreviewFlags({
        weekStart: weekStartTuesday,
        previousWeek: null,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: false,
        media,
      });

      expect(result).toBe('20240305');
      expect(media['20240305']).toEqual({
        isMonthPreview: true,
        isSeasonPreview: true,
      });
    });
  });

  describe('month preview', () => {
    it('should set month preview when previous week has secondMonth', () => {
      const previousWeek = createTestWeek('02', ESeason.Winter, '03');

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        isMonthPreview: true,
      });
    });

    it('should set month preview when month changes and week starts on Monday', () => {
      const previousWeek = createTestWeek('02', ESeason.Winter);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        isMonthPreview: true,
      });
    });

    it('should NOT set month preview when month changes but week does not start on Monday', () => {
      const previousWeek = createTestWeek('02', ESeason.Winter);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: false,
        media,
      });

      expect(result).toBeNull();
      expect(Object.keys(media)).toHaveLength(0);
    });

    it('should NOT set month preview when month is same as previous', () => {
      const previousWeek = createTestWeek('03', ESeason.Spring);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBeNull();
      expect(Object.keys(media)).toHaveLength(0);
    });
  });

  describe('season preview', () => {
    it('should set season preview when previous week has secondSeason', () => {
      const previousWeek = createTestWeek('03', ESeason.Winter, null, ESeason.Spring);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        isSeasonPreview: true,
      });
    });

    it('should set season preview when season changes and week starts on Monday', () => {
      const previousWeek = createTestWeek('03', ESeason.Winter);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        isSeasonPreview: true,
      });
    });

    it('should NOT set season preview when season changes but week does not start on Monday', () => {
      const previousWeek = createTestWeek('03', ESeason.Winter);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: false,
        media,
      });

      expect(result).toBeNull();
      expect(Object.keys(media)).toHaveLength(0);
    });

    it('should NOT set season preview when season is same as previous', () => {
      const previousWeek = createTestWeek('03', ESeason.Spring);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBeNull();
      expect(Object.keys(media)).toHaveLength(0);
    });
  });

  describe('priority handling', () => {
    it('should prioritize month preview over season preview', () => {
      const previousWeek = createTestWeek('02', ESeason.Winter);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        isMonthPreview: true,
      });
      // Should NOT have isSeasonPreview even though season also changed
    });

    it('should handle both secondMonth and secondSeason (month wins)', () => {
      const previousWeek = createTestWeek('02', ESeason.Winter, '03', ESeason.Spring);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        isMonthPreview: true,
      });
    });
  });

  describe('flag merging', () => {
    it('should merge with existing media flags', () => {
      // Pre-populate media with some other flag
      media['20240304'] = { customFlag: true } as TMedia;

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek: null, // First week to trigger both flags
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20240304');
      expect(media['20240304']).toEqual({
        customFlag: true,
        isMonthPreview: true,
        isSeasonPreview: true,
      });
    });
  });

  describe('edge cases', () => {
    it('should return null when no preview conditions are met', () => {
      const previousWeek = createTestWeek('03', ESeason.Spring);

      const result = setDefaultPreviewFlags({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBeNull();
      expect(Object.keys(media)).toHaveLength(0);
    });

    it('should handle different date formats correctly', () => {
      const differentDate = new Date(2023, 11, 25); // December 25, 2023

      const result = setDefaultPreviewFlags({
        weekStart: differentDate,
        previousWeek: null,
        currentMonth: '12',
        currentSeason: ESeason.Winter,
        isWeekStartMonday: true,
        media,
      });

      expect(result).toBe('20231225');
      expect(media['20231225']).toEqual({
        isMonthPreview: true,
        isSeasonPreview: true,
      });
    });
  });
});
