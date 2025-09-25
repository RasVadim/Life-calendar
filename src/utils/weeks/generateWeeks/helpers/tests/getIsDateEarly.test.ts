import { describe, it, expect } from 'vitest';

import { getIsDateEarly } from '../getIsDateEarly';

describe('getIsDateEarly', () => {
  describe('Different months', () => {
    it('should return true when first date has earlier month', () => {
      const result = getIsDateEarly(new Date('2024-03-15'), new Date('2024-07-15'));
      expect(result).toBe(true);
    });

    it('should return false when first date has later month', () => {
      const result = getIsDateEarly(new Date('2024-07-15'), new Date('2024-03-15'));
      expect(result).toBe(false);
    });
  });

  describe('Same month', () => {
    it('should return true when first date has earlier day', () => {
      const result = getIsDateEarly(new Date('2024-03-10'), new Date('2024-03-20'));
      expect(result).toBe(true);
    });

    it('should return false when first date has later day', () => {
      const result = getIsDateEarly(new Date('2024-03-20'), new Date('2024-03-10'));
      expect(result).toBe(false);
    });

    it('should return false when dates are identical', () => {
      const result = getIsDateEarly(new Date('2024-03-15'), new Date('2024-03-15'));
      expect(result).toBe(false);
    });
  });

  describe('Year boundaries', () => {
    it('should return false when comparing different years with same month/day', () => {
      const result = getIsDateEarly(new Date('2023-03-15'), new Date('2024-03-15'));
      expect(result).toBe(false);
    });
  });

  describe('Month boundaries', () => {
    it('should return true for January vs December comparison', () => {
      const result = getIsDateEarly(new Date('2024-01-15'), new Date('2024-12-15'));
      expect(result).toBe(true);
    });

    it('should return false for December vs January comparison', () => {
      const result = getIsDateEarly(new Date('2024-12-15'), new Date('2024-01-15'));
      expect(result).toBe(false);
    });
  });
});
