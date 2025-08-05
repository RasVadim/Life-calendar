import { FC } from 'react';

import cx from 'classnames';

import { IWeek } from '@/store/clientDB';
import { ELifeMode, EWeekType } from '@/types';

import { getBGColor, getBorderColor } from './utils';

import s from './s.module.styl';

type PropsType = {
  id: string;
  week: IWeek;
  isByWidth?: boolean;
  lifeMode: ELifeMode;
};

export const Week: FC<PropsType> = ({ id, week, isByWidth, lifeMode }) => {
  const bGColor = getBGColor(week.holidays);
  const borderColor = getBorderColor(week.type);
  const isPresent = week.type === EWeekType.Present;

  return (
    <div
      key={id}
      data-week-id={id}
      className={cx(s.week, {
        [s.present]: isPresent,
        [s.byWidth]: isByWidth,
        [s.seasonsMode]: lifeMode === ELifeMode.Seasons,
        [s.monthsMode]: lifeMode === ELifeMode.Months,
      })}
      style={{ backgroundColor: bGColor, borderColor: borderColor }}
    >
      {id}
    </div>
  );
};
