import { describe, it, expect } from 'vitest';

import {
  compareDatesWithoutYear,
  isDateBefore,
  isDateAfter,
  isDateEqual,
} from '../compareDatesWithoutYear';

describe('compareDatesWithoutYear', () => {
  it('should return -1 when first date is before second date', () => {
    const date1 = new Date(2024, 2, 15); // March 15
    const date2 = new Date(2024, 3, 10); // April 10

    expect(compareDatesWithoutYear(date1, date2)).toBe(-1);
  });

  it('should return 1 when first date is after second date', () => {
    const date1 = new Date(2024, 3, 15); // April 15
    const date2 = new Date(2024, 2, 10); // March 10

    expect(compareDatesWithoutYear(date1, date2)).toBe(1);
  });

  it('should return 0 when dates are equal (ignoring year)', () => {
    const date1 = new Date(2024, 2, 15); // March 15, 2024
    const date2 = new Date(2023, 2, 15); // March 15, 2023

    expect(compareDatesWithoutYear(date1, date2)).toBe(0);
  });

  it('should compare by month first, then by day', () => {
    const date1 = new Date(2024, 1, 20); // February 20
    const date2 = new Date(2024, 2, 10); // March 10

    expect(compareDatesWithoutYear(date1, date2)).toBe(-1);
  });

  it('should compare by day when months are equal', () => {
    const date1 = new Date(2024, 2, 5); // March 5
    const date2 = new Date(2024, 2, 15); // March 15

    expect(compareDatesWithoutYear(date1, date2)).toBe(-1);
  });

  it('should handle different years correctly', () => {
    const date1 = new Date(2020, 2, 15); // March 15, 2020
    const date2 = new Date(2025, 2, 15); // March 15, 2025

    expect(compareDatesWithoutYear(date1, date2)).toBe(0);
  });
});

describe('isDateBefore', () => {
  it('should return true when first date is before second date', () => {
    const date1 = new Date(2024, 2, 15); // March 15
    const date2 = new Date(2024, 3, 10); // April 10

    expect(isDateBefore(date1, date2)).toBe(true);
  });

  it('should return false when first date is after second date', () => {
    const date1 = new Date(2024, 3, 15); // April 15
    const date2 = new Date(2024, 2, 10); // March 10

    expect(isDateBefore(date1, date2)).toBe(false);
  });

  it('should return false when dates are equal', () => {
    const date1 = new Date(2024, 2, 15); // March 15, 2024
    const date2 = new Date(2023, 2, 15); // March 15, 2023

    expect(isDateBefore(date1, date2)).toBe(false);
  });

  it('should handle edge cases', () => {
    const date1 = new Date(2024, 0, 1); // January 1
    const date2 = new Date(2024, 11, 31); // December 31

    expect(isDateBefore(date1, date2)).toBe(true);
  });
});

describe('isDateAfter', () => {
  it('should return true when first date is after second date', () => {
    const date1 = new Date(2024, 3, 15); // April 15
    const date2 = new Date(2024, 2, 10); // March 10

    expect(isDateAfter(date1, date2)).toBe(true);
  });

  it('should return false when first date is before second date', () => {
    const date1 = new Date(2024, 2, 15); // March 15
    const date2 = new Date(2024, 3, 10); // April 10

    expect(isDateAfter(date1, date2)).toBe(false);
  });

  it('should return false when dates are equal', () => {
    const date1 = new Date(2024, 2, 15); // March 15, 2024
    const date2 = new Date(2023, 2, 15); // March 15, 2023

    expect(isDateAfter(date1, date2)).toBe(false);
  });
});

describe('isDateEqual', () => {
  it('should return true when dates are equal (ignoring year)', () => {
    const date1 = new Date(2024, 2, 15); // March 15, 2024
    const date2 = new Date(2023, 2, 15); // March 15, 2023

    expect(isDateEqual(date1, date2)).toBe(true);
  });

  it('should return false when dates are different', () => {
    const date1 = new Date(2024, 2, 15); // March 15
    const date2 = new Date(2024, 2, 16); // March 16

    expect(isDateEqual(date1, date2)).toBe(false);
  });

  it('should return false when months are different', () => {
    const date1 = new Date(2024, 2, 15); // March 15
    const date2 = new Date(2024, 3, 15); // April 15

    expect(isDateEqual(date1, date2)).toBe(false);
  });

  it('should handle same year correctly', () => {
    const date1 = new Date(2024, 2, 15); // March 15, 2024
    const date2 = new Date(2024, 2, 15); // March 15, 2024

    expect(isDateEqual(date1, date2)).toBe(true);
  });
});
