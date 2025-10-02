import exifr from 'exifr';
import createPica from 'pica';

import { calculateDimensions } from './calculateDimensions';
import { calculateSmartCrop } from './calculateSmartCrop';
import { canvasToBlob } from './canvasToBlob';
import { checkWebpSupported } from './checkWebpSupported';
import { drawBitmapToCanvasWithOrientation } from './drawBitmapToCanvasWithOrientation';
import { loadImageViaObjectURL } from './loadImageViaObjectURL';
import { CompressResult } from './types';

const pica = createPica();

/**
 * Main entry point for image compression
 * Compresses image to specified size and creates thumbnail with smart cropping
 * Uses Pica for high-quality resizing and EXIF orientation correction
 * @param file - Original image file to compress
 * @param opts - Compression options
 * @param opts.maxSide - Maximum side length for compressed image (default: 2048)
 * @param opts.thumbSize - Thumbnail size in pixels (default: 256)
 * @param opts.quality - Compression quality 0-1 (default: 0.9)
 * @returns Promise with compressed image and thumbnail blobs
 */
export const compressImage = async (
  file: File,
  opts: { maxSide?: number; thumbSize?: number; quality?: number } = {},
): Promise<CompressResult> => {
  const maxSide = opts.maxSide ?? 2048;
  const thumbSize = opts.thumbSize ?? 256;
  const quality = opts.quality ?? 0.9;

  const preferWebp = checkWebpSupported();

  let bitmap: ImageBitmap | null = null;
  let tempUrl: string | null = null;

  try {
    // read EXIF orientation (1..8)
    const orientation = (await exifr.orientation(file).catch(() => 1)) || 1;

    // create ImageBitmap if supported
    try {
      bitmap = await createImageBitmap(file);
    } catch (err) {
      // fallback to Image element if browser can't decode via createImageBitmap
      const img = await loadImageViaObjectURL(file);
      // draw img into a canvas to get ImageBitmap
      const tmp = document.createElement('canvas');
      tmp.width = img.naturalWidth;
      tmp.height = img.naturalHeight;
      const tctx = tmp.getContext('2d')!;
      tctx.drawImage(img, 0, 0);
      bitmap = await createImageBitmap(tmp);
      // cleanup
      img.src = '';
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
        tempUrl = null;
      }
      tmp.width = tmp.height = 0;
    }

    // draw oriented bitmap to an "oriented" source canvas
    const srcCanvas = drawBitmapToCanvasWithOrientation(bitmap, orientation);

    // --- compressed image ---
    const { width: compW, height: compH } = calculateDimensions(
      srcCanvas.width,
      srcCanvas.height,
      maxSide,
    );
    const compCanvas = document.createElement('canvas');
    compCanvas.width = compW;
    compCanvas.height = compH;

    await pica.resize(srcCanvas, compCanvas, {
      quality: 3, // best
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2,
    });

    const mime = preferWebp ? 'image/webp' : 'image/jpeg';
    const compressedBlob = await canvasToBlob(compCanvas, mime, quality);

    // --- thumbnail ---
    const { sourceX, sourceY, sourceSize } = calculateSmartCrop(srcCanvas.width, srcCanvas.height);
    const thumbSource = document.createElement('canvas');
    thumbSource.width = sourceSize;
    thumbSource.height = sourceSize;
    const sctx = thumbSource.getContext('2d')!;
    sctx.drawImage(
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

    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = thumbSize;
    thumbCanvas.height = thumbSize;

    await pica.resize(thumbSource, thumbCanvas, {
      quality: 3,
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2,
    });

    const thumbMime = preferWebp ? 'image/webp' : 'image/jpeg';
    const thumbnailBlob = await canvasToBlob(thumbCanvas, thumbMime, 0.9);

    // filenames (optional)
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const compressedFileName = `${baseName}-compressed.${preferWebp ? 'webp' : 'jpg'}`;
    const thumbnailFileName = `${baseName}-thumb.${preferWebp ? 'webp' : 'jpg'}`;

    return {
      compressedFile: compressedBlob,
      thumbnail: thumbnailBlob,
      compressedFileName,
      thumbnailFileName,
    };
  } finally {
    // cleanup
    if (bitmap) {
      try {
        (bitmap as ImageBitmap).close();
      } catch {
        // ignore cleanup errors
      }
    }
    if (tempUrl) {
      try {
        URL.revokeObjectURL(tempUrl);
      } catch {
        // ignore cleanup errors
      }
    }
  }
};
