import { FC } from 'react';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { useLifeGridColumnsCount } from '@/store/atoms';
import { IWeek, useDBUserData } from '@/store/clientDB';

import { Week, ZoomableGrid } from './components';

import s from './s.module.styl';

type PropsType = {
  weeks?: IWeek[];
};

export const LifeCalendar: FC<PropsType> = ({ weeks }) => {
  const userData = useDBUserData();
  const [columns] = useLifeGridColumnsCount();

  const isByWidth = Boolean(
    (userData?.lifeExpectancy && userData.lifeExpectancy < 90) ||
      columns !== LIFE_GRID_ZOOM_LEVELS.years,
  );

  return (
    <div className={s.calendar}>
      <ZoomableGrid>
        {weeks?.map((week) => (
          <Week key={week.id} id={week.id} week={week} isByWidth={isByWidth} columns={columns} />
        ))}
      </ZoomableGrid>
    </div>
  );
};
