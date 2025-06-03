import { DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { EWeekType } from '@/types';

import { lifeCalendarDB } from '../lifeCalendarDB';

// Initialize default weeks (empty, gray) if not present
export const initDefaultWeeks = async () => {
  const count = await lifeCalendarDB.weeks.count();
  if (count === 0) {
    const weeks = Array.from(
      { length: DEFAULT_LIFE_SPAN_YEARS * 52 },
      (_, i) => {
        const year = Math.floor(i / 52) + 1;
        const week = (i % 52) + 1;
        return {
          id: `w${String(year).padStart(2, '0')}_${String(week).padStart(2, '0')}`,
          dateStart: '',
          dateEnd: '',
          type: EWeekType.Future,
          month: 0,
          year: 0,
          dateYear: '',
          dateMonth: '',
          dateSeason: null,
          numberOfDays: 7,
          isFirst: false,
          isLast: false,
          isFirstInYear: false,
          isLastInYear: false,
          isFirstInMonth: false,
          isLastInMonth: false,
          isExpandedByYear: false,
          isExpandedByDateSeason: false,
          isExpandedByDateMonth: false,
          isPartialByYear: false,
          isPartialByDateSeason: false,
          isPartialByDateMonth: false,
          isLeapYear: false,
          holidays: null,
          yearZodiacLabel: null,
          photoUrl: '',
          photoLocal: '',
        };
      },
    );
    await lifeCalendarDB.weeks.bulkAdd(weeks);
  }
};
