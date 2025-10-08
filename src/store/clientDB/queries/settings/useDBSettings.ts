import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { ISettings } from '../../interfaces';

/**
 * React hook to get settings from IndexedDB reactively
 * @returns {ISettings} Settings data
 */
export const useDBSettings = (): ISettings | undefined => {
  return useLiveQuery(() => lifeCalendarDB.settings.toCollection().first(), []);
};
