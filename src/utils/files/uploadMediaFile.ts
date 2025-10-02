import { addFile, TAddFileOptions } from './addFile';
import { connectFileToMedia } from './connectFileToMedia';
import { connectMediaToDay } from './connectMediaToDay';

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
    onSuccess: (fileId, isVideo, size) => {
      connectFileToMedia({ dateKey, fileId, isVideo, size });
      connectMediaToDay({ weekIndex, dayIndex, dateKey });
      options.onSuccess?.(fileId, isVideo, size);
    },
  });
};
