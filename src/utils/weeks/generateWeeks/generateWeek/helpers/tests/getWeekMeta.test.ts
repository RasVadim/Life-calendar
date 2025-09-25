import { describe, it, expect, vi, beforeEach } from 'vitest';

import { IWeek } from '@/store/clientDB';
import { EDayOfWeek, ESeason, EWeekType, TDay, TMedia, TMediaDatesMap } from '@/types';

import { extractDateSegments } from '../extractDateSegments';
import { generateWeekDays } from '../generateWeekDays';
import { getWeekMeta } from '../getWeekMeta';
import { setDefaultPreviewFlags } from '../setDefaultPreviewFlags';

// Mock helper functions
vi.mock('../generateWeekDays');
vi.mock('../extractDateSegments');
vi.mock('../setDefaultPreviewFlags');

const mockGenerateWeekDays = vi.mocked(generateWeekDays);
const mockExtractDateSegments = vi.mocked(extractDateSegments);
const mockSetDefaultPreviewFlags = vi.mocked(setDefaultPreviewFlags);

// Helper function to create mock week
const createMockWeek = (
  month: string,
  season: ESeason,
  secondMonth?: string | null,
  secondSeason?: ESeason | null,
): IWeek => ({
  id: 'prev-week',
  dateStart: '2024-02-26',
  dateEnd: '2024-03-03',
  type: EWeekType.Past,
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

// Helper function to create mock day
const createMockDay = (date: Date, dayOfWeek: EDayOfWeek): TDay => ({
  id: `day-${date.getDate()}`,
  date: date.toISOString().split('T')[0],
  dayOfWeek,
  isWeekPreview: false,
  holidays: null,
  lifeDay: 1,
  comments: null,
  description: null,
});

describe('getWeekMeta', () => {
  const mockBirthDate = new Date(1990, 5, 15); // June 15, 1990
  const weekIndex = 10;
  let media: TMediaDatesMap<TMedia>;

  beforeEach(() => {
    vi.clearAllMocks();
    media = {};
  });

  describe('basic functionality', () => {
    it('should call all helper functions with correct parameters', () => {
      const weekStart = new Date(2024, 2, 4); // March 4, 2024
      const weekEnd = new Date(2024, 2, 10); // March 10, 2024
      const previousWeek = createMockWeek('02', ESeason.Winter);

      // Mock return values
      const mockDays = [
        createMockDay(weekStart, EDayOfWeek.Monday),
        createMockDay(new Date(2024, 2, 5), EDayOfWeek.Tuesday),
      ];
      const mockDateSegments = {
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      };

      mockGenerateWeekDays.mockReturnValue(mockDays);
      mockExtractDateSegments.mockReturnValue(mockDateSegments);
      mockSetDefaultPreviewFlags.mockReturnValue('20240304');

      getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek,
        media,
      });

      // Verify generateWeekDays call
      expect(mockGenerateWeekDays).toHaveBeenCalledWith(
        weekStart,
        weekEnd,
        weekIndex,
        mockBirthDate,
      );

      // Verify extractDateSegments call
      expect(mockExtractDateSegments).toHaveBeenCalledWith(weekStart, weekEnd);

      // Verify setDefaultPreviewFlags call
      expect(mockSetDefaultPreviewFlags).toHaveBeenCalledWith({
        weekStart,
        previousWeek,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });
    });

    it('should return combined metadata from all helpers', () => {
      const weekStart = new Date(2024, 2, 4);
      const weekEnd = new Date(2024, 2, 10);
      const previousWeek = createMockWeek('02', ESeason.Winter);

      const mockDays = [createMockDay(weekStart, EDayOfWeek.Monday)];
      const mockDateSegments = {
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      };
      const mockMediaKey = '20240304';

      mockGenerateWeekDays.mockReturnValue(mockDays);
      mockExtractDateSegments.mockReturnValue(mockDateSegments);
      mockSetDefaultPreviewFlags.mockReturnValue(mockMediaKey);

      const result = getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek,
        media,
      });

      expect(result).toEqual({
        days: mockDays,
        ...mockDateSegments,
        isLeapYear: true, // 2024 is leap year
        media: mockMediaKey,
      });
    });
  });

  describe('leap year calculation', () => {
    it('should detect leap year correctly', () => {
      const weekStart = new Date(2024, 1, 26); // February 26, 2024 (leap year)
      const weekEnd = new Date(2024, 2, 3); // March 3, 2024

      mockGenerateWeekDays.mockReturnValue([createMockDay(weekStart, EDayOfWeek.Monday)]);
      mockExtractDateSegments.mockReturnValue({
        year: '2024',
        secondYear: null,
        month: '02',
        secondMonth: '03',
        season: ESeason.Winter,
        secondSeason: ESeason.Spring,
      });
      mockSetDefaultPreviewFlags.mockReturnValue(null);

      const result = getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek: null,
        media,
      });

      expect(result.isLeapYear).toBe(true);
    });

    it('should detect non-leap year correctly', () => {
      const weekStart = new Date(2023, 1, 26); // February 26, 2023 (non-leap year)
      const weekEnd = new Date(2023, 2, 4); // March 4, 2023

      mockGenerateWeekDays.mockReturnValue([createMockDay(weekStart, EDayOfWeek.Sunday)]);
      mockExtractDateSegments.mockReturnValue({
        year: '2023',
        secondYear: null,
        month: '02',
        secondMonth: '03',
        season: ESeason.Winter,
        secondSeason: ESeason.Spring,
      });
      mockSetDefaultPreviewFlags.mockReturnValue(null);

      const result = getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek: null,
        media,
      });

      expect(result.isLeapYear).toBe(false);
    });
  });

  describe('Monday detection', () => {
    it('should detect Monday start correctly', () => {
      const weekStart = new Date(2024, 2, 4); // March 4, 2024 (Monday)
      const weekEnd = new Date(2024, 2, 10);

      const mondayDay = createMockDay(weekStart, EDayOfWeek.Monday);
      mockGenerateWeekDays.mockReturnValue([mondayDay]);
      mockExtractDateSegments.mockReturnValue({
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      });
      mockSetDefaultPreviewFlags.mockReturnValue(null);

      getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek: null,
        media,
      });

      expect(mockSetDefaultPreviewFlags).toHaveBeenCalledWith({
        weekStart,
        previousWeek: null,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });
    });

    it('should detect non-Monday start correctly', () => {
      const weekStart = new Date(2024, 2, 5); // March 5, 2024 (Tuesday)
      const weekEnd = new Date(2024, 2, 11);

      const tuesdayDay = createMockDay(weekStart, EDayOfWeek.Tuesday);
      mockGenerateWeekDays.mockReturnValue([tuesdayDay]);
      mockExtractDateSegments.mockReturnValue({
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      });
      mockSetDefaultPreviewFlags.mockReturnValue(null);

      getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek: null,
        media,
      });

      expect(mockSetDefaultPreviewFlags).toHaveBeenCalledWith({
        weekStart,
        previousWeek: null,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: false,
        media,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null previousWeek', () => {
      const weekStart = new Date(2024, 2, 4);
      const weekEnd = new Date(2024, 2, 10);

      mockGenerateWeekDays.mockReturnValue([createMockDay(weekStart, EDayOfWeek.Monday)]);
      mockExtractDateSegments.mockReturnValue({
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      });
      mockSetDefaultPreviewFlags.mockReturnValue('20240304');

      const result = getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek: null,
        media,
      });

      expect(mockSetDefaultPreviewFlags).toHaveBeenCalledWith({
        weekStart,
        previousWeek: null,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media,
      });

      expect(result.media).toBe('20240304');
    });

    it('should handle week spanning multiple months/seasons', () => {
      const weekStart = new Date(2024, 1, 26); // February 26
      const weekEnd = new Date(2024, 2, 3); // March 3
      const previousWeek = createMockWeek('02', ESeason.Winter);

      mockGenerateWeekDays.mockReturnValue([createMockDay(weekStart, EDayOfWeek.Monday)]);
      mockExtractDateSegments.mockReturnValue({
        year: '2024',
        secondYear: null,
        month: '02',
        secondMonth: '03',
        season: ESeason.Winter,
        secondSeason: ESeason.Spring,
      });
      mockSetDefaultPreviewFlags.mockReturnValue('20240226');

      const result = getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek,
        media,
      });

      expect(result).toEqual({
        days: expect.any(Array),
        year: '2024',
        secondYear: null,
        month: '02',
        secondMonth: '03',
        season: ESeason.Winter,
        secondSeason: ESeason.Spring,
        isLeapYear: true,
        media: '20240226',
      });
    });

    it('should handle single day week', () => {
      const weekStart = new Date(2024, 2, 4); // March 4, 2024
      const weekEnd = new Date(2024, 2, 4); // Same day

      const singleDay = createMockDay(weekStart, EDayOfWeek.Monday);
      mockGenerateWeekDays.mockReturnValue([singleDay]);
      mockExtractDateSegments.mockReturnValue({
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      });
      mockSetDefaultPreviewFlags.mockReturnValue(null);

      const result = getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek: null,
        media,
      });

      expect(result.days).toHaveLength(1);
      expect(result.media).toBeNull();
    });
  });

  describe('media mutation', () => {
    it('should pass media object to setDefaultPreviewFlags for mutation', () => {
      const weekStart = new Date(2024, 2, 4);
      const weekEnd = new Date(2024, 2, 10);
      const initialMedia = { '20240301': { isMonthPreview: true } };

      mockGenerateWeekDays.mockReturnValue([createMockDay(weekStart, EDayOfWeek.Monday)]);
      mockExtractDateSegments.mockReturnValue({
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      });
      mockSetDefaultPreviewFlags.mockReturnValue('20240304');

      getWeekMeta({
        weekStart,
        weekEnd,
        weekIndex,
        birthDate: mockBirthDate,
        previousWeek: null,
        media: initialMedia,
      });

      expect(mockSetDefaultPreviewFlags).toHaveBeenCalledWith({
        weekStart,
        previousWeek: null,
        currentMonth: '03',
        currentSeason: ESeason.Spring,
        isWeekStartMonday: true,
        media: initialMedia,
      });
    });
  });
});
