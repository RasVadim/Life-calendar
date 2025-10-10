import { addDBMediaItem } from '@/store/clientDB';

type TConnectFileToMediaOptions = {
  dateKey: string;
  fileId: string;
  isVideo: boolean;
  size: number;
};

export const connectFileToMedia = async ({
  dateKey,
  fileId,
  isVideo,
  size,
}: TConnectFileToMediaOptions) => {
  // Save media metadata
  const metaMediaItem = {
    fileId,
    isVideo,
    source: 'LC' as const,
    width: undefined,
    height: undefined,
    duration: undefined,
    size,
    createdAt: new Date().toISOString(),
  };

  await addDBMediaItem(dateKey, metaMediaItem);
};
