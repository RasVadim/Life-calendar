/**
 * Calculate new dimensions maintaining aspect ratio
 * @param width - Original width in pixels
 * @param height - Original height in pixels
 * @param maxSize - Maximum size for the longest side in pixels
 * @returns Object with new width and height that fit within maxSize while preserving aspect ratio
 */
export const calculateDimensions = (width: number, height: number, maxSize: number) => {
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }
  const ratio = Math.min(maxSize / width, maxSize / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};
