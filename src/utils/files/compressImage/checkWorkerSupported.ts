/**
 * Check if Web Worker with OffscreenCanvas is supported
 * Includes comprehensive checks for browser compatibility
 * @returns true if worker is supported, false otherwise
 */
export const checkWorkerSupported = (): boolean => {
  try {
    // Basic Web Worker support
    if (typeof Worker === 'undefined') {
      console.warn('Web Worker not supported');
      return false;
    }

    // OffscreenCanvas support (required for canvas operations in worker)
    if (typeof OffscreenCanvas === 'undefined') {
      console.warn('OffscreenCanvas not supported');
      return false;
    }

    // createImageBitmap support (required for image processing)
    if (typeof createImageBitmap === 'undefined') {
      console.warn('createImageBitmap not supported');
      return false;
    }

    // Check if we can actually create a worker (same-origin policy)
    try {
      const testWorker = new Worker(
        new URL('@/webWorkers/compressImageWorker/compressImage.worker.ts', import.meta.url),
        { type: 'module' },
      );
      testWorker.terminate();
    } catch (error) {
      console.warn('Cannot create worker:', error);
      return false;
    }

    // Check if OffscreenCanvas actually works
    try {
      const testCanvas = new OffscreenCanvas(1, 1);
      const ctx = testCanvas.getContext('2d');
      if (!ctx) {
        console.warn('OffscreenCanvas context not available');
        return false;
      }
    } catch (error) {
      console.warn('OffscreenCanvas not functional:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Worker support check failed:', error);
    return false;
  }
};
