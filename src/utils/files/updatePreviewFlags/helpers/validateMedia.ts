import { TMedia } from '@/types';

/**
 * Validates if media object has valid fileId and checks preview flags
 */
export const validateMedia = (media: TMedia, dateKey: string) => {
  const validFileId = media?.fileId && !media.fileId.startsWith(dateKey);
  return {
    hasFileId: Boolean(validFileId),
    isWeekPreview: Boolean(media?.isWeekPreview),
    isMonthPreview: Boolean(media?.isMonthPreview),
    isSeasonPreview: Boolean(media?.isSeasonPreview),
  };
};
