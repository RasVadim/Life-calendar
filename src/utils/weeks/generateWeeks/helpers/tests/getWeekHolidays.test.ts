import { describe, it, expect } from 'vitest';

import { HOLIDAY_NAMES } from '@/constants';

import { getWeekHolidays } from '../getWeekHolidays';

// Helper function to create date
const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day); // month is 1-indexed in function, 0-indexed in Date
};

describe('getWeekHolidays', () => {
  describe('weeks without holidays', () => {
    it('should return empty array for week without any holidays', () => {
      const result = getWeekHolidays(
        createDate(2024, 4, 10), // April 10
        createDate(2024, 4, 16), // April 16
        createDate(1990, 5, 10), // Birth: May 10, 1990
      );
      expect(result).toEqual([]);
    });

    it('should return empty array for week spanning months without holidays', () => {
      const result = getWeekHolidays(
        createDate(2024, 4, 29), // Apr 29
        createDate(2024, 5, 5), // May 5
        createDate(1990, 6, 15), // Birth: Jun 15
      );
      expect(result).toEqual([]);
    });
  });

  describe('birthday weeks', () => {
    it('should detect birthday in the middle of week', () => {
      const result = getWeekHolidays(
        createDate(2024, 5, 8), // May 8
        createDate(2024, 5, 14), // May 14
        createDate(1990, 5, 10), // Birth: May 10
      );
      expect(result).toEqual([HOLIDAY_NAMES.birthday]);
    });

    it('should detect birthday at start of week', () => {
      const result = getWeekHolidays(
        createDate(2021, 5, 10), // May 10 (Monday)
        createDate(2021, 5, 16), // May 16
        createDate(1990, 5, 10), // Birth: May 10
      );
      expect(result).toEqual([HOLIDAY_NAMES.birthday]);
    });

    it('should detect birthday at end of week', () => {
      const result = getWeekHolidays(
        createDate(2020, 5, 4), // May 4
        createDate(2020, 5, 10), // May 10 (Sunday)
        createDate(1990, 5, 10), // Birth: May 10
      );
      expect(result).toEqual([HOLIDAY_NAMES.birthday]);
    });

    it('should detect leap year birthday', () => {
      const result = getWeekHolidays(
        createDate(2024, 2, 26), // Feb 26
        createDate(2024, 3, 5), // Mar 5
        createDate(1992, 2, 29), // Birth: Feb 29, 1992 (leap year)
      );
      expect(result).toEqual([HOLIDAY_NAMES.birthday]);
    });
  });

  describe('New Year weeks', () => {
    it('should detect New Year in the middle of week', () => {
      const result = getWeekHolidays(
        createDate(2020, 12, 30), // Dec 30
        createDate(2021, 1, 5), // Jan 5
        createDate(1990, 5, 10), // Birth: May 10
      );
      expect(result).toEqual([HOLIDAY_NAMES.newYear]);
    });

    it('should detect New Year at start of week', () => {
      const result = getWeekHolidays(
        createDate(2024, 1, 1), // Jan 1 (Monday)
        createDate(2024, 1, 7), // Jan 7
        createDate(1990, 5, 10), // Birth: May 10
      );
      expect(result).toEqual([HOLIDAY_NAMES.newYear]);
    });
  });

  describe('Feb 23 weeks', () => {
    it('should detect Feb 23 in the middle of week', () => {
      const result = getWeekHolidays(
        createDate(2024, 2, 19), // Feb 19
        createDate(2024, 2, 25), // Feb 25
        createDate(1990, 5, 10), // Birth: May 10
      );
      expect(result).toEqual([HOLIDAY_NAMES.Feb23]);
    });
  });

  describe('Mar 8 weeks', () => {
    it('should detect Mar 8 in the middle of week', () => {
      const result = getWeekHolidays(
        createDate(2024, 3, 4), // Mar 4
        createDate(2024, 3, 10), // Mar 10
        createDate(1990, 5, 10), // Birth: May 10
      );
      expect(result).toEqual([HOLIDAY_NAMES.Mar8]);
    });
  });

  describe('birthday priority', () => {
    it('should prioritize birthday over New Year when both in same week', () => {
      const result = getWeekHolidays(
        createDate(2020, 12, 30), // Dec 30
        createDate(2021, 1, 5), // Jan 5
        createDate(1990, 1, 3), // Birth: Jan 3
      );
      expect(result).toEqual([HOLIDAY_NAMES.birthday, HOLIDAY_NAMES.newYear]);
    });

    it('should prioritize birthday over Feb 23 when both on same day', () => {
      const result = getWeekHolidays(
        createDate(2024, 2, 21), // Feb 21
        createDate(2024, 2, 27), // Feb 27
        createDate(1990, 2, 23), // Birth: Feb 23
      );
      expect(result).toEqual([HOLIDAY_NAMES.birthday, HOLIDAY_NAMES.Feb23]);
    });

    it('should prioritize birthday over Mar 8 when both on same day', () => {
      const result = getWeekHolidays(
        createDate(2024, 3, 4), // Mar 4
        createDate(2024, 3, 10), // Mar 10
        createDate(1990, 3, 8), // Birth: Mar 8
      );
      expect(result).toEqual([HOLIDAY_NAMES.birthday, HOLIDAY_NAMES.Mar8]);
    });
  });
});
