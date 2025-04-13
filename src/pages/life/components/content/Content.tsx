import { FC, useMemo } from 'react';

import { LifeCalendar } from '@/components';
import { USER_AGE, WEEKS_PER_YEAR } from '@/constants';

import s from './s.module.styl';

type PropsType = {};

export const Content: FC<PropsType> = ({}) => {
  const { weeks } = useMemo(() => {
    return [...Array(USER_AGE)].reduce(
      (acc, _, index) => {
        const yearWeeks = [...Array(WEEKS_PER_YEAR)].map((_, i) => ({
          id: 'w' + (i + 1 + index * WEEKS_PER_YEAR),
        }));

        acc.years.push({
          id: 'y' + (index + 1),
          weeks: yearWeeks,
        });

        return {
          years: acc.years,
          weeks: [...acc.weeks, ...yearWeeks],
        };
      },
      { years: [], weeks: [] }
    );
  }, []);

  return (
    <div className={s.content}>
      <LifeCalendar weeks={weeks} />
    </div>
  );
};

export default Content;
