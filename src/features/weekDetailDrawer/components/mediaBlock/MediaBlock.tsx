import { FC } from 'react';

import cx from 'classnames';

import { IWeek } from '@/store/clientDB';
import { TMedia, TMediaDatesMap } from '@/types';

import { prepareMediaData } from '../../utils/prepareMediaData';
import { MediaItem } from '../mediaItem/MediaItem';

import s from './s.module.styl';

type TProps = {
  week?: IWeek;
  mediaData?: TMediaDatesMap<TMedia>;
};

export const MediaBlock: FC<TProps> = ({ week, mediaData }) => {
  const { days = [], index } = week || {};

  const { previewMedia, smallMediaItems } = prepareMediaData({ days, mediaData, weekIndex: index });

  const isOnlyOneDay = smallMediaItems.length === 0;

  return (
    <div className={cx(s.mediaContainer, { [s.bottomRadius]: isOnlyOneDay })}>
      <MediaItem item={previewMedia} isOnlyOne={isOnlyOneDay} key={previewMedia?.mediaIndex} />

      {smallMediaItems.length > 0 && (
        <div className={s.smallMediaContainer}>
          {smallMediaItems.map((item, index) => (
            <MediaItem
              key={item.mediaIndex}
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
