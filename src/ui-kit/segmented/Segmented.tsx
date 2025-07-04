import React, { FC, useEffect, useState } from 'react';

import cx from 'classnames';

import s from './s.module.styl';

export type TSegmentedControlTabs = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type TProps = {
  tabs: Array<TSegmentedControlTabs>;
  onSelection: (value: string) => void;
  defaultTab?: string;
};

export const Segmented: FC<TProps> = ({ tabs, onSelection, defaultTab }) => {
  // React Hooks: State
  const [value, setValue] = useState<string>(defaultTab || tabs[0].value);

  // Set Initial Tab
  useEffect(() => {
    // Set Data
    setValue(defaultTab || tabs[0].value);
  }, []);

  return (
    <div className={s.container}>
      <div className={s.trackContainer}>
        {tabs.map((tab) => (
          <button
            className={cx({
              [s.tab]: tab.value !== value,
              [s.selected]: tab.value === value,
            })}
            onClick={() => setValue(tab.value)}
          >
            <p className={s.text}>{tab.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
