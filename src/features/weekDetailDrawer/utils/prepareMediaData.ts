import { TDay, TMedia, TMediaDatesMap } from '@/types';
import { formatDateToKey } from '@/utils';

import { TMediaItem } from '../types';

type TPrepareMediaDataParams = {
  days: TDay[];
  mediaData?: TMediaDatesMap<TMedia>;
  weekIndex?: number;
};

export const prepareMediaData = ({ days, mediaData, weekIndex }: TPrepareMediaDataParams) => {
  return days.reduce(
    (acc, day, index) => {
      const { media: mediaIndex, dayOfWeek, isWeekPreview, date } = day;

      const baseMediaItem = {
        dayOfWeek,
        mediaIndex: mediaIndex || formatDateToKey(date),
        weekIndex,
        dayIndex: index,
        isWeekPreview,
        ...(mediaIndex ? mediaData?.[mediaIndex] : {}),
      };

      if (isWeekPreview) {
        acc.previewMedia = baseMediaItem;
      } else {
        acc.smallMediaItems.push(baseMediaItem);
      }

      return acc;
    },
    { previewMedia: null as TMediaItem | null, smallMediaItems: [] as TMediaItem[] },
  );
};
