import { lifeCalendarDB } from '@/store/clientDB';

const DEFAULT_USER_DATA = {
  id: 'main',
  birthDate: null,
  lifeExpectancy: null,
  deathDate: null,
};

/**
 * Update user data in IndexedDB. Only provided fields will be updated.
 * @param data - Partial user data fields to update
 */
export const updateDBUserData = async (
  data: Partial<{
    birthDate: string;
    lifeExpectancy: number | null;
    deathDate: string | null;
    timezone?: string | null;
  }>,
) => {
  let prev = await lifeCalendarDB.userData.get('main');
  if (!prev) {
    // Create new userData if not exists
    prev = DEFAULT_USER_DATA;
  }
  await lifeCalendarDB.userData.put({
    ...prev,
    ...data,
    id: 'main',
  });
};
