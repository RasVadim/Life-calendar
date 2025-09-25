import { describe, it, expect } from 'vitest';

import { getZodiac } from '../getZodiac';

describe('getZodiac', () => {
  it('should return correct zodiac for current years', () => {
    expect(getZodiac(2020)).toBe('rat');
    expect(getZodiac(2021)).toBe('ox');
    expect(getZodiac(2022)).toBe('tiger');
    expect(getZodiac(2023)).toBe('rabbit');
    expect(getZodiac(2024)).toBe('dragon');
    expect(getZodiac(2025)).toBe('snake');
    expect(getZodiac(2026)).toBe('horse');
    expect(getZodiac(2027)).toBe('goat');
    expect(getZodiac(2028)).toBe('monkey');
    expect(getZodiac(2029)).toBe('rooster');
    expect(getZodiac(2030)).toBe('dog');
    expect(getZodiac(2031)).toBe('pig');
  });

  it('should follow 12-year cycle', () => {
    expect(getZodiac(2020)).toBe('rat');
    expect(getZodiac(2032)).toBe('rat'); // 12 years later
    expect(getZodiac(2044)).toBe('rat'); // Another cycle
  });

  it('should handle realistic birth years', () => {
    expect(getZodiac(1900)).toBe('rat'); // Oldest realistic birth year
    expect(getZodiac(1950)).toBe('tiger'); // Mid 20th century
    expect(getZodiac(1990)).toBe('horse'); // 90s
    expect(getZodiac(2000)).toBe('dragon'); // Turn of millennium
  });
});
