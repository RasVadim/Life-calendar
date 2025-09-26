import { describe, it, expect } from 'vitest';

import {
  formatWithLeadingZeros,
  formatWeekNumber,
  formatMonthNumber,
} from '../formatWithLeadingZeros';

describe('formatWithLeadingZeros', () => {
  it('should format single digit with leading zeros', () => {
    expect(formatWithLeadingZeros(1, 3)).toBe('001');
    expect(formatWithLeadingZeros(5, 4)).toBe('0005');
    expect(formatWithLeadingZeros(0, 2)).toBe('00');
  });

  it('should format multi-digit numbers correctly', () => {
    expect(formatWithLeadingZeros(123, 3)).toBe('123');
    expect(formatWithLeadingZeros(1234, 4)).toBe('1234');
    expect(formatWithLeadingZeros(12345, 6)).toBe('012345');
  });

  it('should handle zero length', () => {
    expect(formatWithLeadingZeros(5, 0)).toBe('5');
  });

  it('should handle negative numbers', () => {
    expect(formatWithLeadingZeros(-5, 3)).toBe('0-5');
    expect(formatWithLeadingZeros(-123, 4)).toBe('-123');
  });

  it('should handle edge cases', () => {
    expect(formatWithLeadingZeros(0, 0)).toBe('0');
    expect(formatWithLeadingZeros(999, 2)).toBe('999'); // Longer than target length
  });
});

describe('formatWeekNumber', () => {
  it('should format week numbers with 4 digits', () => {
    expect(formatWeekNumber(0)).toBe('0001');
    expect(formatWeekNumber(1)).toBe('0002');
    expect(formatWeekNumber(9)).toBe('0010');
    expect(formatWeekNumber(99)).toBe('0100');
    expect(formatWeekNumber(999)).toBe('1000');
  });

  it('should handle large week numbers', () => {
    expect(formatWeekNumber(1234)).toBe('1235');
    expect(formatWeekNumber(9999)).toBe('10000');
  });

  it('should handle zero week index', () => {
    expect(formatWeekNumber(0)).toBe('0001');
  });
});

describe('formatMonthNumber', () => {
  it('should format month numbers with 2 digits', () => {
    expect(formatMonthNumber(0)).toBe('01'); // January
    expect(formatMonthNumber(1)).toBe('02'); // February
    expect(formatMonthNumber(9)).toBe('10'); // October
    expect(formatMonthNumber(11)).toBe('12'); // December
  });

  it('should handle all valid month indices', () => {
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const expected = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    months.forEach((month, index) => {
      expect(formatMonthNumber(month)).toBe(expected[index]);
    });
  });

  it('should handle edge cases', () => {
    expect(formatMonthNumber(0)).toBe('01');
    expect(formatMonthNumber(11)).toBe('12');
  });
});
