import React, { memo } from 'react';

import cx from 'classnames';

import { WheelColumn } from './components';
import { TItem } from './utils/generateYearItems';

import s from './s.module.styl';

export type TProps = {
  yearItems: TItem[];
  yearValue: string | number;
  onYearChange: (value: string | number) => void;
  monthItems: TItem[];
  monthValue: string | number;
  onMonthChange: (value: string | number) => void;
  dayItems: TItem[];
  dayValue: string | number;
  onDayChange: (value: string | number) => void;
  containerHeight?: number;
  itemHeight?: number;
  appearAnimation?: boolean;
};

export const WheelPicker = memo(
  ({
    yearItems,
    yearValue,
    onYearChange,
    monthItems,
    monthValue,
    onMonthChange,
    dayItems,
    dayValue,
    onDayChange,
    containerHeight = 210,
    itemHeight = 32,
    appearAnimation = false,
  }: TProps) => {
    return (
      <div
        className={cx(s.container, { [s.appear]: appearAnimation })}
        style={{
          height: `${containerHeight}px`,
        }}
      >
        <WheelColumn
          items={yearItems}
          value={yearValue}
          onChange={onYearChange}
          origin="right"
          itemHeight={itemHeight}
          containerHeight={containerHeight}
        />
        <WheelColumn
          items={monthItems}
          value={monthValue}
          onChange={onMonthChange}
          origin="center"
          itemHeight={itemHeight}
          containerHeight={containerHeight}
        />
        <WheelColumn
          items={dayItems}
          value={dayValue}
          onChange={onDayChange}
          origin="left"
          itemHeight={itemHeight}
          containerHeight={containerHeight}
        />
      </div>
    );
  },
);
