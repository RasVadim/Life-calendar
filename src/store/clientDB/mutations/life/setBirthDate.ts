import { lifeCalendarDB } from '../../lifeCalendarDB';

/**
 * Save user's birth date to IndexedDB
 * @param birthDate - ISO string of the user's birth date
 */
export async function setBirthDate(birthDate: string) {
  await lifeCalendarDB.userData.put({
    id: 'main',
    birthDate,
    lifeExpectancy: null,
    deathDate: null,
  });
} 