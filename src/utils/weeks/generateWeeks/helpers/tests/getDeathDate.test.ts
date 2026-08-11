import { describe, it, expect } from 'vitest';

import { getDeathDate } from '../getDeathDate';

describe('getDeathDate', () => {
  describe('Valid custom death date', () => {
    it('should return custom death date when valid', () => {
      const result = getDeathDate({
        birthDate: new Date('1990-01-01'),
        deathDateISO: '2050-12-31',
        lifeSpanYears: 80,
      });

      expect(result.getFullYear()).toBe(2050);
      expect(result.getMonth()).toBe(11); // December (0-indexed)
      expect(result.getDate()).toBe(31);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('Invalid custom death date fallbacks', () => {
    it('should fallback to calculated date when custom death date is before birth', () => {
      const result = getDeathDate({
        birthDate: new Date('1990-01-01'),
        deathDateISO: '1980-01-01',
        lifeSpanYears: 80,
      });

      expect(result.getFullYear()).toBe(2070); // 1990 + 80
      expect(result.getMonth()).toBe(0); // January (0-indexed)
      expect(result.getDate()).toBe(1);
    });

    it('should fallback to calculated date when custom death date is invalid', () => {
      const result = getDeathDate({
        birthDate: new Date('1990-01-01'),
        deathDateISO: 'invalid-date',
        lifeSpanYears: 80,
      });

      expect(result.getFullYear()).toBe(2070); // 1990 + 80
      expect(result.getMonth()).toBe(0); // January (0-indexed)
      expect(result.getDate()).toBe(1);
    });
  });

  describe('No custom death date', () => {
    it('should calculate death date from birth date and lifespan when no custom date provided', () => {
      const result = getDeathDate({
        birthDate: new Date('1990-01-01'),
        deathDateISO: undefined,
        lifeSpanYears: 75,
      });

      expect(result.getFullYear()).toBe(2065); // 1990 + 75
      expect(result.getMonth()).toBe(0); // January (0-indexed)
      expect(result.getDate()).toBe(1);
    });

    it('should calculate death date when custom death date is empty string', () => {
      const result = getDeathDate({
        birthDate: new Date('2000-06-15'),
        deathDateISO: '',
        lifeSpanYears: 100,
      });

      expect(result.getFullYear()).toBe(2100); // 2000 + 100
      expect(result.getMonth()).toBe(5); // June (0-indexed)
      expect(result.getDate()).toBe(15);
    });
  });

  describe('Date precision', () => {
    it('should return date at start of day (00:00:00)', () => {
      const result = getDeathDate({
        birthDate: new Date('1990-01-01'),
        deathDateISO: '2050-12-31',
        lifeSpanYears: 80,
      });

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });
});
