/**
 * Gets the user's timezone using Intl.DateTimeFormat
 * @returns {string} The user's timezone (e.g. 'Europe/Moscow', 'America/New_York')
 */
export const getUserTimezone = (): string => {
  try {
    // Get timezone using Intl.DateTimeFormat
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone;
  } catch (error) {
    console.warn('Failed to get user timezone, falling back to UTC:', error);
    return 'UTC';
  }
};

/**
 * Gets the user's timezone offset in minutes
 * @returns {number} Timezone offset in minutes from UTC
 */
export const getUserTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset();
};
