import { FC } from 'react';

import { LifeGrid } from '@/components';
import { WeekDetailDrawer } from '@/features';
import { usePageLoading } from '@/store/atoms';
import { useDBDrawWeekIndexes, useDBTodayWeek, useDBMedia } from '@/store/clientDB';
import { PageLoadingHolder } from '@/ui-kit/pageLoadingHolder/PageLoadingHolder';

import s from './s.module.styl';

export const Content: FC = () => {
  const drawWeekIndexes = useDBDrawWeekIndexes();
  const today = useDBTodayWeek();
  const { media } = useDBMedia();
  const [pageLoading] = usePageLoading();

  if (!drawWeekIndexes || pageLoading || !today.todayWeekIndex) {
    return <PageLoadingHolder />;
  }

  return (
    <div className={s.content}>
      <LifeGrid drawWeekIndexes={drawWeekIndexes} today={today} media={media} />
      <WeekDetailDrawer mediaData={media} />
    </div>
  );
};

export default Content;
