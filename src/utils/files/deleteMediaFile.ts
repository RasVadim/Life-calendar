import { lifeCalendarDB } from '@/store/clientDB';
import { updateDBDay } from '@/store/clientDB/mutations/life/updateDBDay';

// import { updatePreviewFlags } from './updatePreviewFlags/updatePreviewFlags';

type TDeleteMediaFileOptions = {
  dateKey: string;
  weekIndex?: number;
  dayIndex?: number;
};

/**
 * Delete media file and all related data from IndexedDB
 * @param options - Configuration options for media deletion
 */
export const deleteMediaFile = async ({
  dateKey,
  weekIndex,
  dayIndex,
}: TDeleteMediaFileOptions) => {
  if (!dateKey) {
    console.error('Date key is required for media deletion');
    return;
  }

  try {
    // Generate file IDs for both image and video
    const imageFileId = `${dateKey}p`;
    const videoFileId = `${dateKey}v`;

    // Delete file blobs and thumbnails
    await Promise.all([
      lifeCalendarDB.fileBlobs.delete(imageFileId),
      lifeCalendarDB.fileBlobs.delete(videoFileId),
      lifeCalendarDB.thumbnails.delete(imageFileId),
      lifeCalendarDB.thumbnails.delete(videoFileId),
    ]);

    // Remove media metadata
    await lifeCalendarDB.media
      .where('id')
      .equals('main')
      .modify((record) => {
        delete record.media[dateKey];
      });

    // Remove media reference from day if coordinates provided
    if (typeof weekIndex === 'number' && typeof dayIndex === 'number') {
      updateDBDay({
        weekIndex,
        dayIndex,
        dayUpdates: { media: null },
      });

      // Update preview flags after media removal
      // updatePreviewFlags({ dateKey, weekIndex, dayIndex });
    }
  } catch (error) {
    console.error('Error deleting media file:', error);
    throw error;
  }
};
