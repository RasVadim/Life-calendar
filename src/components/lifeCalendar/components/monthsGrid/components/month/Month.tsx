import React, { FC } from 'react';

import { Week } from '@/components/lifeCalendar/components/week/Week';
import { useTranslation } from '@/hooks';
import { IWeek } from '@/store/clientDB';

import s from './s.module.styl';

type TProps = {
  year: string;
  month: string;
  weeks: (IWeek | number)[];
  isByWidth: boolean;
};

export const Month: FC<TProps> = ({ year, month, weeks, isByWidth }) => {
  const { t } = useTranslation();
  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <div className={s.labelYear}>{year}</div>
        <div className={s.labelMonth}>{t(`life.${month}`)}</div>
      </div>
      <div className={s.weeksRow}>
        {weeks.map((week) => {
          if (typeof week === 'number') {
            return <div key={week} className={s.emptyWeek} />;
          }

          return <Week key={week.id} id={week.id} week={week} isByWidth={isByWidth} columns={4} />;
        })}
      </div>
    </div>
  );
};
