import { FC } from 'react';

import { LifeGrid } from '@/components';
import { usePageLoading } from '@/store/atoms';
import { useDBWeeks } from '@/store/clientDB';
import { PageLoadingHolder } from '@/ui-kit/pageLoadingHolder/PageLoadingHolder';

import s from './s.module.styl';

export const Content: FC = () => {
  const weeks = useDBWeeks();
  const [pageLoading] = usePageLoading();

  if (!weeks.length && pageLoading) {
    return <PageLoadingHolder />;
  }

  return (
    <div className={s.content}>
      <LifeGrid weeks={weeks} />
    </div>
  );
};

export default Content;
