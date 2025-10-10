import createPica from 'pica';

const pica = createPica();

/**
 * Convert canvas to Blob with fallback support for older browsers
 * @param canvas - HTML canvas element to convert
 * @param type - MIME type for the output blob (e.g., 'image/jpeg', 'image/webp')
 * @param quality - Quality value between 0 and 1 (0 = lowest quality, 1 = highest quality)
 * @returns Promise that resolves to a Blob containing the canvas data
 */
export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!canvas.toBlob) {
      // fallback using pica.toBlob shim if necessary
      pica
        .toBlob(canvas, type, quality)
        .then((b: Blob) => resolve(b))
        .catch(reject);
      return;
    }
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('canvas.toBlob returned null'));
      },
      type,
      quality,
    );
  });
};
