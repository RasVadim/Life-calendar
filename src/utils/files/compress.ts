import { compressImageWithWorker } from './compressImage/compressImageWithWorker';
import { compressVideo } from './compressVideo/compressVideo';

export const compress = async (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  const flags = { isImage, isVideo };

  if (isImage) {
    return { ...flags, ...(await compressImageWithWorker(file)) };
  }

  if (isVideo) {
    return { ...flags, ...(await compressVideo(file)) };
  }

  return { ...flags, compressedFile: file, thumbnail: file };
};
