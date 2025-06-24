import { FC } from 'react';

import cx from 'classnames';

import { IWeek } from '@/store/clientDB';
import { EWeekType } from '@/types/life';

import { getBGColor, getBorderColor } from './utils';

import s from './s.module.styl';

type PropsType = {
  id: string;
  week: IWeek;
  isByWidth?: boolean;
};

export const Week: FC<PropsType> = ({ id, week, isByWidth }) => {
  const bGColor = getBGColor(week.holidays);
  const borderColor = getBorderColor(week.type);
  const isPresent = week.type === EWeekType.Present;

  return (
    <div
      className={cx(s.week, { [s.present]: isPresent, [s.byWidth]: isByWidth })}
      style={{ backgroundColor: bGColor, borderColor: borderColor }}
    >
      {id}
    </div>
  );
};
