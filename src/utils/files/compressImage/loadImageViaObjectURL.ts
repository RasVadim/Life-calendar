/**
 * Load image via object URL with proper cleanup
 * Creates a temporary object URL for the file and loads it into an Image element
 * Automatically cleans up the object URL on error
 * @param file - File object to load as image
 * @returns Promise that resolves to loaded HTMLImageElement
 */
export const loadImageViaObjectURL = async (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image via object URL'));
    };
    img.src = url;
  });
};
