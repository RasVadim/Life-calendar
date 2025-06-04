import React, { useEffect, useState } from 'react';

import cx from 'classnames';

import s from './s.module.styl';

const WEEKS_COUNT = 52;
const ANIMATION_INTERVAL = 20; // ms
const INITIAL_INDEX = 25; // 25 past, 1 present, остальные future

export const PageLoadingHolder: React.FC = () => {
  const [presentIndex, setPresentIndex] = useState(INITIAL_INDEX);

  useEffect(() => {
    const interval = setInterval(() => {
      setPresentIndex((prev) => (prev + 1) % WEEKS_COUNT);
    }, ANIMATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.loadingRow}>
      {Array.from({ length: WEEKS_COUNT }).map((_, i) => (
        <div
          key={i}
          className={cx(
            s.week,
            i < presentIndex && s.past,
            i === presentIndex && s.present,
            i > presentIndex && s.future,
          )}
        />
      ))}
    </div>
  );
};
