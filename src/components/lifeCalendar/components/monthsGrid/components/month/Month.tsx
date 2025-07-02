import { FC } from 'react';

import { Week } from '@/components/lifeCalendar/components/week/Week';
import { LIFE_MODES, ZODIAC_ICONS } from '@/constants';
import { useTranslation } from '@/hooks';
import { IWeek } from '@/store/clientDB';
import { TWeekZodiac } from '@/types';

import s from './s.module.styl';

type TProps = {
  year: string;
  zodiac: string;
  month: string;
  weeks: (IWeek | number)[];
  isByWidth: boolean;
  isMediumScreen: boolean;
};

export const Month: FC<TProps> = ({ year, zodiac, month, weeks, isByWidth, isMediumScreen }) => {
  const { t } = useTranslation();

  const ZodiacIcon = ZODIAC_ICONS[zodiac as TWeekZodiac];

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <ZodiacIcon size={isMediumScreen ? '16' : '20'} />
        <div className={s.labelYear}>{year}</div>
        <div className={s.labelMonth}>{t(`life.${month}`)}</div>
      </div>
      <div className={s.weeksRow}>
        {weeks.map((week, idx) => {
          if (typeof week === 'number') {
            return <div key={`empty-${idx}`} className={s.emptyWeek} />;
          }

          return (
            <Week
              key={week.id}
              id={week.id}
              week={week}
              isByWidth={isByWidth}
              lifeMode={LIFE_MODES.MONTHS}
            />
          );
        })}
      </div>
    </div>
  );
};
