import { describe, it, expect } from 'vitest';

import { ESeason } from '@/types/life';

import { getSeason } from '../getSeason';

describe('getSeason', () => {
  describe('Winter months', () => {
    it('should return Winter for December', () => {
      expect(getSeason(11)).toBe(ESeason.Winter); // December (0-indexed)
    });

    it('should return Winter for January', () => {
      expect(getSeason(0)).toBe(ESeason.Winter); // January (0-indexed)
    });

    it('should return Winter for February', () => {
      expect(getSeason(1)).toBe(ESeason.Winter); // February (0-indexed)
    });
  });

  describe('Spring months', () => {
    it('should return Spring for March', () => {
      expect(getSeason(2)).toBe(ESeason.Spring); // March (0-indexed)
    });

    it('should return Spring for April', () => {
      expect(getSeason(3)).toBe(ESeason.Spring); // April (0-indexed)
    });

    it('should return Spring for May', () => {
      expect(getSeason(4)).toBe(ESeason.Spring); // May (0-indexed)
    });
  });

  describe('Summer months', () => {
    it('should return Summer for June', () => {
      expect(getSeason(5)).toBe(ESeason.Summer); // June (0-indexed)
    });

    it('should return Summer for July', () => {
      expect(getSeason(6)).toBe(ESeason.Summer); // July (0-indexed)
    });

    it('should return Summer for August', () => {
      expect(getSeason(7)).toBe(ESeason.Summer); // August (0-indexed)
    });
  });

  describe('Autumn months', () => {
    it('should return Autumn for September', () => {
      expect(getSeason(8)).toBe(ESeason.Autumn); // September (0-indexed)
    });

    it('should return Autumn for October', () => {
      expect(getSeason(9)).toBe(ESeason.Autumn); // October (0-indexed)
    });

    it('should return Autumn for November', () => {
      expect(getSeason(10)).toBe(ESeason.Autumn); // November (0-indexed)
    });
  });
});
