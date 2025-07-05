import React, { FC, useEffect, useRef, useState } from 'react';

import cx from 'classnames';

import s from './s.module.styl';

export type TSegmentedControlTabs = {
  label?: string;
  value: string;
  icon?: React.ReactNode;
};

type TProps = {
  tabs: Array<TSegmentedControlTabs>;
  onSelection: (value: string) => void;
  defaultValue?: string;
  value?: string;
};

export const Segmented: FC<TProps> = ({ tabs, onSelection, defaultValue, value }) => {
  // React Hooks: State
  const [localValue, setLocalValue] = useState<string>(defaultValue || '');
  const isDefaultSet = useRef(false); // Track if defaultValue was already set

  // Set Initial Tab only once
  useEffect(() => {
    if (!isDefaultSet.current && defaultValue) {
      setLocalValue(defaultValue);
      isDefaultSet.current = true;
    }
  }, [defaultValue]);

  // Set outside Tab value from controlled value
  useEffect(() => {
    if (value && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Handle tab selection
  const handleTabClick = (tabValue: string) => {
    setLocalValue(tabValue);
    onSelection(tabValue);
  };

  return (
    <div className={s.container}>
      <div className={s.trackContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={cx({
              [s.tab]: tab.value !== localValue,
              [s.selected]: tab.value === localValue,
            })}
            onClick={() => handleTabClick(tab.value)}
          >
            {tab.icon && <div className={s.icon}>{tab.icon}</div>}
            {tab.label && <span className={s.text}>{tab.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
