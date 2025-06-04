import { lifeCalendarDB } from '../../lifeCalendarDB';
import type { IWeek } from '../../lifeCalendarDB';

/**
 * Get all weeks from IndexedDB
 * @returns {Promise<IWeek[]>} Array of weeks
 */
export async function getWeeks(): Promise<IWeek[]> {
  return await lifeCalendarDB.weeks.toArray();
}
