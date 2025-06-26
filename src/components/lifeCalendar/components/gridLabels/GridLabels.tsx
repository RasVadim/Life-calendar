import { FC } from 'react';

import cx from 'classnames';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { useLifeGridColumnsCount } from '@/store/atoms';
import { useDBUserData } from '@/store/clientDB/queries/life/useDBUserData';
import { useDBWeeks } from '@/store/clientDB/queries/life/useDBWeeks';

import { useRowLabels } from './hooks';

import s from './s.module.styl';

export const GridLabels: FC = () => {
  const [columns] = useLifeGridColumnsCount();
  const weeks = useDBWeeks();
  const userData = useDBUserData();

  const labels = useRowLabels(weeks, userData, columns);

  if (labels.length === 0) return null;

  return (
    <>
      {labels.map((label, index) => (
        <div
          key={index}
          className={cx(s.label, {
            [s.monthMode]: columns === LIFE_GRID_ZOOM_LEVELS.months,
          })}
          style={{
            gridRow: `${label.rowIndex + 1}`,
            gridColumn: '1 / -1',
          }}
        >
          <div className={s.labelYear}>{label.year}</div>
          {label.season && <div className={s.labelSeason}>{label.season}</div>}
          {label.month && <div className={s.labelMonth}>{label.month}</div>}
        </div>
      ))}
    </>
  );
};
