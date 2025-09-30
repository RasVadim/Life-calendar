import { describe, it, expect } from 'vitest';

import { calculateMonthOffset } from '../calculateMonthOffset';

// Helper function to create mock data for testing
const createMockData = (firstDayDate: string) => {
  const firstWeekDate = new Date(firstDayDate);
  const firstWeekMonth = firstWeekDate.getMonth();
  const firstWeekYear = firstWeekDate.getFullYear();

  // Create mock weekTimePoints with proper border week logic
  // For border week cases, we need to simulate the actual week structure
  let firstWeekEnd, nextWeekStart, nextWeekEnd;

  if (firstDayDate === '2000-07-29' || firstDayDate === '2000-07-30') {
    // Special case for July 29-30, 2000 (border week)
    firstWeekEnd = new Date('2000-07-30'); // Sunday
    nextWeekStart = new Date('2000-07-31'); // Monday
    nextWeekEnd = new Date('2000-08-06'); // Sunday
  } else {
    // Normal case
    firstWeekEnd = new Date(firstWeekDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    nextWeekStart = new Date(firstWeekDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    nextWeekEnd = new Date(firstWeekDate.getTime() + 13 * 24 * 60 * 60 * 1000);
  }

  const weekTimePoints = [
    { weekStart: firstWeekDate, weekEnd: firstWeekEnd },
    { weekStart: nextWeekStart, weekEnd: nextWeekEnd },
  ];

  // Create mock meta
  const meta = {
    month: String(firstWeekMonth + 1).padStart(2, '0'),
    year: String(firstWeekYear),
    secondMonth: null,
  };

  return { weekTimePoints, meta, currentWeekIndex: 0 };
};

describe('calculateMonthOffset', () => {
  describe('Basic functionality', () => {
    it('should return 0 for first day of month', () => {
      const mockData = createMockData('1991-07-01');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(0);
    });

    it('should return 1 for 8th day of month', () => {
      const mockData = createMockData('1991-07-08');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(1);
    });

    it('should return 2 for 15th day of month', () => {
      const mockData = createMockData('1991-07-15');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(2);
    });

    it('should return 3 for 22nd day of month', () => {
      const mockData = createMockData('1991-07-22');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3);
    });

    it('should return 4 for 29th day of month', () => {
      const mockData = createMockData('1991-07-29');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });
  });

  describe('Edge cases', () => {
    it('should handle 30th day of month', () => {
      const mockData = createMockData('1991-07-30');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });

    it('should handle 31st day of month', () => {
      const mockData = createMockData('1991-07-31');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });

    it('should cap at maximum offset of 4', () => {
      const mockData = createMockData('1991-07-31');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });
  });

  describe('Real-world scenarios from July 1991', () => {
    it('should return correct offset for July 1, 1991', () => {
      const mockData = createMockData('1991-07-01');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(0);
    });

    it('should return correct offset for July 7, 1991', () => {
      const mockData = createMockData('1991-07-07');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(0);
    });

    it('should return correct offset for July 8, 1991', () => {
      const mockData = createMockData('1991-07-08');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(1);
    });

    it('should return correct offset for July 14, 1991', () => {
      const mockData = createMockData('1991-07-14');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(1);
    });

    it('should return correct offset for July 15, 1991', () => {
      const mockData = createMockData('1991-07-15');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(2);
    });

    it('should return correct offset for July 21, 1991', () => {
      const mockData = createMockData('1991-07-21');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(2);
    });

    it('should return correct offset for July 22, 1991', () => {
      const mockData = createMockData('1991-07-22');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3);
    });

    it('should return correct offset for July 28, 1991', () => {
      const mockData = createMockData('1991-07-28');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3);
    });

    it('should return correct offset for July 29, 1991', () => {
      const mockData = createMockData('1991-07-29');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });

    it('should return correct offset for July 30, 1991', () => {
      const mockData = createMockData('1991-07-30');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });

    it('should return correct offset for July 31, 1991', () => {
      const mockData = createMockData('1991-07-31');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });
  });

  describe('Real-world scenarios from June 1991 (bug fix verification)', () => {
    it('should return correct offset for June 1, 1991 (Saturday)', () => {
      const mockData = createMockData('1991-06-01');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(0);
    });

    it('should return correct offset for June 7, 1991 (Friday) - bug case', () => {
      const mockData = createMockData('1991-06-07');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(1);
    });

    it('should return correct offset for June 8, 1991 (Saturday)', () => {
      const mockData = createMockData('1991-06-08');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(1);
    });

    it('should return correct offset for June 15, 1991 (Saturday)', () => {
      const mockData = createMockData('1991-06-15');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(2);
    });

    it('should return correct offset for June 22, 1991 (Saturday)', () => {
      const mockData = createMockData('1991-06-22');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3);
    });

    it('should return correct offset for June 29, 1991 (Saturday)', () => {
      const mockData = createMockData('1991-06-29');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });

    it('should return correct offset for June 30, 1991 (Sunday)', () => {
      const mockData = createMockData('1991-06-30');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(4);
    });
  });

  describe('Real-world scenarios from July 2000 (border week logic)', () => {
    it('should return correct offset for July 29, 2000 (Saturday) - border week case', () => {
      const mockData = createMockData('2000-07-29');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3); // 2 weeks in July (first week + border week), so offset = 5 - 2 = 3
    });

    it('should return correct offset for July 30, 2000 (Sunday) - border week case', () => {
      const mockData = createMockData('2000-07-30');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3); // 2 weeks in July (first week + border week), so offset = 5 - 2 = 3
    });

    it('should return correct offset for July 1, 2000 (Saturday)', () => {
      const mockData = createMockData('2000-07-01');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(0); // First week of July calendar
    });

    it('should return correct offset for July 3, 2000 (Monday)', () => {
      const mockData = createMockData('2000-07-03');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(1); // Second week of July calendar
    });

    it('should return correct offset for July 10, 2000 (Monday)', () => {
      const mockData = createMockData('2000-07-10');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(2); // Third week of July calendar
    });

    it('should return correct offset for July 17, 2000 (Monday)', () => {
      const mockData = createMockData('2000-07-17');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3); // Fourth week of July calendar
    });

    it('should return correct offset for July 24, 2000 (Monday)', () => {
      const mockData = createMockData('2000-07-24');
      const result = calculateMonthOffset(mockData);
      expect(result).toBe(3); // 2 weeks in July (first week + border week), so offset = 5 - 2 = 3
    });
  });
});
