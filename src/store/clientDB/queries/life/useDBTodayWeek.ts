import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';
import { TTodayData } from '@/types';

/**
 * React hook to get todayWeekId and todayWeekIndex from IndexedDB meta table reactively
 * @returns {{ todayWeekId: string | undefined, todayWeekIndex: number | undefined }}
 */
export const useDBTodayWeek = (): TTodayData => {
  const meta = useLiveQuery(() => lifeCalendarDB.meta.get('main'), []);
  return {
    todayWeekId: meta?.todayWeekId || '',
    todayWeekIndex: meta?.todayWeekIndex || 0,
    todayDayId: meta?.todayDayId || '',
    todayDayIndex: meta?.todayDayIndex || 0,
  };
};
