import { addFile, TAddFileOptions } from './addFile';
import { connectFileToMedia } from './connectFileToMedia';
import { connectMediaToDay } from './connectMediaToDay';
import { updatePreviewFlags } from './updatePreviewFlags/updatePreviewFlags';

type TUploadMediaFileOptions = TAddFileOptions & {
  dateKey?: string | null;
  weekIndex?: number;
  dayIndex?: number;
};

export const uploadMediaFile = async ({
  dateKey,
  weekIndex,
  dayIndex,
  ...options
}: TUploadMediaFileOptions) => {
  if (!dateKey) return;

  addFile(dateKey, {
    ...options,
    onSuccess: async (fileId, isVideo, size) => {
      await connectFileToMedia({ dateKey, fileId, isVideo, size });
      connectMediaToDay({ weekIndex, dayIndex, dateKey });
      // Update preview flags for week, month, and season
      updatePreviewFlags({ dateKey, weekIndex, dayIndex });

      options.onSuccess?.(fileId, isVideo, size);
    },
  });
};
