import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { IFileBlob } from '../../interfaces';

/**
 * React hook to get a file blob by its ID from IndexedDB reactively
 * @param fileId - The ID of the file blob to retrieve
 * @returns {IFileBlob | undefined} The file blob object or undefined if not found
 */
export const useDBFileBlob = (fileId?: string): IFileBlob | undefined => {
  return useLiveQuery(() => (fileId ? lifeCalendarDB.fileBlobs.get(fileId) : undefined), [fileId]);
};
