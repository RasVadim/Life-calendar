import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { IFileBlob } from '../../interfaces';

type TUseDBFileBlobParams = {
  fileId?: string;
  enabled?: boolean;
};
/**
 * React hook to get a file blob by its ID from IndexedDB reactively
 * @param fileId - The ID of the file blob to retrieve
 * @param enabled - Whether to fetch the file blob (default: true)
 * @returns {IFileBlob | undefined} The file blob object or undefined if not found
 */
export const useDBFileBlob = ({
  fileId,
  enabled = true,
}: TUseDBFileBlobParams): Partial<IFileBlob> => {
  const result = useLiveQuery(
    () => (enabled && fileId ? lifeCalendarDB.fileBlobs.get(fileId) : undefined),
    [fileId, enabled],
  );
  return result || {};
};
