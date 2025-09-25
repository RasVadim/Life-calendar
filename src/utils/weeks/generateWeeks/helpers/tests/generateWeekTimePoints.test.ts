import { describe, it, expect } from 'vitest';

import { generateWeekTimePoints } from '../generateWeekTimePoints';

describe('generateWeekTimePoints', () => {
  describe('Different start days', () => {
    it('should generate weeks starting from Monday', () => {
      const result = generateWeekTimePoints(
        new Date('2024-01-01'), // Monday
        new Date('2024-01-15'), // Monday + 2 weeks
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].weekStart).toEqual(new Date('2024-01-01'));

      // Check that last week doesn't exceed death date
      const lastWeek = result[result.length - 1];
      expect(lastWeek.weekEnd.getTime()).toBeLessThanOrEqual(new Date('2024-01-15').getTime());
    });

    it('should generate weeks starting from Wednesday', () => {
      const result = generateWeekTimePoints(
        new Date('2024-01-03'), // Wednesday
        new Date('2024-01-17'), // Wednesday + 2 weeks
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].weekStart).toEqual(new Date('2024-01-03'));

      // Check that last week doesn't exceed death date
      const lastWeek = result[result.length - 1];
      expect(lastWeek.weekEnd.getTime()).toBeLessThanOrEqual(new Date('2024-01-17').getTime());
    });

    it('should generate weeks starting from Sunday', () => {
      const result = generateWeekTimePoints(
        new Date('2024-01-07'), // Sunday
        new Date('2024-01-21'), // Sunday + 2 weeks
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].weekStart).toEqual(new Date('2024-01-07'));

      // Check that last week doesn't exceed death date
      const lastWeek = result[result.length - 1];
      expect(lastWeek.weekEnd.getTime()).toBeLessThanOrEqual(new Date('2024-01-21').getTime());
    });

    it('should generate weeks starting from Saturday', () => {
      const result = generateWeekTimePoints(
        new Date('2024-01-06'), // Saturday
        new Date('2024-01-20'), // Saturday + 2 weeks
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].weekStart).toEqual(new Date('2024-01-06'));

      // Check that last week doesn't exceed death date
      const lastWeek = result[result.length - 1];
      expect(lastWeek.weekEnd.getTime()).toBeLessThanOrEqual(new Date('2024-01-20').getTime());
    });
  });

  describe('Edge cases', () => {
    it('should handle period less than a week', () => {
      const result = generateWeekTimePoints(
        new Date('2024-01-01'), // Monday
        new Date('2024-01-05'), // Friday (less than a week)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].weekStart).toEqual(new Date('2024-01-01'));
      expect(result[0].weekEnd).toEqual(new Date('2024-01-05'));
    });

    it('should handle exact week boundary', () => {
      const result = generateWeekTimePoints(
        new Date('2024-01-01'), // Monday
        new Date('2024-01-08'), // Monday (exactly 1 week)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].weekStart).toEqual(new Date('2024-01-01'));

      // Check that last week doesn't exceed death date
      const lastWeek = result[result.length - 1];
      expect(lastWeek.weekEnd.getTime()).toBeLessThanOrEqual(new Date('2024-01-08').getTime());
    });
  });

  describe('Week continuity', () => {
    it('should generate consecutive weeks without gaps', () => {
      const result = generateWeekTimePoints(new Date('2024-01-01'), new Date('2024-01-22'));

      expect(result.length).toBeGreaterThan(1);

      // Check that weeks are consecutive
      for (let i = 1; i < result.length; i++) {
        const prevEnd = result[i - 1].weekEnd;
        const currentStart = result[i].weekStart;
        const expectedStart = new Date(prevEnd);
        expectedStart.setDate(expectedStart.getDate() + 1);

        expect(currentStart.getTime()).toBe(expectedStart.getTime());
      }
    });
  });

  describe('Validation', () => {
    it('should never generate weeks that exceed death date', () => {
      const deathDate = new Date('2024-01-15');
      const result = generateWeekTimePoints(new Date('2024-01-01'), deathDate);

      result.forEach((week) => {
        expect(week.weekEnd.getTime()).toBeLessThanOrEqual(deathDate.getTime());
      });
    });

    it('should generate at least one week for valid date range', () => {
      const result = generateWeekTimePoints(new Date('2024-01-01'), new Date('2024-01-03'));

      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });
});
