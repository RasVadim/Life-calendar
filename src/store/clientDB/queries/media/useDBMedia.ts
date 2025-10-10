import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { IMedia } from '../../interfaces';

/**
 * React hook to get media data from IndexedDB reactively
 * @returns {IMedia} Media data or empty object if no data exists
 */
export const useDBMedia = (): IMedia => {
  const media = useLiveQuery(() => lifeCalendarDB.media.toCollection().first(), []);
  return media || { id: 'main', media: {} };
};
