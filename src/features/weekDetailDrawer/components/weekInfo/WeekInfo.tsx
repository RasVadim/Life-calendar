import { FC } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { IWeek } from '@/store/clientDB';
import { checkEvenMonth } from '@/utils';

import s from './s.module.styl';

type TProps = {
  week?: IWeek;
};

export const WeekInfo: FC<TProps> = ({ week }) => {
  const { t } = useTranslation();

  const { description, month, year, dateStart, dateEnd, secondMonth } = week || {};

  const monthLabel = t(`life.${month}`);
  const secondMonthLabel = secondMonth ? t(`life.${secondMonth}`) : '';

  const dates = `${dateStart?.slice(8, 10)} - ${dateEnd?.slice(8, 10)}`;

  const isEvenMonth = checkEvenMonth(month);

  return (
    <div className={s.wrapper}>
      <div className={s.title}>
        <div className={s.year}>{year}</div>
        <div className={cx(s.month, { [s.secondColor]: isEvenMonth })}>{monthLabel}</div>
        <div className={s.dates}>{dates}</div>
        {secondMonthLabel && <div className={s.month}>{secondMonthLabel}</div>}
      </div>
      <div className={s.description}>{description}</div>
    </div>
  );
};
