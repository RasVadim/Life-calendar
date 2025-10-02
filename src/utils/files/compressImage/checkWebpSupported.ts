/**
 * Check if browser supports WebP format
 * Tests WebP support by attempting to create a WebP data URL from canvas
 * @returns true if WebP is supported, false otherwise
 */
export const checkWebpSupported = (): boolean => {
  try {
    const cvs = document.createElement('canvas');
    const data = cvs.toDataURL('image/webp');
    return data.indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
};
