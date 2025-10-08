import { FC } from 'react';

import cx from 'classnames';

import { useZodiacIconSet } from '@/hooks';
import { LeapIcon } from '@/icons';
import { TWeekZodiac } from '@/types';

import s from './s.module.styl';

type TWeekTitleProps = {
  year: string;
  secondYear?: string | null;
  monthLabel: string;
  secondMonthLabel?: string;
  dates: string;
  isLeapYear: boolean;
  isEvenMonth: boolean;
  yearZodiacLabel?: TWeekZodiac | null;
};

export const WeekTitle: FC<TWeekTitleProps> = ({
  year,
  secondYear,
  monthLabel,
  secondMonthLabel,
  dates,
  isLeapYear,
  isEvenMonth,
  yearZodiacLabel,
}) => {
  const zodiacIconSet = useZodiacIconSet({ jsx: true, first: true });
  const ZodiacIcon = zodiacIconSet?.[yearZodiacLabel as TWeekZodiac];

  return (
    <div className={cx(s.title, { [s.secondColor]: isEvenMonth })}>
      <div className={s.year}>
        {ZodiacIcon && <ZodiacIcon size={'14'} />}
        {isLeapYear && (
          <div className={s.leapIcon}>
            <LeapIcon size={'14'} />
          </div>
        )}

        {year}
      </div>
      <div className={cx(s.month, { [s.secondColor]: isEvenMonth })}>{monthLabel}</div>
      <div className={s.dates}>{dates}</div>
      {secondMonthLabel && (
        <div className={cx(s.month, { [s.secondColor]: !isEvenMonth })}>{secondMonthLabel}</div>
      )}
      {secondYear && <div className={s.year}>{secondYear}</div>}
    </div>
  );
};
