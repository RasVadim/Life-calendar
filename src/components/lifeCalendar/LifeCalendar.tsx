import { FC } from 'react';
import cx from 'classnames';

// import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
// import { useLifeGridColumnsCount } from '@/store/atoms';

import { Week, ZoomableGrid } from './components';
import type { TWeek } from './types';

import s from './s.module.styl';

type PropsType = {
  weeks?: TWeek[];
};

export const LifeCalendar: FC<PropsType> = ({ weeks }) => {
  // const [columns] = useLifeGridColumnsCount();

  return (
    <div
      className={cx(s.calendar, {
        [s.yearsPropositions]: true,
      })}
    >
      <ZoomableGrid>
        {weeks?.map((week) => (
          <Week key={week.id} id={week.id} />
        ))}
      </ZoomableGrid>
    </div>
  );
};
