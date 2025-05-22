import { FC, useMemo, useEffect } from 'react';

import { LifeCalendar } from '@/components';
import { USER_AGE, WEEKS_PER_YEAR } from '@/constants';
import { saveWeekList, WeekEntity } from '@/store/clientDB';
import { TWeek } from '@/types';

import s from './s.module.styl';

export const Content: FC = () => {
  const { weeks } = useMemo(() => {
    return [...Array(USER_AGE)].reduce(
      (acc, _, index) => {
        const yearWeeks = [...Array(WEEKS_PER_YEAR)].map((_, i) => ({
          id: 'w' + (i + 1 + index * WEEKS_PER_YEAR),
        }));

        acc.years.push({
          id: 'y' + (index + 1),
          weeks: yearWeeks,
        });

        return {
          years: acc.years,
          weeks: [...acc.weeks, ...yearWeeks],
        };
      },
      { years: [], weeks: [] }
    );
  }, []);

  useEffect(() => {
    // Save all generated weeks to IndexedDB

    const generatedWeeks = (weeks as TWeek[]).map((week: TWeek) => ({
      ...week,
      dateStart: '', // fill with real data if needed
      dateEnd: '', // fill with real data if needed
      type: 'past' as WeekEntity['type'], // or calculate dynamically
    }));

    saveWeekList(generatedWeeks);
  }, [weeks]);

  return (
    <div className={s.content}>
      <LifeCalendar weeks={weeks} />
    </div>
  );
};

export default Content;
