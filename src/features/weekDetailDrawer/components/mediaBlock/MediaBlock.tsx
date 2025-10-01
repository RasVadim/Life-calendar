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

  const smallMediaItems = days
    .filter(({ isWeekPreview }) => !isWeekPreview)
    .map(({ media: mediaIndex, dayOfWeek }) => ({
      dayOfWeek,
      ...(mediaIndex ? mediaData?.[mediaIndex] : {}),
    }));

  const restDay = days.find(({ isWeekPreview }) => isWeekPreview);

  return (
    <div className={s.mediaContainer}>
      <MediaItem item={{ dayOfWeek: restDay?.dayOfWeek, ...mediaData?.[media || ''] }} />

      {smallMediaItems.length > 0 && (
        <div className={s.smallMediaContainer}>
          {smallMediaItems.map((item, index) => (
            <MediaItem
              key={index}
              item={item}
              isSmall
              isFirst={index === 0}
              isLast={index === smallMediaItems.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
