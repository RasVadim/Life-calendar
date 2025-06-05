import { FC } from 'react';

import cx from 'classnames';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { useLifeGridColumnsCount } from '@/store/atoms';

import s from './s.module.styl';

type LabelData = {
  text: string;
  rowIndex: number;
};

export const GridLabels: FC = () => {
  const [columns] = useLifeGridColumnsCount();

  const getLabels = (): LabelData[] => {
    // Здесь логика генерации лейблов в зависимости от columns
    if (columns === LIFE_GRID_ZOOM_LEVELS.seasons) {
      return [
        { text: 'Зима 2024', rowIndex: 0 },
        { text: 'Весна 2024', rowIndex: 1 },
        // и т.д.
      ];
    } else if (columns === LIFE_GRID_ZOOM_LEVELS.months) {
      return [
        { text: 'Январь 2024', rowIndex: 0 },
        { text: 'Февраль 2024', rowIndex: 1 },
        // и т.д.
      ];
    }
    return [];
  };

  const labels = getLabels();

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
          {label.text}
        </div>
      ))}
    </>
  );
};
