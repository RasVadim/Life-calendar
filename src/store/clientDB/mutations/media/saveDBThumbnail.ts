import { lifeCalendarDB } from '@/store/clientDB';

import { IThumbnailBlob } from '../../interfaces';

/**
 * Save a thumbnail blob to IndexedDB
 * @param fileId - Unique identifier for the file (e.g., '19940224p' for photo, '19940224v' for video)
 * @param thumbnail - The thumbnail blob data to store
 * @returns {Promise<string>} The ID of the saved thumbnail
 */
export const saveDBThumbnail = async (fileId: string, thumbnail: Blob): Promise<string> => {
  const thumbnailBlob: IThumbnailBlob = {
    id: fileId,
    thumbnail: thumbnail,
  };

  await lifeCalendarDB.thumbnails.put(thumbnailBlob);
  return fileId;
};
