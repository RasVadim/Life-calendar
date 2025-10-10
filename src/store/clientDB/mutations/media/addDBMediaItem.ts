import { lifeCalendarDB } from '@/store/clientDB';
import { TMedia } from '@/types';

/**
 * Add a single media item using direct modification
 * Tries modification first, creates record only if it doesn't exist
 * @param dateKey - Date in format '19981224' (without extension)
 * @param mediaItem - Media metadata to add
 */
export const addDBMediaItem = async (dateKey: string, mediaItem: TMedia) => {
  try {
    // Try direct modification first (fastest path)
    await lifeCalendarDB.media
      .where('id')
      .equals('main')
      .modify((record) => {
        record.media[dateKey] = mediaItem;
      });
  } catch {
    // If record doesn't exist, create it
    await lifeCalendarDB.media.put({
      id: 'main',
      media: { [dateKey]: mediaItem },
    });
  }
};
