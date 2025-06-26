import { lifeCalendarDB } from '@/store/clientDB';

/**
 * Update todayWeekId in meta table (always one record with key 'main')
 * @param todayWeekId - id of the week that is considered current
 */
export const updateTodayWeekId = async (todayWeekId: string) => {
  let prev = await lifeCalendarDB.meta.get('main');
  if (!prev) {
    prev = { id: 'main', todayWeekId };
  }
  await lifeCalendarDB.meta.put({
    ...prev,
    todayWeekId,
    id: 'main',
  });
};
