import { checkFileFormatSupported } from './checkFileFormatSupported';
import { checkWebpSupported } from './checkWebpSupported';
import { checkWorkerSupported } from './checkWorkerSupported';
import { processImageInWorker } from './processImageInWorker';
import { CompressResult } from './types';

/**
 * Compress image using Web Worker for heavy operations
 * Falls back to main thread if worker is not supported
 * @param file - Original image file to compress
 * @param opts - Compression options
 * @returns Promise with compressed image and thumbnail blobs
 */
export const compressImageWithWorker = async (
  file: File,
  opts: { maxSide?: number; thumbSize?: number; quality?: number } = {},
): Promise<CompressResult> => {
  const preferWebp = checkWebpSupported();

  const isWorkerAvalible = checkFileFormatSupported(file) && checkWorkerSupported();

  if (!isWorkerAvalible) {
    const { compressImage } = await import('./compressImage');
    return compressImage(file, opts);
  }

  try {
    return await processImageInWorker(file, opts, preferWebp);
  } catch (error) {
    // Fallback to main thread if worker fails
    console.warn('Worker compression failed, falling back to main thread:', error);
    const { compressImage } = await import('./compressImage');
    return compressImage(file, opts);
  }
};
