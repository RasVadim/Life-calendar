import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { MetaEntity } from '../../lifeCalendarDB';

/**
 * React hook to get todayWeekId and todayWeekIndex from IndexedDB meta table reactively
 * @returns {{ todayWeekId: string | undefined, todayWeekIndex: number | undefined }}
 */
export const useDBTodayWeek = (): {
  todayWeekId: string | undefined;
  todayWeekIndex: number | undefined;
} => {
  const meta = useLiveQuery<MetaEntity | undefined>(() => lifeCalendarDB.meta.get('main'), []);
  return {
    todayWeekId: meta?.todayWeekId,
    todayWeekIndex: meta?.todayWeekIndex,
  };
};
