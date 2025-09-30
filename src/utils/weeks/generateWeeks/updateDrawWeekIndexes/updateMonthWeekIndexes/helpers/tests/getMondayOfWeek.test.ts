import { describe, it, expect } from 'vitest';

import { getMondayOfWeek } from '../getMondayOfWeek';

describe('getMondayOfWeek', () => {
  it('should return Monday for a Monday date', () => {
    const monday = new Date('2025-07-07'); // Monday
    const result = getMondayOfWeek(monday);
    expect(result).toEqual(monday);
  });

  it('should return Monday for a Tuesday date', () => {
    const tuesday = new Date('2025-07-08'); // Tuesday
    const expectedMonday = new Date('2025-07-07'); // Monday
    const result = getMondayOfWeek(tuesday);
    expect(result).toEqual(expectedMonday);
  });

  it('should return Monday for a Wednesday date', () => {
    const wednesday = new Date('2025-07-09'); // Wednesday
    const expectedMonday = new Date('2025-07-07'); // Monday
    const result = getMondayOfWeek(wednesday);
    expect(result).toEqual(expectedMonday);
  });

  it('should return Monday for a Thursday date', () => {
    const thursday = new Date('2025-07-10'); // Thursday
    const expectedMonday = new Date('2025-07-07'); // Monday
    const result = getMondayOfWeek(thursday);
    expect(result).toEqual(expectedMonday);
  });

  it('should return Monday for a Friday date', () => {
    const friday = new Date('2025-07-11'); // Friday
    const expectedMonday = new Date('2025-07-07'); // Monday
    const result = getMondayOfWeek(friday);
    expect(result).toEqual(expectedMonday);
  });

  it('should return Monday for a Saturday date', () => {
    const saturday = new Date('2025-07-12'); // Saturday
    const expectedMonday = new Date('2025-07-07'); // Monday
    const result = getMondayOfWeek(saturday);
    expect(result).toEqual(expectedMonday);
  });

  it('should return Monday for a Sunday date', () => {
    const sunday = new Date('2025-07-13'); // Sunday
    const expectedMonday = new Date('2025-07-07'); // Monday
    const result = getMondayOfWeek(sunday);
    expect(result).toEqual(expectedMonday);
  });

  it('should handle month boundaries correctly', () => {
    const lastDayOfMonth = new Date('2025-06-30'); // Monday
    const result = getMondayOfWeek(lastDayOfMonth);
    expect(result).toEqual(lastDayOfMonth);
  });

  it('should handle year boundaries correctly', () => {
    const newYear = new Date('2025-01-01'); // Wednesday
    const expectedMonday = new Date('2024-12-30'); // Monday
    const result = getMondayOfWeek(newYear);
    expect(result).toEqual(expectedMonday);
  });

  it('should not mutate the original date', () => {
    const originalDate = new Date('2025-07-15'); // Tuesday
    const originalTime = originalDate.getTime();
    getMondayOfWeek(originalDate);
    expect(originalDate.getTime()).toBe(originalTime);
  });
});
