import { lifeCalendarDB } from '@/store/clientDB';

/**
 * Update todayWeekId and todayWeekIndex in meta table (always one record with key 'main')
 * @param params - object with todayWeekId and todayWeekIndex
 */
export const updateDBTodayWeek = async ({
  todayWeekId,
  todayWeekIndex,
}: {
  todayWeekId?: string;
  todayWeekIndex?: number;
}) => {
  let prev = await lifeCalendarDB.meta.get('main');
  if (!prev) {
    prev = { id: 'main', todayWeekId: todayWeekId || '', todayWeekIndex: todayWeekIndex || 0 };
  }
  await lifeCalendarDB.meta.put({
    ...prev,
    todayWeekId: todayWeekId || '',
    todayWeekIndex: todayWeekIndex || 0,
    id: 'main',
  });
};
