import { FC } from 'react';

import { Week } from '@/components/lifeCalendar/components/week/Week';
import { LIFE_MODES } from '@/constants';
import { useTranslation } from '@/hooks';
import { IWeek } from '@/store/clientDB';

import s from './s.module.styl';

type TProps = {
  year: string;
  season: string;
  weeks: (IWeek | number)[];
  isByWidth: boolean;
};

export const Season: FC<TProps> = ({ year, season, weeks, isByWidth }) => {
  const { t } = useTranslation();
  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <div className={s.labelYear}>{year}</div>
        <div className={s.labelSeason}>{t(`life.${season}`)}</div>
      </div>
      <div className={s.weeksRow}>
        {weeks.map((week) => {
          if (typeof week === 'number') {
            return <div key={week} className={s.emptyWeek} />;
          }

          return (
            <Week
              key={week.id}
              id={week.id}
              week={week}
              isByWidth={isByWidth}
              lifeMode={LIFE_MODES.SEASONS}
            />
          );
        })}
      </div>
    </div>
  );
};
