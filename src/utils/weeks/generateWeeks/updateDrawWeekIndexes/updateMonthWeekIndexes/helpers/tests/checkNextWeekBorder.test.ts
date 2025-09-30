import { describe, it, expect } from 'vitest';

import { checkNextWeekBorder } from '../checkNextWeekBorder';

describe('checkNextWeekBorder', () => {
  it('should return true for border week (starts in birth month, ends in different month)', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-29'), weekEnd: new Date('2025-07-30') }, // Current week
      { weekStart: new Date('2025-07-31'), weekEnd: new Date('2025-08-06') }, // Next week (border)
    ];
    const currentWeekIndex = 0;
    const birthMonth = 6; // July (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(true);
  });

  it('should return false for normal week (starts and ends in same month)', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-07'), weekEnd: new Date('2025-07-13') }, // Current week
      { weekStart: new Date('2025-07-14'), weekEnd: new Date('2025-07-20') }, // Next week (normal)
    ];
    const currentWeekIndex = 0;
    const birthMonth = 6; // July (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false);
  });

  it('should return false when next week starts in different month', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-28'), weekEnd: new Date('2025-08-03') }, // Current week
      { weekStart: new Date('2025-08-04'), weekEnd: new Date('2025-08-10') }, // Next week (starts in August)
    ];
    const currentWeekIndex = 0;
    const birthMonth = 6; // July (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false);
  });

  it('should return false when there is no next week', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-07'), weekEnd: new Date('2025-07-13') }, // Only one week
    ];
    const currentWeekIndex = 0;
    const birthMonth = 6; // July (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false);
  });

  it('should return false when currentWeekIndex is out of bounds', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-07'), weekEnd: new Date('2025-07-13') },
      { weekStart: new Date('2025-07-14'), weekEnd: new Date('2025-07-20') },
    ];
    const currentWeekIndex = 1; // Last week, no next week
    const birthMonth = 6; // July (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false);
  });

  it('should handle border week at month end correctly', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-28'), weekEnd: new Date('2025-08-03') }, // Current week
      { weekStart: new Date('2025-08-04'), weekEnd: new Date('2025-08-10') }, // Next week (starts in August)
    ];
    const currentWeekIndex = 0;
    const birthMonth = 7; // August (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false); // Next week starts in August, so not a border week for August
  });

  it('should handle border week at year boundary', () => {
    const weekTimePoints = [
      { weekStart: new Date('2024-12-30'), weekEnd: new Date('2025-01-05') }, // Current week
      { weekStart: new Date('2025-01-06'), weekEnd: new Date('2025-01-12') }, // Next week (starts in January)
    ];
    const currentWeekIndex = 0;
    const birthMonth = 0; // January (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false); // Next week starts in January, so not a border week for January
  });

  it('should handle multiple border weeks in sequence', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-29'), weekEnd: new Date('2025-07-30') }, // Week 1
      { weekStart: new Date('2025-07-31'), weekEnd: new Date('2025-08-06') }, // Week 2 (border)
      { weekStart: new Date('2025-08-07'), weekEnd: new Date('2025-08-13') }, // Week 3
    ];
    const currentWeekIndex = 1; // Check week 2
    const birthMonth = 6; // July (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false); // Week 2 starts in July but ends in August, so it's a border week for July
  });

  it('should handle edge case with same start and end month', () => {
    const weekTimePoints = [
      { weekStart: new Date('2025-07-01'), weekEnd: new Date('2025-07-07') }, // Current week
      { weekStart: new Date('2025-07-08'), weekEnd: new Date('2025-07-14') }, // Next week
    ];
    const currentWeekIndex = 0;
    const birthMonth = 6; // July (0-indexed)

    const result = checkNextWeekBorder(weekTimePoints, currentWeekIndex, birthMonth);
    expect(result).toBe(false); // Both start and end in July
  });
});
