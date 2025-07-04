import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { UserDataEntity } from '../../lifeCalendarDB';

/**
 * React hook to get user data from IndexedDB reactively
 * @returns {UserDataEntity} User data
 */
export const useDBUserData = (): UserDataEntity | undefined => {
  return useLiveQuery(() => lifeCalendarDB.userData.toCollection().first(), []);
};
