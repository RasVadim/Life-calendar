import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { IMedia } from '../../interfaces';

/**
 * React hook to get media data from IndexedDB reactively
 * @returns {IMedia} Media data
 */
export const useDBMedia = (): IMedia | undefined => {
  return useLiveQuery(() => lifeCalendarDB.media.toCollection().first(), []);
};
