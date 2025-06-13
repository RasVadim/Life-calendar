import { lifeCalendarDB } from '@/store/clientDB';

// Reset all weeks in IndexedDB
export const resetDBWeeks = async () => {
  await lifeCalendarDB.weeks.clear();
};
