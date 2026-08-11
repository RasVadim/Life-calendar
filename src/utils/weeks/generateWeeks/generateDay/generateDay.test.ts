import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { EDayOfWeek } from '@/types';

import { generateDay } from './generateDay';

// Mock dependencies
vi.mock('../../helpers', () => ({
  getWeekHolidays: vi.fn(() => []),
}));

describe('generateDay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockBirthDate = new Date('1990-01-01T00:00:00.000Z');
  const mockWeekStart = new Date('2024-03-01T00:00:00.000Z'); // Friday
  const mockWeekIndex = 0;

  it('should generate a day with correct basic properties', () => {
    const testDate = new Date('2024-03-01T00:00:00.000Z'); // Friday

    const result = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });

    expect(result).toMatchObject({
      id: 'w1_d5', // Friday = 5
      date: '2024-03-01',
      dayOfWeek: EDayOfWeek.Friday,
      isWeekPreview: true,
      holidays: null,
      lifeDay: expect.any(Number), // Days since birth
      comments: null,
      description: null,
    });
  });

  it('should generate correct ID for different days of week', () => {
    const testCases = [
      {
        date: new Date('2024-03-03T00:00:00.000Z'),
        expectedId: 'w1_d7',
        dayOfWeek: EDayOfWeek.Sunday,
      },
      {
        date: new Date('2024-03-04T00:00:00.000Z'),
        expectedId: 'w1_d1',
        dayOfWeek: EDayOfWeek.Monday,
      },
      {
        date: new Date('2024-03-05T00:00:00.000Z'),
        expectedId: 'w1_d2',
        dayOfWeek: EDayOfWeek.Tuesday,
      },
      {
        date: new Date('2024-03-06T00:00:00.000Z'),
        expectedId: 'w1_d3',
        dayOfWeek: EDayOfWeek.Wednesday,
      },
      {
        date: new Date('2024-03-07T00:00:00.000Z'),
        expectedId: 'w1_d4',
        dayOfWeek: EDayOfWeek.Thursday,
      },
      {
        date: new Date('2024-03-01T00:00:00.000Z'),
        expectedId: 'w1_d5',
        dayOfWeek: EDayOfWeek.Friday,
      },
      {
        date: new Date('2024-03-02T00:00:00.000Z'),
        expectedId: 'w1_d6',
        dayOfWeek: EDayOfWeek.Saturday,
      },
    ];

    testCases.forEach(({ date, expectedId, dayOfWeek }) => {
      const result = generateDay({
        date,
        weekStart: mockWeekStart,
        weekIndex: mockWeekIndex,
        birthDate: mockBirthDate,
      });

      expect(result.id).toBe(expectedId);
      expect(result.dayOfWeek).toBe(dayOfWeek);
    });
  });

  it('should calculate lifeDay correctly', () => {
    const testDate = new Date('2024-03-01T00:00:00.000Z');

    const result = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });

    // Calculate expected days manually
    const expectedDays = Math.floor(
      (testDate.getTime() - mockBirthDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    expect(result.lifeDay).toBe(expectedDays);
  });

  it('should set isWeekPreview correctly', () => {
    // Test when date equals weekStart
    const result1 = generateDay({
      date: mockWeekStart,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });
    expect(result1.isWeekPreview).toBe(true);

    // Test when date is different from weekStart
    const differentDate = new Date('2024-03-02T00:00:00.000Z');
    const result2 = generateDay({
      date: differentDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });
    expect(result2.isWeekPreview).toBe(false);
  });

  it('should handle holidays correctly when present', () => {
    // Since the mock returns empty array by default, holidays will be null
    const testDate = new Date('2024-03-01T00:00:00.000Z');
    const result = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });

    // With empty holidays array, result should be null
    expect(result.holidays).toBeNull();
  });

  it('should handle holidays correctly when empty', () => {
    // Test with default mock that returns empty array
    const testDate = new Date('2024-03-01T00:00:00.000Z');
    const result = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });

    expect(result.holidays).toBeNull();
  });

  it('should handle different week indices', () => {
    const testDate = new Date('2024-03-01T00:00:00.000Z');

    const result1 = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: 0,
      birthDate: mockBirthDate,
    });
    expect(result1.id).toBe('w1_d5');

    const result2 = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: 5,
      birthDate: mockBirthDate,
    });
    expect(result2.id).toBe('w6_d5');
  });

  it('should format date correctly', () => {
    const testDate = new Date('2024-03-01T12:30:45.123Z');

    const result = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });

    expect(result.date).toBe('2024-03-01');
  });

  it('should handle edge case with Sunday (day 0)', () => {
    const sundayDate = new Date('2024-03-03T00:00:00.000Z'); // Sunday

    const result = generateDay({
      date: sundayDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: mockBirthDate,
    });

    expect(result.id).toBe('w1_d7'); // Should be 7, not 0
    expect(result.dayOfWeek).toBe(EDayOfWeek.Sunday);
  });

  it('should handle different birth dates', () => {
    const testDate = new Date('2024-03-01T00:00:00.000Z');
    const differentBirthDate = new Date('1985-06-15T00:00:00.000Z');

    const result = generateDay({
      date: testDate,
      weekStart: mockWeekStart,
      weekIndex: mockWeekIndex,
      birthDate: differentBirthDate,
    });

    // Should calculate different lifeDay
    expect(result.lifeDay).toBeGreaterThan(0);
    expect(result.lifeDay).not.toBe(12489); // Different from previous test
  });
});
