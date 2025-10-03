import { TDay, TMedia, TMediaDatesMap } from '@/types';
import { formatDateToKey } from '@/utils';

import { TMediaItem } from '../types';

type TPrepareMediaDataParams = {
  days: TDay[];
  mediaData?: TMediaDatesMap<TMedia>;
  weekIndex?: number;
};

export const prepareMediaData = ({ days, mediaData, weekIndex }: TPrepareMediaDataParams) => {
  const result = days.reduce(
    (acc, day, index) => {
      const { media: mediaIndex, dayOfWeek, date } = day;

      const isWeekPreview = mediaIndex ? mediaData?.[mediaIndex]?.isWeekPreview : false;

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

  if (!result.previewMedia) {
    result.previewMedia = result.smallMediaItems[0];
    result.smallMediaItems = result.smallMediaItems.slice(1);
  }

  return result;
};
