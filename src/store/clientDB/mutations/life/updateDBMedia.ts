import { lifeCalendarDB } from '@/store/clientDB';
import { TMedia, TWeekIndxsMap } from '@/types';

const DEFAULT_MEDIA_DATA = {
  id: 'main',
  media: {} as TWeekIndxsMap<TMedia>,
};

/**
 * Update media data in IndexedDB by merging with existing data.
 * @param data - Media data to merge with existing data
 */
export const updateDBMedia = async (data: TWeekIndxsMap<TMedia>) => {
  let prev = await lifeCalendarDB.media.get('main');
  if (!prev) {
    // Create new media if not exists
    prev = DEFAULT_MEDIA_DATA;
  }
  await lifeCalendarDB.media.put({
    media: {
      ...prev.media,
      ...data,
    },
    id: 'main',
  });
};
