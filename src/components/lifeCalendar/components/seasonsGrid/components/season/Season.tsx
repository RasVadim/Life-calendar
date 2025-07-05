import { FC } from 'react';

import { Week } from '@/components/lifeCalendar/components/week/Week';
import { LIFE_MODES } from '@/constants';
import { useTranslation } from '@/hooks';
import { IWeek } from '@/store/clientDB';
import { TWeekZodiac, TZodiacIconSet } from '@/types';

import s from './s.module.styl';

type TProps = {
  year: string;
  zodiac: string;
  season: string;
  weeks: (IWeek | number)[];
  isByWidth: boolean;
  isMediumScreen: boolean;
  zodiacIconSet: TZodiacIconSet;
};

export const Season: FC<TProps> = ({
  year,
  zodiac,
  season,
  weeks,
  isByWidth,
  isMediumScreen,
  zodiacIconSet,
}) => {
  const { t } = useTranslation();

  const ZodiacIcon = zodiacIconSet[zodiac as TWeekZodiac];

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        {ZodiacIcon && <ZodiacIcon size={isMediumScreen ? '16' : '18'} />}
        <div className={s.labelYear}>{year}</div>
        <div className={s.labelSeason}>{t(`life.${season}`)}</div>
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
              lifeMode={LIFE_MODES.SEASONS}
            />
          );
        })}
      </div>
    </div>
  );
};
