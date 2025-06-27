import { FC } from 'react';

import cx from 'classnames';

import { LIFE_MODES } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { EWeekType, TLifeMode } from '@/types';

import { getBGColor, getBorderColor } from './utils';

import s from './s.module.styl';

type PropsType = {
  id: string;
  week: IWeek;
  isByWidth?: boolean;
  lifeMode: TLifeMode;
};

export const Week: FC<PropsType> = ({ id, week, isByWidth, lifeMode }) => {
  const bGColor = getBGColor(week.holidays);
  const borderColor = getBorderColor(week.type);
  const isPresent = week.type === EWeekType.Present;

  return (
    <div
      key={id}
      className={cx(s.week, {
        [s.present]: isPresent,
        [s.byWidth]: isByWidth,
        [s.seasonsMode]: lifeMode === LIFE_MODES.SEASONS,
        [s.monthsMode]: lifeMode === LIFE_MODES.MONTHS,
      })}
      style={{ backgroundColor: bGColor, borderColor: borderColor }}
    >
      {id}
    </div>
  );
};
