import { describe, it, expect } from 'vitest';

import { getWeekOfCalendar } from '../getWeekOfCalendar';

describe('getWeekOfCalendar', () => {
  it('should return 0 for the same Monday', () => {
    const monday = new Date('2025-07-07'); // Monday
    const result = getWeekOfCalendar(monday, monday);
    expect(result).toBe(0);
  });

  it('should return 1 for Monday one week later', () => {
    const firstMonday = new Date('2025-07-07'); // Monday
    const secondMonday = new Date('2025-07-14'); // Monday (one week later)
    const result = getWeekOfCalendar(secondMonday, firstMonday);
    expect(result).toBe(1);
  });

  it('should return 2 for Monday two weeks later', () => {
    const firstMonday = new Date('2025-07-07'); // Monday
    const thirdMonday = new Date('2025-07-21'); // Monday (two weeks later)
    const result = getWeekOfCalendar(thirdMonday, firstMonday);
    expect(result).toBe(2);
  });

  it('should return 0 for Monday one week earlier', () => {
    const firstMonday = new Date('2025-07-07'); // Monday
    const previousMonday = new Date('2025-06-30'); // Monday (one week earlier)
    const result = getWeekOfCalendar(previousMonday, firstMonday);
    expect(result).toBe(-1);
  });

  it('should handle month boundaries correctly', () => {
    const lastMondayOfJune = new Date('2025-06-30'); // Monday
    const firstMondayOfJuly = new Date('2025-07-07'); // Monday
    const result = getWeekOfCalendar(firstMondayOfJuly, lastMondayOfJune);
    expect(result).toBe(1);
  });

  it('should handle year boundaries correctly', () => {
    const lastMondayOfYear = new Date('2024-12-30'); // Monday
    const firstMondayOfNewYear = new Date('2025-01-06'); // Monday
    const result = getWeekOfCalendar(firstMondayOfNewYear, lastMondayOfYear);
    expect(result).toBe(1);
  });

  it('should work with different times of day', () => {
    const firstMonday = new Date('2025-07-07T00:00:00'); // Monday midnight
    const secondMonday = new Date('2025-07-14T23:59:59'); // Monday end of day
    const result = getWeekOfCalendar(secondMonday, firstMonday);
    expect(result).toBe(1);
  });

  it('should handle leap year correctly', () => {
    const firstMonday = new Date('2024-02-26'); // Monday in leap year
    const secondMonday = new Date('2024-03-04'); // Monday one week later
    const result = getWeekOfCalendar(secondMonday, firstMonday);
    expect(result).toBe(1);
  });

  it('should return correct week for partial week difference', () => {
    const firstMonday = new Date('2025-07-07'); // Monday
    const friday = new Date('2025-07-11'); // Friday (4 days later)
    const result = getWeekOfCalendar(friday, firstMonday);
    expect(result).toBe(0); // Same week
  });

  it('should handle negative week differences', () => {
    const firstMonday = new Date('2025-07-07'); // Monday
    const previousFriday = new Date('2025-07-04'); // Friday (3 days earlier)
    const result = getWeekOfCalendar(previousFriday, firstMonday);
    expect(result).toBe(-1); // Previous week
  });
});
