import { IWeek } from '@/store/clientDB';
import { TLifeMode } from '@/types';

import { Week } from '../week/Week';

import s from './s.module.styl';

type PropsType = {
  weeks: IWeek[];
  isByWidth: boolean;
  lifeMode: TLifeMode;
};

export const YearsGrid = ({ weeks, isByWidth, lifeMode }: PropsType) => {
  return (
    <div className={s.container}>
      {(weeks || []).map((week) => (
        <Week key={week.id} id={week.id} week={week} isByWidth={isByWidth} lifeMode={lifeMode} />
      ))}
    </div>
  );
};
