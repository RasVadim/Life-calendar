import { checkVideoFormatSupport } from './checkVideoFormatSupport';
import { detectVideoFormat } from './detectVideoFormat';

export const compressVideo = async (file: File) => {
  // Check if browser can process this video format
  const isSupported = await checkVideoFormatSupport(file);

  if (!isSupported) {
    const format = detectVideoFormat(file);
    throw new Error(
      `UNSUPPORTED_FORMAT:${format.container}, or one of the following codecs: ${format.codec}`,
    );
  }

  // For now, return original file (will implement compression later)
  const compressedFile = file;
  const thumbnail = file;
  return { compressedFile, thumbnail };
};
