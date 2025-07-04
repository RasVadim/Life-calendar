import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { Settings } from '../../lifeCalendarDB';

/**
 * React hook to get settings from IndexedDB reactively
 * @returns {Settings} Settings data
 */
export const useDBSettings = (): Settings | undefined => {
  return useLiveQuery(() => lifeCalendarDB.settings.toCollection().first(), []);
};
