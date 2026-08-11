import { DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { EWeekType } from '@/types';

import type { IWeek } from '../interfaces';
import { lifeCalendarDB } from '../lifeCalendarDB';

// Initialize default weeks (empty, gray) if not present
export const initDefaultWeeks = async () => {
  const count = await lifeCalendarDB.weeks.count();
  if (count === 0) {
    const weeks = Array.from({ length: DEFAULT_LIFE_SPAN_YEARS * 52 }, (_, i) => {
      const year = Math.floor(i / 52) + 1;
      const week = (i % 52) + 1;
      return {
        id: `w${String(year).padStart(2, '0')}_${String(week).padStart(2, '0')}`,
        dateStart: '',
        dateEnd: '',
        type: EWeekType.Future,
      };
    });
    await lifeCalendarDB.weeks.bulkAdd(weeks as IWeek[]);
  }
};
