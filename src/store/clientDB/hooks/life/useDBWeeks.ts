import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB, IWeek } from '@/store/clientDB';

/**
 * React hook to get all weeks from IndexedDB reactively
 * @returns {IWeek[]} Array of weeks
 */
export function useDBWeeks(): IWeek[] {
  return (
    (useLiveQuery(() => lifeCalendarDB.weeks.toArray(), []) as IWeek[]) || []
  );
}
