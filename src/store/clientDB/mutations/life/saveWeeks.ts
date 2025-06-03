import { lifeCalendarDB, IWeek } from '@/store/clientDB';

// Save list of weeks to IndexedDB
export const saveWeeks = async (weeks: IWeek[]) => {
  await lifeCalendarDB.weeks.bulkPut(weeks);
};
