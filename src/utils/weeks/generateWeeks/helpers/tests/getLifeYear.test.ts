import { describe, it, expect } from 'vitest';

import { getLifeYear } from '../getLifeYear';

describe('getLifeYear', () => {
  describe('Birthday calculations', () => {
    it('should return correct age before birthday in same year', () => {
      const result = getLifeYear(new Date('1990-06-15'), new Date('2024-03-10'));
      expect(result).toBe(34); // 2024 - 1990 = 34, birthday hasn't passed
    });

    it('should return correct age after birthday in same year', () => {
      const result = getLifeYear(new Date('1990-06-15'), new Date('2024-08-20'));
      expect(result).toBe(35); // 2024 - 1990 + 1 = 35, birthday has passed
    });

    it('should return correct age on birthday', () => {
      const result = getLifeYear(new Date('1990-06-15'), new Date('2024-06-15'));
      expect(result).toBe(35); // Birthday has passed (same day counts as passed)
    });
  });

  describe('Same month edge cases', () => {
    it('should return correct age in same month before birthday', () => {
      const result = getLifeYear(new Date('1990-06-15'), new Date('2024-06-10'));
      expect(result).toBe(34); // Same month but before birthday
    });

    it('should return correct age in same month after birthday', () => {
      const result = getLifeYear(new Date('1990-06-15'), new Date('2024-06-20'));
      expect(result).toBe(35); // Same month but after birthday
    });
  });

  describe('Leap year scenarios', () => {
    it('should handle leap year birthday before Feb 29', () => {
      const result = getLifeYear(new Date('1992-02-29'), new Date('2024-02-28'));
      expect(result).toBe(32); // 2024 - 1992 = 32, Feb 29 hasn't occurred in 2024
    });

    it('should handle leap year birthday on Feb 29', () => {
      const result = getLifeYear(new Date('1992-02-29'), new Date('2024-02-29'));
      expect(result).toBe(33); // Birthday has passed
    });
  });

  describe('Year boundary edge cases', () => {
    it('should handle January 1st birthday', () => {
      const result = getLifeYear(new Date('1990-01-01'), new Date('2024-01-01'));
      expect(result).toBe(35); // Birthday has passed
    });

    it('should handle December 31st birthday before birthday', () => {
      const result = getLifeYear(new Date('1990-12-31'), new Date('2024-12-30'));
      expect(result).toBe(34); // Birthday hasn't passed yet
    });
  });
});
