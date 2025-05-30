import { FC } from 'react';

import { LifeCalendar } from '@/components';
import { useDBWeeks } from '@/store/clientDB';

import s from './s.module.styl';

export const Content: FC = () => {
  const weeks = useDBWeeks();

  return (
    <div className={s.content}>
      <LifeCalendar weeks={weeks} />
    </div>
  );
};

export default Content;
