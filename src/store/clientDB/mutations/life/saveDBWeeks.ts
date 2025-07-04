import { lifeCalendarDB, IWeek } from '@/store/clientDB';

// Save list of weeks to IndexedDB
export const saveDBWeeks = async (weeks: IWeek[]) => {
  await lifeCalendarDB.weeks.bulkPut(weeks);
};
