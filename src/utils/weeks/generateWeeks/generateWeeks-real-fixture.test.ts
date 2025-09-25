import { describe, it, expect, beforeAll } from 'vitest';

import { generateWeeks } from './generateWeeks';
import { realGenerateWeeksFirst10Fixture } from '../../../../fixtures/generateWeeks-first10-fixture';
import { realGenerateWeeksLast10Fixture } from '../../../../fixtures/generateWeeks-last10-fixture';
import { realGenerateWeeksMainFixture } from '../../../../fixtures/generateWeeks-main-fixture';

describe('generateWeeks - Real Fixture Validation Tests', () => {
  let mainResult: ReturnType<typeof generateWeeks>;
  let shortResult: ReturnType<typeof generateWeeks>;

  beforeAll(() => {
    // Generate main result once for all tests
    mainResult = generateWeeks(
      realGenerateWeeksMainFixture.birthDate,
      realGenerateWeeksMainFixture.lifespan,
      realGenerateWeeksMainFixture.deathDate,
    );

    // Generate short result once for first/last 10 weeks tests
    shortResult = generateWeeks('2025-07-07', 2, '2027-08-08');
  });
  describe('Structure validation against real system output', () => {
    it('should generate same structure as real fixture', () => {
      // Validate total weeks count
      expect(mainResult.weeks.length).toBe(realGenerateWeeksMainFixture.totalWeeks);

      // Validate basic structure
      expect(mainResult.weeks).toBeDefined();
      expect(mainResult.today).toBeDefined();
      expect(mainResult.drawWeekIndexes).toBeDefined();
      expect(mainResult.media).toBeDefined();

      // Validate first and last week basic info
      const firstWeek = mainResult.weeks[0];
      const lastWeek = mainResult.weeks[mainResult.weeks.length - 1];

      expect(firstWeek.dateStart).toBe('2025-07-07');
      expect(lastWeek.dateEnd).toBe('2027-08-08');
    });

    it('should have exact today match', () => {
      // Validate exact match of entire today object
      expect(mainResult.today).toEqual(realGenerateWeeksMainFixture.today);
    });

    it('should have exact drawWeekIndexes match', () => {
      // Validate exact match of entire drawWeekIndexes object
      expect(mainResult.drawWeekIndexes).toEqual(realGenerateWeeksMainFixture.drawWeekIndexes);
    });

    it('should have exact media match', () => {
      // Validate exact match of entire media object
      expect(mainResult.media).toEqual(realGenerateWeeksMainFixture.media);
    });
  });

  describe('First 10 weeks validation', () => {
    it('should generate EXACTLY the same first 10 weeks as fixture', () => {
      const first10Weeks = shortResult.weeks.slice(0, 10);

      // Validate exact match of first 10 weeks
      expect(first10Weeks).toEqual(realGenerateWeeksFirst10Fixture);
    });
  });

  describe('Last 10 weeks validation', () => {
    it('should generate EXACTLY the same last 10 weeks as fixture', () => {
      const last10Weeks = shortResult.weeks.slice(-10);

      // Validate exact match of last 10 weeks
      expect(last10Weeks).toEqual(realGenerateWeeksLast10Fixture);
    });
  });

  describe('Performance and consistency tests', () => {
    it('should generate same result multiple times', () => {
      // Generate second result for comparison
      const result2 = generateWeeks(
        realGenerateWeeksMainFixture.birthDate,
        realGenerateWeeksMainFixture.lifespan,
        realGenerateWeeksMainFixture.deathDate,
      );

      // Results should be identical
      expect(mainResult.weeks.length).toBe(result2.weeks.length);
      expect(mainResult.weeks[0].id).toBe(result2.weeks[0].id);
      expect(mainResult.weeks[mainResult.weeks.length - 1].id).toBe(
        result2.weeks[result2.weeks.length - 1].id,
      );
      expect(mainResult.drawWeekIndexes.lastWeekIndex).toBe(result2.drawWeekIndexes.lastWeekIndex);
    });

    it('should handle real world date boundaries correctly', () => {
      // Validate date boundaries
      expect(mainResult.weeks[0].dateStart).toBe('2025-07-07'); // Birth date
      expect(mainResult.weeks[mainResult.weeks.length - 1].dateEnd).toBe('2027-08-08'); // Death date

      // Validate life span calculation
      const birthYear = parseInt(mainResult.weeks[0].year);
      const deathYear = parseInt(mainResult.weeks[mainResult.weeks.length - 1].year);
      expect(deathYear - birthYear).toBeLessThanOrEqual(2); // Should be around 2 years
    });
  });
});
