import { lifeCalendarDB } from '@/store/clientDB';
import { TMedia, TMediaDatesMap } from '@/types';

const DEFAULT_MEDIA_DATA = {
  id: 'main',
  media: {} as TMediaDatesMap<TMedia>,
};

/**
 * Add a single media item to IndexedDB
 * @param date - Date in format '19981224' (without extension)
 * @param mediaItem - Media metadata to add
 */
export const addDBMediaItem = async (dateKey: string, mediaItem: TMedia) => {
  let prev = await lifeCalendarDB.media.get('main');
  if (!prev) {
    // Create new media if not exists
    prev = DEFAULT_MEDIA_DATA;
  }

  // Create updated media object
  const updatedMedia: TMediaDatesMap<TMedia> = {
    ...prev.media,
    [dateKey]: mediaItem,
  };

  await lifeCalendarDB.media.put({
    media: updatedMedia,
    id: 'main',
  });
};
