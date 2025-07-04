import { lifeCalendarDB } from '@/store/clientDB';

/**
 * Update user data in IndexedDB. Only provided fields will be updated.
 * @param data - Partial user data fields to update
 */
export const updateDBUserData = async (
  data: Partial<{ birthDate: string; lifeExpectancy: number | null; deathDate: string | null }>,
) => {
  let prev = await lifeCalendarDB.userData.get('main');
  if (!prev) {
    // Create new userData if not exists
    prev = { id: 'main', birthDate: null, lifeExpectancy: null, deathDate: null };
  }
  await lifeCalendarDB.userData.put({
    ...prev,
    ...data,
    id: 'main',
  });
};
