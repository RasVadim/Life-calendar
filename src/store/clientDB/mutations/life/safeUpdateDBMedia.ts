import { lifeCalendarDB } from '@/store/clientDB';
import { TMediasWeekIndxsValues, TMediaDatesMap } from '@/types';

const DEFAULT_MEDIA_DATA = {
  id: 'main',
  media: {} as TMediaDatesMap<TMediasWeekIndxsValues>,
};

/**
 * Safely update media data in IndexedDB.
 * Only updates values if the key doesn't exist or if existing value has no source field.
 * @param data - Media data to safely update
 */
export const safeUpdateDBMedia = async (data: TMediaDatesMap<TMediasWeekIndxsValues>) => {
  let prev = await lifeCalendarDB.media.get('main');
  if (!prev) {
    // Create new media if not exists
    prev = DEFAULT_MEDIA_DATA;
  }

  // Create new media object with safe updates
  const updatedMedia: TMediaDatesMap<TMediasWeekIndxsValues> = { ...prev.media };

  // Process each key-value pair from incoming data
  Object.entries(data).forEach(([key, newValue]) => {
    const existingValue = updatedMedia[key];

    // If key doesn't exist or existing value has no source field, update it
    if (!existingValue || !existingValue.source) {
      updatedMedia[key] = newValue;
    }
    // If existing value has source field, keep it unchanged
  });

  await lifeCalendarDB.media.put({
    media: updatedMedia,
    id: 'main',
  });
};
