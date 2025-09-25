import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TDay } from '@/types';

import { generateDay } from '../../../generateDay';
import { generateWeekDays } from '../generateWeekDays';

// Mock generateDay function
vi.mock('../../../generateDay', () => ({
  generateDay: vi.fn(),
}));

const mockGenerateDay = vi.mocked(generateDay);

describe('generateWeekDays', () => {
  const mockBirthDate = new Date(1990, 5, 15); // June 15, 1990
  const weekIndex = 5;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('standard week generation', () => {
    it('should generate 7 days for a full week', () => {
      const weekStart = new Date(2024, 2, 4); // March 4, 2024 (Monday)
      const weekEnd = new Date(2024, 2, 10); // March 10, 2024 (Sunday)

      // Mock generateDay to return predictable results
      mockGenerateDay.mockImplementation(
        ({ date }) =>
          ({
            id: `day-${date.getDate()}`,
            date: date.toISOString().split('T')[0],
            // ... other day properties would be here
          }) as TDay,
      );

      const result = generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      expect(result).toHaveLength(7);
      expect(mockGenerateDay).toHaveBeenCalledTimes(7);
    });

    it('should call generateDay with correct parameters for each day', () => {
      const weekStart = new Date(2024, 2, 4); // March 4, 2024 (Monday)
      const weekEnd = new Date(2024, 2, 10); // March 10, 2024 (Sunday)

      mockGenerateDay.mockReturnValue({} as TDay);

      generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      // Check first day call
      expect(mockGenerateDay).toHaveBeenNthCalledWith(1, {
        date: new Date(2024, 2, 4), // March 4
        weekStart,
        weekIndex,
        birthDate: mockBirthDate,
      });

      // Check last day call
      expect(mockGenerateDay).toHaveBeenNthCalledWith(7, {
        date: new Date(2024, 2, 10), // March 10
        weekStart,
        weekIndex,
        birthDate: mockBirthDate,
      });

      // Check middle day call
      expect(mockGenerateDay).toHaveBeenNthCalledWith(4, {
        date: new Date(2024, 2, 7), // March 7
        weekStart,
        weekIndex,
        birthDate: mockBirthDate,
      });
    });

    it('should preserve order of days in the result', () => {
      const weekStart = new Date(2024, 2, 4); // March 4, 2024
      const weekEnd = new Date(2024, 2, 10); // March 10, 2024

      mockGenerateDay.mockImplementation(
        ({ date }) =>
          ({
            id: `day-${date.getDate()}`,
            date: date.toISOString().split('T')[0],
          }) as TDay,
      );

      const result = generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      expect(result[0].id).toBe('day-4'); // March 4
      expect(result[1].id).toBe('day-5'); // March 5
      expect(result[2].id).toBe('day-6'); // March 6
      expect(result[3].id).toBe('day-7'); // March 7
      expect(result[4].id).toBe('day-8'); // March 8
      expect(result[5].id).toBe('day-9'); // March 9
      expect(result[6].id).toBe('day-10'); // March 10
    });
  });

  describe('edge cases', () => {
    it('should handle single day week', () => {
      const singleDay = new Date(2024, 2, 15); // March 15, 2024

      mockGenerateDay.mockReturnValue({
        id: 'single-day',
        date: '2024-03-15',
      } as TDay);

      const result = generateWeekDays(singleDay, singleDay, weekIndex, mockBirthDate);

      expect(result).toHaveLength(1);
      expect(mockGenerateDay).toHaveBeenCalledTimes(1);
      expect(mockGenerateDay).toHaveBeenCalledWith({
        date: singleDay,
        weekStart: singleDay,
        weekIndex,
        birthDate: mockBirthDate,
      });
    });

    it('should handle month boundary week', () => {
      const weekStart = new Date(2024, 1, 26); // February 26, 2024
      const weekEnd = new Date(2024, 2, 3); // March 3, 2024

      mockGenerateDay.mockImplementation(
        ({ date }) =>
          ({
            id: `day-${date.getMonth()}-${date.getDate()}`,
            date: date.toISOString().split('T')[0],
          }) as TDay,
      );

      const result = generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      expect(result).toHaveLength(7);
      expect(result[0].id).toBe('day-1-26'); // February 26
      expect(result[1].id).toBe('day-1-27'); // February 27
      expect(result[2].id).toBe('day-1-28'); // February 28
      expect(result[3].id).toBe('day-1-29'); // February 29 (2024 is leap year)
      expect(result[4].id).toBe('day-2-1'); // March 1
      expect(result[5].id).toBe('day-2-2'); // March 2
      expect(result[6].id).toBe('day-2-3'); // March 3
    });

    it('should handle year boundary week', () => {
      const weekStart = new Date(2023, 11, 25); // December 25, 2023
      const weekEnd = new Date(2024, 0, 7); // January 7, 2024

      mockGenerateDay.mockImplementation(
        ({ date }) =>
          ({
            id: `day-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            date: date.toISOString().split('T')[0],
          }) as TDay,
      );

      const result = generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      expect(result).toHaveLength(14); // 14 days spanning year boundary
      expect(result[0].id).toBe('day-2023-11-25'); // December 25, 2023
      expect(result[7].id).toBe('day-2024-0-1'); // January 1, 2024
      expect(result[13].id).toBe('day-2024-0-7'); // January 7, 2024
    });

    it('should handle leap year February 29', () => {
      const weekStart = new Date(2024, 1, 26); // February 26, 2024 (leap year)
      const weekEnd = new Date(2024, 2, 3); // March 3, 2024

      mockGenerateDay.mockReturnValue({} as TDay);

      generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      // Should include February 29
      expect(mockGenerateDay).toHaveBeenCalledWith({
        date: new Date(2024, 1, 29), // February 29, 2024
        weekStart,
        weekIndex,
        birthDate: mockBirthDate,
      });
    });
  });

  describe('parameter passing', () => {
    it('should pass consistent weekStart and weekIndex to all generateDay calls', () => {
      const weekStart = new Date(2024, 2, 4);
      const weekEnd = new Date(2024, 2, 6); // 3 days

      mockGenerateDay.mockReturnValue({} as TDay);

      generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      // Check that weekStart and weekIndex are consistent across all calls
      for (let i = 1; i <= 3; i++) {
        expect(mockGenerateDay).toHaveBeenNthCalledWith(i, {
          date: expect.any(Date),
          weekStart, // Same weekStart
          weekIndex, // Same weekIndex
          birthDate: mockBirthDate, // Same birthDate
        });
      }
    });

    it('should not mutate input parameters', () => {
      const originalWeekStart = new Date(2024, 2, 4);
      const originalWeekEnd = new Date(2024, 2, 6);
      const weekStartCopy = new Date(originalWeekStart);
      const weekEndCopy = new Date(originalWeekEnd);

      mockGenerateDay.mockReturnValue({} as TDay);

      generateWeekDays(originalWeekStart, originalWeekEnd, weekIndex, mockBirthDate);

      // Parameters should remain unchanged
      expect(originalWeekStart.getTime()).toBe(weekStartCopy.getTime());
      expect(originalWeekEnd.getTime()).toBe(weekEndCopy.getTime());
    });
  });

  describe('return value', () => {
    it('should return empty array for invalid date range', () => {
      const weekStart = new Date(2024, 2, 10); // March 10
      const weekEnd = new Date(2024, 2, 4); // March 4 (end before start)

      const result = generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      expect(result).toEqual([]);
      expect(mockGenerateDay).not.toHaveBeenCalled();
    });

    it('should return array with results from generateDay', () => {
      const weekStart = new Date(2024, 2, 4);
      const weekEnd = new Date(2024, 2, 5); // 2 days

      const mockDays = [
        { id: 'day-1', date: '2024-03-04' } as TDay,
        { id: 'day-2', date: '2024-03-05' } as TDay,
      ];

      mockGenerateDay.mockReturnValueOnce(mockDays[0]).mockReturnValueOnce(mockDays[1]);

      const result = generateWeekDays(weekStart, weekEnd, weekIndex, mockBirthDate);

      expect(result).toEqual(mockDays);
    });
  });
});
