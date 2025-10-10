import { FC } from 'react';

import cx from 'classnames';

import { useTranslation, useZodiacIconSet } from '@/hooks';
import { LeapIcon } from '@/icons';
import { TWeekZodiac } from '@/types';
import { checkEvenMonth } from '@/utils';

import s from './s.module.styl';

type TWeekTitleProps = {
  year: string;
  secondYear?: string | null;
  month: string;
  secondMonth?: string | null;
  dates: string;
  isLeapYear: boolean;
  yearZodiacLabel?: TWeekZodiac | null;
};

export const WeekTitle: FC<TWeekTitleProps> = ({
  year,
  secondYear,
  month,
  secondMonth,
  dates,
  isLeapYear,
  yearZodiacLabel,
}) => {
  const { t } = useTranslation();

  const zodiacIconSet = useZodiacIconSet({ jsx: true, first: true });
  const ZodiacIcon = zodiacIconSet?.[yearZodiacLabel as TWeekZodiac];
  const isEvenMonth = checkEvenMonth(month);

  const monthLabel = t(`life.${month}`);
  const secondMonthLabel = secondMonth ? t(`life.${secondMonth}`) : '';

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
