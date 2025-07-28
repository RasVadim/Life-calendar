import { lifeCalendarDB } from '@/store/clientDB';

const DEFAULT_TODAY_DATA = {
  id: 'main',
  todayWeekId: '',
  todayWeekIndex: 0,
  todayDayId: '',
  todayDayIndex: 0,
};

/**
 * Update todayWeekId and todayWeekIndex in meta table (always one record with key 'main')
 * @param params - object with todayWeekId and todayWeekIndex
 */
export const updateDBTodayWeek = async (newData: {
  todayWeekId?: string;
  todayWeekIndex?: number;
  todayDayId?: string;
  todayDayIndex?: number;
}) => {
  let prev = await lifeCalendarDB.meta.get('main');

  if (!prev) {
    prev = DEFAULT_TODAY_DATA;
  }
  await lifeCalendarDB.meta.put({
    ...prev,
    ...newData,
    id: 'main',
  });
};
