import exifr from 'exifr';

import { CompressImageWorkerResult } from '@/webWorkers';

import { CompressResult } from './types';

/**
 * Process image compression using Web Worker
 * @param file - Original image file to compress
 * @param opts - Compression options
 * @param preferWebp - Whether to prefer WebP format
 * @returns Promise with compressed image and thumbnail blobs
 */
export const processImageInWorker = async (
  file: File,
  opts: { maxSide?: number; thumbSize?: number; quality?: number },
  preferWebp: boolean,
): Promise<CompressResult> => {
  const maxSide = opts.maxSide ?? 2048;
  const thumbSize = opts.thumbSize ?? 256;
  const quality = opts.quality ?? 0.9;

  // Read EXIF orientation in main thread (lightweight operation)
  const orientation = (await exifr.orientation(file).catch(() => 1)) || 1;

  // Convert file to ArrayBuffer for worker
  const imageData = await file.arrayBuffer();

  // Create worker
  const worker = new Worker(
    new URL('@/webWorkers/compressImageWorker/compressImage.worker.ts', import.meta.url),
    { type: 'module' },
  );

  // Send data to worker
  const workerPromise = new Promise<CompressImageWorkerResult>((resolve, reject) => {
    worker.onmessage = (e) => {
      const response = e.data;
      worker.terminate();

      if (response.type === 'success' && response.data) {
        const { compressedData, thumbnailData, compressedFileName, thumbnailFileName } =
          response.data;

        resolve({
          compressedFile: new Blob([compressedData], {
            type: preferWebp ? 'image/webp' : 'image/jpeg',
          }),
          thumbnail: new Blob([thumbnailData], {
            type: preferWebp ? 'image/webp' : 'image/jpeg',
          }),
          compressedFileName,
          thumbnailFileName,
        });
      } else {
        reject(new Error(response.error || 'Worker compression failed'));
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };

    // Send compression task to worker
    worker.postMessage({
      type: 'compress',
      data: {
        imageData,
        fileName: file.name,
        mimeType: file.type,
        orientation,
        maxSide,
        thumbSize,
        quality,
        preferWebp,
      },
    });
  });

  return await workerPromise;
};
