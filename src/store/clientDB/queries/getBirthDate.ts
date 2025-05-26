import { lifeCalendarDB } from '../lifeCalendarDB';

/**
 * Get user's birth date from IndexedDB
 * @returns {Promise<string | null>} birthDate or null if not set
 */
export async function getBirthDate(): Promise<string | null> {
  const userData = await lifeCalendarDB.userData.get('main');
  return userData?.birthDate ?? null;
} 