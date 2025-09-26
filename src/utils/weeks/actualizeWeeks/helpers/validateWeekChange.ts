// Validation result types
export type ValidationReason = 'week_not_changed' | 'invalid_indices' | 'valid_change';

export type ValidationResult = {
  shouldUpdate: boolean;
  reason: ValidationReason;
};

// Validation reason constants
const VALIDATION_REASONS = {
  WEEK_NOT_CHANGED: 'week_not_changed' as const,
  INVALID_INDICES: 'invalid_indices' as const,
  VALID_CHANGE: 'valid_change' as const,
} as const;

/**
 * Validate if week change is needed and return validation result
 *
 * @param prevTodayWeekId - Previous week ID from metadata
 * @param nowWeekId - Current week ID
 * @param prevIndex - Previous week index
 * @param nowIndex - Current week index
 * @returns Validation result with shouldUpdate flag and reason
 */
export const validateWeekChange = (
  prevTodayWeekId: string | undefined,
  nowWeekId: string,
  prevIndex: number,
  nowIndex: number,
): ValidationResult => {
  // Early return if week hasn't changed
  if (prevTodayWeekId === nowWeekId) {
    return { shouldUpdate: false, reason: VALIDATION_REASONS.WEEK_NOT_CHANGED };
  }

  // Early return if indices are invalid
  if (prevIndex === -1 || nowIndex === -1) {
    return { shouldUpdate: false, reason: VALIDATION_REASONS.INVALID_INDICES };
  }

  return { shouldUpdate: true, reason: VALIDATION_REASONS.VALID_CHANGE };
};
