import { FC } from 'react';

import { LIFE_MODES } from '@/constants';
import { useLifeGridMode } from '@/store/atoms';
import { IWeek, useDBUserData } from '@/store/clientDB';
import { useTodayWeek } from '@/store/clientDB';

import { MonthsGrid, SeasonsGrid, YearsGrid } from './components';
import { getOffsetBegin } from './utils';

import s from './s.module.styl';

type PropsType = {
  weeks?: IWeek[];
};

export const LifeCalendar: FC<PropsType> = ({ weeks }) => {
  const userData = useDBUserData();
  const [lifeMode] = useLifeGridMode();
  const { todayWeekId } = useTodayWeek();

  const isByWidth = Boolean(
    (userData?.lifeExpectancy && userData.lifeExpectancy < 90) || lifeMode !== LIFE_MODES.YEARS,
  );

  // 14 weeks = season + 1 week
  const offsetBegin = getOffsetBegin(lifeMode, weeks?.slice(0, 14));

  return (
    <div className={s.calendar}>
      {lifeMode === LIFE_MODES.MONTHS && (
        <MonthsGrid
          weeks={weeks || []}
          offsetBegin={offsetBegin}
          isByWidth={isByWidth}
          todayWeekId={todayWeekId || ''}
        />
      )}

      {lifeMode === LIFE_MODES.SEASONS && (
        <SeasonsGrid
          weeks={weeks || []}
          offsetBegin={offsetBegin}
          isByWidth={isByWidth}
          todayWeekId={todayWeekId || ''}
        />
      )}

      {lifeMode === LIFE_MODES.YEARS && (
        <YearsGrid weeks={weeks || []} isByWidth={isByWidth} lifeMode={lifeMode} />
      )}
      {lifeMode !== LIFE_MODES.YEARS && <div className={s.bottomPadding} />}
    </div>
  );
};
