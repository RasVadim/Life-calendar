import { FC, useLayoutEffect, useRef, useCallback } from 'react';

import cx from 'classnames';

import { useSetSyncPending } from '@/store/atoms';
import { IWeek } from '@/store/clientDB';

import { Month } from './components';

import s from './s.module.styl';

type TProps = {
  weeks: IWeek[];
  offsetBegin: number[];
  isByWidth: boolean;
  todayWeekId: string;
};

const groupWeeksByMonth = (weeks: IWeek[]) => {
  const grouped: Record<string, IWeek[]> = {};
  weeks.forEach((week) => {
    const key = `${week.dateYear}-${week.dateMonth}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(week);
  });
  return grouped;
};

export const MonthsGrid: FC<TProps> = ({ weeks, offsetBegin, isByWidth, todayWeekId }) => {
  const grouped = groupWeeksByMonth(weeks);
  const monthKeys = Object.keys(grouped).sort();

  const monthRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setPending = useSetSyncPending();

  const scrollToTodayWeek = useCallback(() => {
    setPending(true);
    if (!todayWeekId) return;
    // Find the index of the month containing the current week
    const idx = monthKeys.findIndex((key) =>
      grouped[key].some((week) => typeof week !== 'number' && week.id === todayWeekId),
    );
    if (idx !== -1 && monthRefs.current[idx]) {
      monthRefs.current[idx]?.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
    setTimeout(() => setPending(false), 0);
  }, [todayWeekId, monthKeys.join(','), weeks]);

  useLayoutEffect(() => {
    scrollToTodayWeek();
  }, [scrollToTodayWeek]);

  return (
    <div className={cx(s.wrapper, { [s.transparent]: !todayWeekId })}>
      {monthKeys.map((key, idx) => {
        let monthWeeks = grouped[key] as (IWeek | number)[];
        // Add empty weeks to the beginning of the first month
        if (idx === 0) {
          monthWeeks = [...offsetBegin, ...monthWeeks];
        }
        // Add empty weeks to the end of the last month
        if (idx === monthKeys.length - 1) {
          const emptyCount = 4 - offsetBegin.length;
          if (emptyCount > 0) {
            monthWeeks = [...monthWeeks, ...Array(emptyCount).fill(0)];
          }
        }
        const [year, month] = key.split('-');
        return (
          <div ref={(el) => (monthRefs.current[idx] = el)} key={key}>
            <Month year={year} month={month} weeks={monthWeeks} isByWidth={isByWidth} />
          </div>
        );
      })}
    </div>
  );
};
