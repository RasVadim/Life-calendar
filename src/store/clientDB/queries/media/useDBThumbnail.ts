import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { IThumbnailBlob } from '../../interfaces';

type TUseDBThumbnailParams = {
  fileId?: string;
  enabled?: boolean;
};

/**
 * React hook to get a thumbnail by its ID from IndexedDB reactively
 * @param fileId - The ID of the thumbnail to retrieve
 * @param enabled - Whether to fetch the thumbnail (default: true)
 * @returns {IThumbnail | undefined} The thumbnail object or undefined if not found
 */
export const useDBThumbnail = ({
  fileId,
  enabled = true,
}: TUseDBThumbnailParams): Partial<IThumbnailBlob> => {
  const result = useLiveQuery(
    () => (enabled && fileId ? lifeCalendarDB.thumbnails.get(fileId) : undefined),
    [fileId, enabled],
  );
  return result || {};
};
