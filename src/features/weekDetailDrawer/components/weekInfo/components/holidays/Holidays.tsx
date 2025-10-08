import { FC } from 'react';

import { HolidayIcon } from '@/icons';

import s from './s.module.styl';

type THolidaysProps = {
  holidaysText?: string;
};

export const Holidays: FC<THolidaysProps> = ({ holidaysText }) => {
  if (!holidaysText) return null;

  return (
    <div className={s.holidays}>
      <HolidayIcon size={'14'} />
      <div className={s.holidaysList}>
        <span className={s.holidayItem}>{holidaysText}</span>
      </div>
    </div>
  );
};
