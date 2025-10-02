/**
 * Calculate smart crop coordinates for creating square thumbnails
 * For vertical images, focuses on upper 25-30% of the image
 * For horizontal images, uses center crop
 * @param imgWidth - Original image width in pixels
 * @param imgHeight - Original image height in pixels
 * @returns Object with sourceX, sourceY, and sourceSize for cropping
 */
export const calculateSmartCrop = (imgWidth: number, imgHeight: number) => {
  const isVertical = imgHeight > imgWidth;

  if (isVertical) {
    const sourceSize = imgWidth;
    const focusY = imgHeight * 0.25;
    let sourceY = focusY - sourceSize / 2;
    if (sourceY < 0) sourceY = 0;
    if (sourceY + sourceSize > imgHeight) sourceY = imgHeight - sourceSize;
    return { sourceX: 0, sourceY, sourceSize };
  } else {
    const sourceSize = imgHeight;
    const sourceX = Math.max(0, (imgWidth - sourceSize) / 2);
    return { sourceX, sourceY: 0, sourceSize };
  }
};
