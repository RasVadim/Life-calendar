/**
 * Draw ImageBitmap to canvas with EXIF orientation correction
 * Handles all 8 EXIF orientation values (1-8) with proper transforms
 * @param bitmap - ImageBitmap to draw
 * @param orientation - EXIF orientation value (1-8)
 * @returns HTMLCanvasElement with correctly oriented image
 */
export const drawBitmapToCanvasWithOrientation = (
  bitmap: ImageBitmap,
  orientation: number,
): HTMLCanvasElement => {
  // orientation: 1..8 (exif)
  const w = bitmap.width;
  const h = bitmap.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  if (orientation >= 5 && orientation <= 8) {
    canvas.width = h;
    canvas.height = w;
  } else {
    canvas.width = w;
    canvas.height = h;
  }

  // apply transforms
  switch (orientation) {
    case 2:
      // horizontal flip
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      // 180°
      ctx.translate(canvas.width, canvas.height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      // vertical flip
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      break;
    case 5:
      // transpose
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      // 90° CW
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -h);
      break;
    case 7:
      // transverse
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(w, -h);
      ctx.scale(-1, 1);
      break;
    case 8:
      // 90° CCW
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-w, 0);
      break;
    default:
      break;
  }

  ctx.drawImage(bitmap, 0, 0);
  return canvas;
};
