import { FC } from 'react';

import { IWeek } from '@/store/clientDB';
import { TMedia, TMediaDatesMap } from '@/types';

import { MediaItem } from '../mediaItem/MediaItem';

import s from './s.module.styl';

type TProps = {
  week?: IWeek;
  mediaData?: TMediaDatesMap<TMedia>;
};

export const MediaBlock: FC<TProps> = ({ week, mediaData }) => {
  const { days = [], media } = week || {};

  console.log('days', days);

  const smallMediaItems = days
    .filter(({ isWeekPreview }) => !isWeekPreview)
    .map(({ media: mediaIndex }) => (mediaIndex ? mediaData?.[mediaIndex] : {}));

  console.log('smallMediaItems', smallMediaItems);

  return (
    <div className={s.mediaContainer}>
      <MediaItem media={mediaData?.[media || '']} />

      {smallMediaItems.length > 0 && (
        <div className={s.smallMediaContainer}>
          {smallMediaItems.slice(0, 6).map((item, index) => (
            <MediaItem key={index} media={item} isSmall />
          ))}
        </div>
      )}
    </div>
  );
};
