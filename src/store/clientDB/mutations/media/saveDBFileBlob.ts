import { lifeCalendarDB } from '@/store/clientDB';

import { IFileBlob } from '../../interfaces';

/**
 * Save a file blob to IndexedDB
 * @param fileId - Unique identifier for the file (e.g., '19940224p' for photo, '19940224v' for video)
 * @param blob - The file blob data to store
 * @returns {Promise<string>} The ID of the saved file blob
 */
export const saveDBFileBlob = async (fileId: string, blob: Blob): Promise<string> => {
  const fileBlob: IFileBlob = {
    id: fileId,
    blob: blob,
  };

  await lifeCalendarDB.fileBlobs.put(fileBlob);
  return fileId;
};
