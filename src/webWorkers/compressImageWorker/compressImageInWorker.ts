import createPica from 'pica';

import { calculateDimensions } from '@/utils/files/compressImage/calculateDimensions';
import { calculateSmartCrop } from '@/utils/files/compressImage/calculateSmartCrop';

import { CompressImageWorkerMessage, CompressImageWorkerResponse } from './types';

// Create Pica instance with OffscreenCanvas support
const pica = createPica({
  createCanvas: (width: number, height: number) =>
    new OffscreenCanvas(width, height) as unknown as HTMLCanvasElement,
});

/**
 * Process image compression in Web Worker
 * Handles heavy computational tasks: resizing, cropping, EXIF processing
 * Uses OffscreenCanvas for canvas operations without DOM
 */
export const compressImageInWorker = async (
  message: CompressImageWorkerMessage['data'],
): Promise<CompressImageWorkerResponse> => {
  try {
    const { imageData, fileName, mimeType, orientation, maxSide, thumbSize, quality, preferWebp } =
      message;

    // Create ImageBitmap from ArrayBuffer
    const blob = new Blob([imageData], { type: mimeType });
    const bitmap = await createImageBitmap(blob);

    // Create OffscreenCanvas for orientation correction
    const srcCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const srcCtx = srcCanvas.getContext('2d')!;

    // Apply orientation correction
    if (orientation >= 5 && orientation <= 8) {
      srcCanvas.width = bitmap.height;
      srcCanvas.height = bitmap.width;
    } else {
      srcCanvas.width = bitmap.width;
      srcCanvas.height = bitmap.height;
    }

    // Apply transforms based on orientation
    switch (orientation) {
      case 2:
        srcCtx.translate(srcCanvas.width, 0);
        srcCtx.scale(-1, 1);
        break;
      case 3:
        srcCtx.translate(srcCanvas.width, srcCanvas.height);
        srcCtx.rotate(Math.PI);
        break;
      case 4:
        srcCtx.translate(0, srcCanvas.height);
        srcCtx.scale(1, -1);
        break;
      case 5:
        srcCtx.rotate(0.5 * Math.PI);
        srcCtx.scale(1, -1);
        break;
      case 6:
        srcCtx.rotate(0.5 * Math.PI);
        srcCtx.translate(0, -bitmap.height);
        break;
      case 7:
        srcCtx.rotate(0.5 * Math.PI);
        srcCtx.translate(bitmap.width, -bitmap.height);
        srcCtx.scale(-1, 1);
        break;
      case 8:
        srcCtx.rotate(-0.5 * Math.PI);
        srcCtx.translate(-bitmap.width, 0);
        break;
      default:
        break;
    }

    srcCtx.drawImage(bitmap, 0, 0);
    bitmap.close();

    // --- Compressed image ---
    const { width: compW, height: compH } = calculateDimensions(
      srcCanvas.width,
      srcCanvas.height,
      maxSide,
    );

    const compCanvas = new OffscreenCanvas(compW, compH);
    await pica.resize(
      srcCanvas as unknown as HTMLCanvasElement,
      compCanvas as unknown as HTMLCanvasElement,
      {
        quality: 3, // best
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      },
    );

    // Check WebP support in worker context
    let compressedMime = 'image/jpeg';
    try {
      if (preferWebp) {
        const testBlob = await compCanvas.convertToBlob({ type: 'image/webp' });
        if (testBlob.type === 'image/webp') {
          compressedMime = 'image/webp';
        }
      }
    } catch {
      // WebP not supported in worker, fallback to JPEG
      compressedMime = 'image/jpeg';
    }

    const compressedBlob = await compCanvas.convertToBlob({
      type: compressedMime,
      quality,
    });
    const compressedData = await compressedBlob.arrayBuffer();

    // --- Thumbnail ---
    const { sourceX, sourceY, sourceSize } = calculateSmartCrop(srcCanvas.width, srcCanvas.height);

    const thumbSource = new OffscreenCanvas(sourceSize, sourceSize);
    const thumbSourceCtx = thumbSource.getContext('2d')!;
    thumbSourceCtx.drawImage(
      srcCanvas,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      sourceSize,
      sourceSize,
    );

    const thumbCanvas = new OffscreenCanvas(thumbSize, thumbSize);
    await pica.resize(
      thumbSource as unknown as HTMLCanvasElement,
      thumbCanvas as unknown as HTMLCanvasElement,
      {
        quality: 3,
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      },
    );

    // Use same MIME type for thumbnail as compressed image
    const thumbMime = compressedMime;
    const thumbnailBlob = await thumbCanvas.convertToBlob({
      type: thumbMime,
      quality: 0.9,
    });
    const thumbnailData = await thumbnailBlob.arrayBuffer();

    // Generate filenames based on actual MIME type used
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const fileExtension = compressedMime === 'image/webp' ? 'webp' : 'jpg';
    const compressedFileName = `${baseName}-compressed.${fileExtension}`;
    const thumbnailFileName = `${baseName}-thumb.${fileExtension}`;

    return {
      type: 'success',
      data: {
        compressedData,
        thumbnailData,
        compressedFileName,
        thumbnailFileName,
      },
    };
  } catch (error) {
    return {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
