import { FC } from 'react';


import { IWeek } from '@/store/clientDB';

import { Week, ZoomableGrid } from './components';

import s from './s.module.styl';


type PropsType = {
  weeks?: IWeek[];
};

export const LifeCalendar: FC<PropsType> = ({ weeks }) => {
  return (
    <div className={s.calendar}>
      <ZoomableGrid>
        {weeks?.map((week) => (
          <Week key={week.id} id={week.id} week={week} />
        ))}
      </ZoomableGrid>
    </div>
  );
};
