import { describe, it, expect } from 'vitest';

import { EDateSegment, ESeason } from '@/types';

import { getDateSegment, getDateSegments } from '../getDateSegments';

describe('getDateSegment', () => {
  it('should return year as string', () => {
    const date = new Date(2024, 2, 15); // March 15, 2024
    const result = getDateSegment(date, EDateSegment.Year);
    expect(result).toBe('2024');
  });

  it('should return month with leading zero', () => {
    const date = new Date(2024, 2, 15); // March 15, 2024 (month 2 = March)
    const result = getDateSegment(date, EDateSegment.Month);
    expect(result).toBe('03');
  });

  it('should return single digit month with leading zero', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024 (month 0 = January)
    const result = getDateSegment(date, EDateSegment.Month);
    expect(result).toBe('01');
  });

  it('should return season for different months', () => {
    const winterDate = new Date(2024, 0, 15); // January
    const springDate = new Date(2024, 3, 15); // April
    const summerDate = new Date(2024, 7, 15); // August
    const autumnDate = new Date(2024, 10, 15); // November

    expect(getDateSegment(winterDate, EDateSegment.Season)).toBe(ESeason.Winter);
    expect(getDateSegment(springDate, EDateSegment.Season)).toBe(ESeason.Spring);
    expect(getDateSegment(summerDate, EDateSegment.Season)).toBe(ESeason.Summer);
    expect(getDateSegment(autumnDate, EDateSegment.Season)).toBe(ESeason.Autumn);
  });

  it('should return null for unknown segment type', () => {
    const date = new Date(2024, 2, 15);
    const result = getDateSegment(date, 'unknown' as EDateSegment);
    expect(result).toBeNull();
  });
});

describe('getDateSegments', () => {
  it('should return segments for same week', () => {
    const weekStart = new Date(2024, 2, 4); // March 4, 2024
    const weekEnd = new Date(2024, 2, 10); // March 10, 2024

    const result = getDateSegments(weekStart, weekEnd);

    expect(result).toEqual({
      year: '2024',
      secondYear: null,
      month: '03',
      secondMonth: null,
      season: ESeason.Spring,
      secondSeason: null,
    });
  });

  it('should return segments for week spanning two months', () => {
    const weekStart = new Date(2024, 2, 29); // March 29, 2024
    const weekEnd = new Date(2024, 3, 4); // April 4, 2024

    const result = getDateSegments(weekStart, weekEnd);

    expect(result).toEqual({
      year: '2024',
      secondYear: null,
      month: '03',
      secondMonth: '04',
      season: ESeason.Spring,
      secondSeason: null,
    });
  });

  it('should return segments for week spanning two years', () => {
    const weekStart = new Date(2023, 11, 29); // December 29, 2023
    const weekEnd = new Date(2024, 0, 4); // January 4, 2024

    const result = getDateSegments(weekStart, weekEnd);

    expect(result).toEqual({
      year: '2023',
      secondYear: '2024',
      month: '12',
      secondMonth: '01',
      season: ESeason.Winter,
      secondSeason: null,
    });
  });

  it('should return segments for week spanning two seasons', () => {
    const weekStart = new Date(2024, 2, 19); // March 19, 2024 (Spring)
    const weekEnd = new Date(2024, 5, 25); // June 25, 2024 (Summer)

    const result = getDateSegments(weekStart, weekEnd);

    expect(result).toEqual({
      year: '2024',
      secondYear: null,
      month: '03',
      secondMonth: '06',
      season: ESeason.Spring,
      secondSeason: ESeason.Summer,
    });
  });

  it('should handle edge case with December to January transition', () => {
    const weekStart = new Date(2023, 11, 31); // December 31, 2023
    const weekEnd = new Date(2024, 0, 6); // January 6, 2024

    const result = getDateSegments(weekStart, weekEnd);

    expect(result).toEqual({
      year: '2023',
      secondYear: '2024',
      month: '12',
      secondMonth: '01',
      season: ESeason.Winter,
      secondSeason: null,
    });
  });
});
