import { FC } from 'react';

import { useZodiacIconSet } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { IWeek, useDBUserData } from '@/store/clientDB';
import { useDBTodayWeek } from '@/store/clientDB';
import { ELifeMode, TZodiacIconSet } from '@/types';

import { MonthsGrid, SeasonsGrid, YearsGrid } from './components';
import { getOffsetBegin } from './utils';

import s from './s.module.styl';

type PropsType = {
  weeks?: IWeek[];
};

export const LifeCalendar: FC<PropsType> = ({ weeks }) => {
  const userData = useDBUserData();
  const [lifeMode] = useLifeGridMode();
  const { todayWeekId } = useDBTodayWeek();
  const zodiacIconSet = useZodiacIconSet({ jsx: true });

  const isByWidth = Boolean(
    (userData?.lifeExpectancy && userData.lifeExpectancy < 90) || lifeMode !== ELifeMode.Years,
  );

  // 14 weeks = season + 1 week
  const offsetBegin = getOffsetBegin(lifeMode, weeks?.slice(0, 14));

  return (
    <div className={s.calendar}>
      {lifeMode === ELifeMode.Months && (
        <MonthsGrid
          weeks={weeks || []}
          offsetBegin={offsetBegin}
          isByWidth={isByWidth}
          todayWeekId={todayWeekId || ''}
          zodiacIconSet={(zodiacIconSet ?? {}) as TZodiacIconSet}
        />
      )}

      {lifeMode === ELifeMode.Seasons && (
        <SeasonsGrid
          weeks={weeks || []}
          offsetBegin={offsetBegin}
          isByWidth={isByWidth}
          todayWeekId={todayWeekId || ''}
          zodiacIconSet={(zodiacIconSet ?? {}) as TZodiacIconSet}
        />
      )}

      {lifeMode === ELifeMode.Years && (
        <YearsGrid
          weeks={weeks || []}
          isByWidth={isByWidth}
          lifeMode={lifeMode}
          zodiacIconSet={(zodiacIconSet ?? {}) as TZodiacIconSet}
        />
      )}
      {lifeMode !== ELifeMode.Years && <div className={s.bottomPadding} />}
    </div>
  );
};
