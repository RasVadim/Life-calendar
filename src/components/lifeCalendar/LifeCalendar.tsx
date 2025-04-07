import { FC } from 'react';

import { Week, ZoomableGrid } from './components';
import type { TWeek } from './types';

import s from './s.module.styl';

type PropsType = {
  weeks?: TWeek[];
};

export const LifeCalendar: FC<PropsType> = ({ weeks }) => {
  return (
    <div className={s.calendar}>
      <ZoomableGrid >
        {weeks?.map((week) => (
          <Week key={week.id} id={week.id} />
        ))}
      </ZoomableGrid>
    </div>
  );
};
