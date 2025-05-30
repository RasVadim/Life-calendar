import { lifeCalendarDB, IWeek } from '@/store/clientDB';

// Save list of weeks to IndexedDB
export const saveWeekList = async (weeks: IWeek[]) => {
  await lifeCalendarDB.weeks.clear();
  await lifeCalendarDB.weeks.bulkPut(weeks);
};
