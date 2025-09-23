import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { IUserData } from '../../interfaces';

/**
 * React hook to get user data from IndexedDB reactively
 * @returns {UserDataEntity} User data
 */
export const useDBUserData = (): IUserData | undefined => {
  return useLiveQuery(() => lifeCalendarDB.userData.toCollection().first(), []);
};
