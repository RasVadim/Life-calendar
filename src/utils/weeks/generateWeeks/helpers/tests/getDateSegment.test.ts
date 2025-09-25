import { describe, it, expect } from 'vitest';

import { EDateSegment } from '@/types';

import { getDateSegment } from '../getDateSegment';

describe('getDateSegment', () => {
  describe('Year extraction', () => {
    it('should extract year as string', () => {
      const result = getDateSegment(new Date('2024-03-15'), EDateSegment.Year);
      expect(result).toBe('2024');
    });
  });

  describe('Month extraction', () => {
    it('should extract single digit month with leading zero', () => {
      const result = getDateSegment(new Date('2024-03-15'), EDateSegment.Month);
      expect(result).toBe('03');
    });

    it('should extract double digit month', () => {
      const result = getDateSegment(new Date('2024-12-15'), EDateSegment.Month);
      expect(result).toBe('12');
    });
  });

  describe('Season extraction', () => {
    it('should return winter for January', () => {
      const result = getDateSegment(new Date('2024-01-15'), EDateSegment.Season);
      expect(result).toBe('winter');
    });

    it('should return spring for April', () => {
      const result = getDateSegment(new Date('2024-04-15'), EDateSegment.Season);
      expect(result).toBe('spring');
    });

    it('should return summer for July', () => {
      const result = getDateSegment(new Date('2024-07-15'), EDateSegment.Season);
      expect(result).toBe('summer');
    });

    it('should return autumn for October', () => {
      const result = getDateSegment(new Date('2024-10-15'), EDateSegment.Season);
      expect(result).toBe('autumn');
    });
  });

  describe('Invalid input', () => {
    it('should return null for invalid type', () => {
      const result = getDateSegment(new Date('2024-03-15'), 'invalid' as EDateSegment);
      expect(result).toBe(null);
    });
  });
});
