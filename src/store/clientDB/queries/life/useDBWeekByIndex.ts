import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB, IWeek } from '@/store/clientDB';

/**
 * React hook to get a week by index from IndexedDB reactively
 * Uses the 'index' field which is indexed for maximum performance
 * @param index - The week index to search for
 * @returns {IWeek | undefined} The week with the specified index, or undefined if not found
 */
export const useDBWeekByIndex = (index: number): IWeek | undefined => {
  return useLiveQuery(() => lifeCalendarDB.weeks.where('index').equals(index).first(), [index]);
};
