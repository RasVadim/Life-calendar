import { FC } from 'react';

import { useDBUserData } from '@/store/clientDB/queries/life/useDBUserData';
import { useDBWeeks } from '@/store/clientDB/queries/life/useDBWeeks';
import { TWeekZodiac, TZodiacIconSet } from '@/types';

import { useRowLabels } from './hooks';

import s from './s.module.styl';

type TProps = {
  zodiacIconSet: TZodiacIconSet;
};

export const GridLabels: FC<TProps> = ({ zodiacIconSet }) => {
  const weeks = useDBWeeks();
  const userData = useDBUserData();

  const labels = useRowLabels(weeks, userData);

  if (labels.length === 0) return null;

  return (
    <>
      {labels.map((label, index) => {
        const StartZodiacIcon = zodiacIconSet[label.startYearZodiacLabel as TWeekZodiac];
        const EndZodiacIcon = zodiacIconSet[label.endYearZodiacLabel as TWeekZodiac];

        return (
          <div
            key={index}
            className={s.label}
            style={{
              gridRow: `${label.rowIndex + 1}`,
              gridColumn: '1 / -1',
            }}
          >
            <div className={s.labelZodiac}>
              {StartZodiacIcon && <StartZodiacIcon size="13" />}
              {EndZodiacIcon && <EndZodiacIcon size="13" />}
            </div>
            <div className={s.labelYear}>{label.text}</div>
          </div>
        );
      })}
    </>
  );
};
