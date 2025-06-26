import { FC } from 'react';

import cx from 'classnames';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { EWeekType } from '@/types/life';

import { getBGColor, getBorderColor } from './utils';

import s from './s.module.styl';

type PropsType = {
  id: string;
  week: IWeek;
  isByWidth?: boolean;
  columns: number;
};

export const Week: FC<PropsType> = ({ id, week, isByWidth, columns }) => {
  const bGColor = getBGColor(week.holidays);
  const borderColor = getBorderColor(week.type);
  const isPresent = week.type === EWeekType.Present;

  return (
    <div
      key={id}
      className={cx(s.week, {
        [s.present]: isPresent,
        [s.byWidth]: isByWidth,
        [s.seasonsMode]: columns === LIFE_GRID_ZOOM_LEVELS.seasons,
        [s.monthsMode]: columns === LIFE_GRID_ZOOM_LEVELS.months,
      })}
      style={{ backgroundColor: bGColor, borderColor: borderColor }}
    >
      {id}
    </div>
  );
};
