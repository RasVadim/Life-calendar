import { lifeCalendarDB, WeekEntity } from '@/store/clientDB';

// Save list of weeks to IndexedDB
export const saveWeekList = async (weeks: WeekEntity[]) => {
  await lifeCalendarDB.weeks.clear();
  await lifeCalendarDB.weeks.bulkPut(weeks);
};
