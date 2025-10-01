import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB, IWeek } from '@/store/clientDB';

/**
 * React hook to get a week by ID from IndexedDB reactively
 * Uses the primary key 'id' for maximum performance
 * @param id - The week ID to search for
 * @returns {IWeek | undefined} The week with the specified ID, or undefined if not found
 */
export const useDBWeekById = (id: string): IWeek | undefined => {
  return useLiveQuery(() => lifeCalendarDB.weeks.get(id), [id]);
};
