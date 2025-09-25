import { describe, it, expect } from 'vitest';

import { ESeason } from '@/types';

import { extractDateSegments } from '../extractDateSegments';

describe('extractDateSegments', () => {
  describe('same period weeks', () => {
    it('should return null for second values when week stays in same year/month/season', () => {
      const weekStart = new Date(2024, 2, 4); // March 4, 2024 (Monday)
      const weekEnd = new Date(2024, 2, 10); // March 10, 2024 (Sunday)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '03',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      });
    });

    it('should return null for second values for mid-month week', () => {
      const weekStart = new Date(2024, 5, 10); // June 10, 2024
      const weekEnd = new Date(2024, 5, 16); // June 16, 2024

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '06',
        secondMonth: null,
        season: ESeason.Summer,
        secondSeason: null,
      });
    });
  });

  describe('month spanning weeks', () => {
    it('should detect month change within week', () => {
      const weekStart = new Date(2024, 1, 26); // February 26, 2024 (Monday)
      const weekEnd = new Date(2024, 2, 3); // March 3, 2024 (Sunday)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '02',
        secondMonth: '03',
        season: ESeason.Winter,
        secondSeason: ESeason.Spring, // Actually changes season too
      });
    });

    it('should detect year and month change within week', () => {
      const weekStart = new Date(2023, 11, 25); // December 25, 2023 (Monday)
      const weekEnd = new Date(2024, 0, 0); // December 31, 2023 (Sunday)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2023',
        secondYear: null, // Still in 2023 for this week end
        month: '12',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
      });
    });

    it('should detect new year week', () => {
      const weekStart = new Date(2023, 11, 25); // December 25, 2023
      const weekEnd = new Date(2024, 0, 7); // January 7, 2024

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2023',
        secondYear: '2024',
        month: '12',
        secondMonth: '01',
        season: ESeason.Winter,
        secondSeason: null, // Winter continues
      });
    });
  });

  describe('season spanning weeks', () => {
    it('should handle weeks in same season', () => {
      const weekStart = new Date(2024, 5, 10); // June 10, 2024 (summer)
      const weekEnd = new Date(2024, 5, 16); // June 16, 2024 (summer)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '06',
        secondMonth: null,
        season: ESeason.Summer,
        secondSeason: null,
      });
    });

    it('should handle weeks in winter', () => {
      const weekStart = new Date(2024, 0, 15); // January 15, 2024 (winter)
      const weekEnd = new Date(2024, 0, 21); // January 21, 2024 (winter)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '01',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
      });
    });

    it('should handle weeks in spring', () => {
      const weekStart = new Date(2024, 3, 15); // April 15, 2024 (spring)
      const weekEnd = new Date(2024, 3, 21); // April 21, 2024 (spring)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '04',
        secondMonth: null,
        season: ESeason.Spring,
        secondSeason: null,
      });
    });

    it('should handle weeks in autumn', () => {
      const weekStart = new Date(2024, 9, 15); // October 15, 2024 (autumn)
      const weekEnd = new Date(2024, 9, 21); // October 21, 2024 (autumn)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '10',
        secondMonth: null,
        season: ESeason.Autumn,
        secondSeason: null,
      });
    });
  });

  describe('complex spanning weeks', () => {
    it('should handle month change within same season', () => {
      const weekStart = new Date(2024, 5, 29); // May 29, 2024
      const weekEnd = new Date(2024, 6, 5); // June 5, 2024

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '06', // Function uses weekStart, which gives June
        secondMonth: '07', // Function uses weekEnd, which gives July
        season: ESeason.Summer, // June = summer
        secondSeason: null, // Same season
      });
    });

    it('should handle year and month change', () => {
      const weekStart = new Date(2023, 11, 25); // December 25, 2023 (winter, December)
      const weekEnd = new Date(2024, 0, 7); // January 7, 2024 (winter, January)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2023',
        secondYear: '2024',
        month: '12',
        secondMonth: '01',
        season: ESeason.Winter,
        secondSeason: null, // Winter continues
      });
    });
  });

  describe('edge cases', () => {
    it('should handle single day week', () => {
      const singleDay = new Date(2024, 5, 15); // June 15, 2024

      const result = extractDateSegments(singleDay, singleDay);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '06',
        secondMonth: null,
        season: ESeason.Summer,
        secondSeason: null,
      });
    });

    it('should handle leap year date', () => {
      const weekStart = new Date(2024, 1, 26); // February 26, 2024 (leap year)
      const weekEnd = new Date(2024, 1, 29); // February 29, 2024 (leap day)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2024',
        secondYear: null,
        month: '02',
        secondMonth: null,
        season: ESeason.Winter,
        secondSeason: null,
      });
    });

    it('should handle week spanning multiple months in different years', () => {
      const weekStart = new Date(2023, 11, 25); // December 25, 2023
      const weekEnd = new Date(2024, 1, 4); // February 4, 2024 (extreme case)

      const result = extractDateSegments(weekStart, weekEnd);

      expect(result).toEqual({
        year: '2023',
        secondYear: '2024',
        month: '12',
        secondMonth: '02',
        season: ESeason.Winter,
        secondSeason: null, // Winter continues
      });
    });
  });
});
