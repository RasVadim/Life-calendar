import React, { FC } from 'react';

import { IWeek } from '@/store/clientDB';

import { Month } from './components';

import s from './s.module.styl';

type TProps = {
  weeks: IWeek[];
  offsetBegin: number[];
  isByWidth: boolean;
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

export const MonthsGrid: FC<TProps> = ({ weeks, offsetBegin, isByWidth }) => {
  const grouped = groupWeeksByMonth(weeks);
  const monthKeys = Object.keys(grouped).sort();

  return (
    <div className={s.wrapper}>
      {monthKeys.map((key, idx) => {
        let monthWeeks = grouped[key] as (IWeek | number)[];
        // Add empty weeks to the beginning of the first month
        if (idx === 0) {
          monthWeeks = [...offsetBegin, ...monthWeeks];
        }
        // Add empty weeks to the end of the last month
        if (idx === monthKeys.length - 1) {
          monthWeeks = [...monthWeeks, ...offsetBegin];
        }
        const [year, month] = key.split('-');
        return (
          <Month key={key} year={year} month={month} weeks={monthWeeks} isByWidth={isByWidth} />
        );
      })}
    </div>
  );
};
