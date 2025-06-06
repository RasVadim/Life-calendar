import React, { useEffect, useState } from 'react';

import cx from 'classnames';

import { WEEKS_PER_YEAR } from '@/constants';

import s from './s.module.styl';

const WEEKS_COUNT = 24;
const ANIMATION_INTERVAL = 20; // ms
const INITIAL_INDEX = 26; // 25 past, 1 present, остальные future

export const PageLoadingHolder: React.FC = () => {
  const [presentIndex, setPresentIndex] = useState(INITIAL_INDEX);

  const offset = WEEKS_PER_YEAR / 2 - WEEKS_COUNT / 2;

  const calculatedWeekCount = offset + WEEKS_COUNT;

  useEffect(() => {
    const interval = setInterval(() => {
      setPresentIndex((prev) => (prev + 1) % WEEKS_PER_YEAR);
    }, ANIMATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.loadingRow}>
      {Array.from({ length: calculatedWeekCount }).map((_, i) => {
        if (i < offset) {
          return <div></div>;
        }

        return (
          <div
            key={i}
            className={cx(s.week, {
              [s.past]: i < presentIndex,
              [s.present]: i === presentIndex,
              [s.future]: i > presentIndex,
            })}
          />
        );
      })}
    </div>
  );
};
