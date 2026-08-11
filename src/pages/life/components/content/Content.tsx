import { FC } from 'react';

import { SnailGrid } from '@/components/lifeGrid/snail';
import { usePageLoading } from '@/store/atoms';
import { useDBDrawWeekIndexes, useDBTodayWeek, useDBMedia } from '@/store/clientDB';
import { PageLoadingHolder } from '@/ui-kit/pageLoadingHolder/PageLoadingHolder';

import s from './s.module.styl';

export const Content: FC = () => {
  const drawWeekIndexes = useDBDrawWeekIndexes();
  const today = useDBTodayWeek();
  const mediaData = useDBMedia();
  const [pageLoading] = usePageLoading();

  if (!drawWeekIndexes || pageLoading || !today.todayWeekIndex) {
    return <PageLoadingHolder />;
  }

  return (
    <div className={s.content}>
      <SnailGrid drawWeekIndexes={drawWeekIndexes} today={today} media={mediaData?.media || {}} />
    </div>
  );
};

export default Content;
