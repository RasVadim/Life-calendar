import { describe, it, expect } from 'vitest';

import { validateWeekChange, ValidationResult, ValidationReason } from '../validateWeekChange';

describe('validateWeekChange', () => {
  describe('when week has not changed', () => {
    it('should return shouldUpdate: false with week_not_changed reason', () => {
      const result = validateWeekChange('week-123', 'week-123', 5, 5);

      expect(result).toEqual({
        shouldUpdate: false,
        reason: 'week_not_changed',
      });
    });

    it('should return shouldUpdate: false when both week IDs are undefined', () => {
      const result = validateWeekChange(undefined, undefined as unknown as string, 5, 5);

      expect(result).toEqual({
        shouldUpdate: false,
        reason: 'week_not_changed',
      });
    });

    it('should return shouldUpdate: true when prevTodayWeekId is undefined but nowWeekId is provided', () => {
      const result = validateWeekChange(undefined, 'week-123', 5, 5);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });
  });

  describe('when indices are invalid', () => {
    it('should return shouldUpdate: false with invalid_indices reason when prevIndex is -1', () => {
      const result = validateWeekChange('week-123', 'week-456', -1, 5);

      expect(result).toEqual({
        shouldUpdate: false,
        reason: 'invalid_indices',
      });
    });

    it('should return shouldUpdate: false with invalid_indices reason when nowIndex is -1', () => {
      const result = validateWeekChange('week-123', 'week-456', 5, -1);

      expect(result).toEqual({
        shouldUpdate: false,
        reason: 'invalid_indices',
      });
    });

    it('should return shouldUpdate: false with invalid_indices reason when both indices are -1', () => {
      const result = validateWeekChange('week-123', 'week-456', -1, -1);

      expect(result).toEqual({
        shouldUpdate: false,
        reason: 'invalid_indices',
      });
    });
  });

  describe('when week change is valid', () => {
    it('should return shouldUpdate: true with valid_change reason when week ID changed', () => {
      const result = validateWeekChange('week-123', 'week-456', 5, 6);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });

    it('should return shouldUpdate: true with valid_change reason when moving from undefined to valid week', () => {
      const result = validateWeekChange(undefined, 'week-456', 0, 5);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });

    it('should return shouldUpdate: true with valid_change reason when indices are valid and different', () => {
      const result = validateWeekChange('week-123', 'week-456', 3, 7);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });

    it('should return shouldUpdate: true with valid_change reason when indices are same but week ID different', () => {
      const result = validateWeekChange('week-123', 'week-456', 5, 5);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string week IDs', () => {
      const result = validateWeekChange('', 'week-456', 5, 6);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });

    it('should handle zero indices', () => {
      const result = validateWeekChange('week-123', 'week-456', 0, 0);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });

    it('should handle large indices', () => {
      const result = validateWeekChange('week-123', 'week-456', 1000, 2000);

      expect(result).toEqual({
        shouldUpdate: true,
        reason: 'valid_change',
      });
    });
  });

  describe('type safety', () => {
    it('should return correct ValidationResult type', () => {
      const result: ValidationResult = validateWeekChange('week-123', 'week-456', 5, 6);

      expect(typeof result.shouldUpdate).toBe('boolean');
      expect(typeof result.reason).toBe('string');
      expect(['week_not_changed', 'invalid_indices', 'valid_change']).toContain(result.reason);
    });

    it('should return correct ValidationReason type', () => {
      const result = validateWeekChange('week-123', 'week-456', 5, 6);
      const reason: ValidationReason = result.reason;

      expect(['week_not_changed', 'invalid_indices', 'valid_change']).toContain(reason);
    });
  });

  describe('validation logic priority', () => {
    it('should prioritize week_not_changed over invalid_indices when both conditions are true', () => {
      // Same week ID but invalid indices - should return week_not_changed
      const result = validateWeekChange('week-123', 'week-123', -1, -1);

      expect(result).toEqual({
        shouldUpdate: false,
        reason: 'week_not_changed',
      });
    });

    it('should check week_not_changed before invalid_indices', () => {
      // Different week IDs but invalid indices - should return invalid_indices
      const result = validateWeekChange('week-123', 'week-456', -1, -1);

      expect(result).toEqual({
        shouldUpdate: false,
        reason: 'invalid_indices',
      });
    });
  });
});
