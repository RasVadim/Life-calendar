import { describe, it, expect, beforeAll } from 'vitest';

import { DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { EWeekType, ESeason, EDayOfWeek } from '@/types';

import { generateWeeks } from './generateWeeks';

describe('generateWeeks - Integration Tests', () => {
  let defaultResult: ReturnType<typeof generateWeeks>;
  let customLifespanResult: ReturnType<typeof generateWeeks>;
  let shortLifespanResult: ReturnType<typeof generateWeeks>;
  let longLifespanResult: ReturnType<typeof generateWeeks>;
  let customDeathDateResult: ReturnType<typeof generateWeeks>;

  beforeAll(() => {
    // Generate all test results once
    defaultResult = generateWeeks('1990-03-07');
    customLifespanResult = generateWeeks('1990-03-07', 80);
    shortLifespanResult = generateWeeks('1990-03-07', 1);
    longLifespanResult = generateWeeks('1990-03-07', 150);
    customDeathDateResult = generateWeeks('1990-03-07', 100, '2025-12-31');
  });
  describe('Basic functionality', () => {
    it('should generate weeks for a person born in 1990', () => {
      expect(defaultResult.weeks).toBeDefined();
      expect(defaultResult.weeks.length).toBeGreaterThan(0);
      expect(defaultResult.today).toBeDefined();
      expect(defaultResult.drawWeekIndexes).toBeDefined();
      expect(defaultResult.media).toBeDefined();
    });

    it('should generate correct number of weeks for default lifespan', () => {
      // System generates slightly more weeks due to leap years and partial weeks
      const expectedWeeks = DEFAULT_LIFE_SPAN_YEARS * 52;
      const actualWeeks = defaultResult.weeks.length;

      expect(actualWeeks).toBeGreaterThanOrEqual(expectedWeeks);
      expect(actualWeeks).toBeLessThanOrEqual(expectedWeeks + 20); // Allow some variance
    });

    it('should generate correct number of weeks for custom lifespan', () => {
      const customLifespan = 80;
      // System generates slightly more weeks due to leap years and partial weeks
      const expectedWeeks = customLifespan * 52;
      const actualWeeks = customLifespanResult.weeks.length;

      expect(actualWeeks).toBeGreaterThanOrEqual(expectedWeeks);
      expect(actualWeeks).toBeLessThanOrEqual(expectedWeeks + 20); // Allow some variance
    });

    it('should generate weeks with correct structure', () => {
      const firstWeek = defaultResult.weeks[0];

      expect(firstWeek).toHaveProperty('id');
      expect(firstWeek).toHaveProperty('dateStart');
      expect(firstWeek).toHaveProperty('dateEnd');
      expect(firstWeek).toHaveProperty('type');
      expect(firstWeek).toHaveProperty('month');
      expect(firstWeek).toHaveProperty('season');
      expect(firstWeek).toHaveProperty('year');
      expect(firstWeek).toHaveProperty('lifeYear');
      expect(firstWeek).toHaveProperty('lifeMonth');
      expect(firstWeek).toHaveProperty('isLeapYear');
      expect(firstWeek).toHaveProperty('days');
    });
  });

  describe('Date calculations', () => {
    it('should start from birth date', () => {
      const firstWeek = defaultResult.weeks[0];
      expect(firstWeek.dateStart).toBe('1990-03-07');
    });

    it('should end on death date for custom lifespan', () => {
      const lifespan = 30;
      const result = generateWeeks('1990-03-07', lifespan);
      const lastWeek = result.weeks[result.weeks.length - 1];

      // System ends on the birthday of the death year (30 years later)
      expect(lastWeek.dateEnd).toBe('2020-03-07');
    });

    it('should end on provided death date', () => {
      const lastWeek = customDeathDateResult.weeks[customDeathDateResult.weeks.length - 1];
      expect(lastWeek.dateEnd).toBe('2025-12-31');
    });

    it('should have consecutive weeks', () => {
      for (let i = 1; i < defaultResult.weeks.length; i++) {
        const prevWeek = new Date(defaultResult.weeks[i - 1].dateEnd);
        const currentWeek = new Date(defaultResult.weeks[i].dateStart);

        // Next week should start the day after previous week ends
        prevWeek.setDate(prevWeek.getDate() + 1);
        // Allow for timezone differences (1 hour = 3600000 ms)
        const timeDiff = Math.abs(currentWeek.getTime() - prevWeek.getTime());
        expect(timeDiff).toBeLessThanOrEqual(3600000);
      }
    });
  });

  describe('Week types', () => {
    it('should have Past weeks before today', () => {
      const pastWeeks = defaultResult.weeks.filter((week) => week.type === EWeekType.Past);
      expect(pastWeeks.length).toBeGreaterThan(0);
    });

    it('should have Future weeks after today', () => {
      const futureWeeks = defaultResult.weeks.filter((week) => week.type === EWeekType.Future);
      expect(futureWeeks.length).toBeGreaterThan(0);
    });

    it('should have exactly one Present week', () => {
      const presentWeeks = defaultResult.weeks.filter((week) => week.type === EWeekType.Present);
      expect(presentWeeks.length).toBe(1);
    });
  });

  describe('Life year calculations', () => {
    it('should start with lifeYear 1', () => {
      const firstWeek = defaultResult.weeks[0];
      expect(firstWeek.lifeYear).toBe(1);
    });

    it('should increment lifeYear correctly', () => {
      // Find weeks where lifeYear changes
      const lifeYearChanges = [];
      for (let i = 1; i < defaultResult.weeks.length; i++) {
        if (defaultResult.weeks[i].lifeYear !== defaultResult.weeks[i - 1].lifeYear) {
          lifeYearChanges.push({
            weekIndex: i,
            newLifeYear: defaultResult.weeks[i].lifeYear,
            prevLifeYear: defaultResult.weeks[i - 1].lifeYear,
          });
        }
      }

      expect(lifeYearChanges.length).toBeGreaterThan(0);

      // Each change should increment by 1
      lifeYearChanges.forEach((change) => {
        expect(change.newLifeYear).toBe(change.prevLifeYear + 1);
      });
    });
  });

  describe('Season calculations', () => {
    it('should have valid seasons', () => {
      defaultResult.weeks.forEach((week) => {
        expect(Object.values(ESeason)).toContain(week.season);
      });
    });

    it('should have secondSeason when week spans two seasons', () => {
      const weeksWithSecondSeason = defaultResult.weeks.filter(
        (week) => week.secondSeason !== null,
      );
      expect(weeksWithSecondSeason.length).toBeGreaterThan(0);
    });
  });

  describe('Month calculations', () => {
    it('should have valid month numbers', () => {
      defaultResult.weeks.forEach((week) => {
        const monthNum = parseInt(week.month);
        expect(monthNum).toBeGreaterThanOrEqual(1);
        expect(monthNum).toBeLessThanOrEqual(12);
      });
    });

    it('should have secondMonth when week spans two months', () => {
      const weeksWithSecondMonth = defaultResult.weeks.filter((week) => week.secondMonth !== null);
      expect(weeksWithSecondMonth.length).toBeGreaterThan(0);
    });
  });

  describe('Leap year handling', () => {
    it('should correctly identify leap years', () => {
      // Find a leap year (1992, 1996, 2000, etc.)
      const leapYearWeek = defaultResult.weeks.find(
        (week) =>
          parseInt(week.year) === 1992 ||
          parseInt(week.year) === 1996 ||
          parseInt(week.year) === 2000,
      );

      expect(leapYearWeek).toBeDefined();
      expect(leapYearWeek!.isLeapYear).toBe(true);
    });

    it('should correctly identify non-leap years', () => {
      // Find a non-leap year (1991, 1993, etc.)
      const nonLeapYearWeek = defaultResult.weeks.find(
        (week) => parseInt(week.year) === 1991 || parseInt(week.year) === 1993,
      );

      expect(nonLeapYearWeek).toBeDefined();
      expect(nonLeapYearWeek!.isLeapYear).toBe(false);
    });
  });

  describe('Days structure', () => {
    it('should have 7 days in each week (except first and last)', () => {
      // First and last weeks might have fewer days
      for (let i = 1; i < defaultResult.weeks.length - 1; i++) {
        expect(defaultResult.weeks[i].days).toHaveLength(7);
      }

      // First week should have at least 1 day
      expect(defaultResult.weeks[0].days.length).toBeGreaterThanOrEqual(1);
      expect(defaultResult.weeks[0].days.length).toBeLessThanOrEqual(7);

      // Last week should have at least 1 day
      const lastWeekIndex = defaultResult.weeks.length - 1;
      expect(defaultResult.weeks[lastWeekIndex].days.length).toBeGreaterThanOrEqual(1);
      expect(defaultResult.weeks[lastWeekIndex].days.length).toBeLessThanOrEqual(7);
    });

    it('should have valid day of week values', () => {
      defaultResult.weeks.forEach((week) => {
        week.days.forEach((day) => {
          expect(Object.values(EDayOfWeek)).toContain(day.dayOfWeek);
        });
      });
    });

    it('should have consecutive lifeDay numbers', () => {
      let expectedLifeDay = 0; // System starts from 0

      defaultResult.weeks.forEach((week) => {
        week.days.forEach((day) => {
          expect(day.lifeDay).toBe(expectedLifeDay);
          expectedLifeDay++;
        });
      });

      // Total life days should equal sum of all days
      const totalDays = defaultResult.weeks.reduce((sum, week) => sum + week.days.length, 0);
      expect(expectedLifeDay).toBe(totalDays);
    });
  });

  describe('Draw week indexes', () => {
    it('should have all required index types', () => {
      const indexes = defaultResult.drawWeekIndexes;

      expect(indexes.yearsIndxs).toBeDefined();
      expect(indexes.seasonsIndxs).toBeDefined();
      expect(indexes.monthsIndxs).toBeDefined();
      expect(indexes.holidaysIndxs).toBeDefined();
      expect(indexes.seasonOffset).toBeDefined();
      expect(indexes.monthOffset).toBeDefined();
      expect(indexes.yearRows).toBeDefined();
      expect(indexes.lastWeekIndex).toBeDefined();
    });

    it('should have correct yearRows for lifespan', () => {
      const lifespan = 50;
      const result = generateWeeks('1990-03-07', lifespan);
      expect(result.drawWeekIndexes.yearRows).toBe(lifespan);
    });

    it('should have correct lastWeekIndex', () => {
      const lastIndex = defaultResult.weeks.length - 1;
      expect(defaultResult.drawWeekIndexes.lastWeekIndex).toBe(lastIndex);
    });
  });

  describe('Today information', () => {
    it('should have today week information', () => {
      expect(defaultResult.today.todayWeekId).toBeDefined();
      expect(defaultResult.today.todayWeekIndex).toBeGreaterThanOrEqual(0);
      expect(defaultResult.today.todayDayId).toBeDefined();
      expect(defaultResult.today.todayDayIndex).toBeGreaterThanOrEqual(0);
    });

    it('should have todayWeekIndex within bounds', () => {
      expect(defaultResult.today.todayWeekIndex).toBeLessThan(defaultResult.weeks.length);
    });

    it('should have todayDayIndex within bounds', () => {
      const todayWeek = defaultResult.weeks[defaultResult.today.todayWeekIndex];
      expect(defaultResult.today.todayDayIndex).toBeLessThan(todayWeek.days.length);
    });
  });

  describe('Edge cases', () => {
    it('should handle birth date at year boundary', () => {
      const result = generateWeeks('1990-01-01');
      expect(result.weeks).toBeDefined();
      expect(result.weeks.length).toBeGreaterThan(0);
    });

    it('should handle birth date at leap year', () => {
      const result = generateWeeks('1992-02-29');
      expect(result.weeks).toBeDefined();
      expect(result.weeks.length).toBeGreaterThan(0);
    });

    it('should handle very short lifespan', () => {
      // System generates 53 weeks for 1 year due to leap year handling
      expect(shortLifespanResult.weeks.length).toBe(53);
    });

    it('should handle very long lifespan', () => {
      // System generates slightly more weeks due to leap years
      const expectedWeeks = 150 * 52;
      const actualWeeks = longLifespanResult.weeks.length;

      expect(actualWeeks).toBeGreaterThanOrEqual(expectedWeeks);
      expect(actualWeeks).toBeLessThanOrEqual(expectedWeeks + 50); // Allow for leap years
    });
  });

  describe('Data consistency', () => {
    it('should have consistent week IDs', () => {
      const weekIds = defaultResult.weeks.map((week) => week.id);
      const uniqueIds = new Set(weekIds);
      expect(uniqueIds.size).toBe(weekIds.length);
    });

    it('should have consistent day IDs', () => {
      const dayIds = defaultResult.weeks.flatMap((week) => week.days.map((day) => day.id));
      const uniqueIds = new Set(dayIds);
      expect(uniqueIds.size).toBe(dayIds.length);
    });

    it('should have consistent date formats', () => {
      defaultResult.weeks.forEach((week) => {
        // Check date format (YYYY-MM-DD)
        expect(week.dateStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(week.dateEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
});
