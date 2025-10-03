import { lifeCalendarDB } from '@/store/clientDB';
import { TMedia, TMediaDatesMap } from '@/types';

/**
 * Update media data using direct modification
 * Tries modification first, creates record only if it doesn't exist
 * @param data - Media data to merge with existing data
 */
export const updateDBMedia = async (data: TMediaDatesMap<TMedia>) => {
  try {
    // Try direct modification first (fastest path)
    await lifeCalendarDB.media
      .where('id')
      .equals('main')
      .modify((record) => {
        Object.assign(record.media, data);
      });
  } catch {
    // If record doesn't exist, create it
    await lifeCalendarDB.media.put({
      id: 'main',
      media: data,
    });
  }
};
