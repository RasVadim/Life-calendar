/**
 * Check if file format is supported for processing
 * Handles HEIC/HEIF and other problematic formats
 * @param file - File to check
 * @returns true if format is supported, false otherwise
 */
export const checkFileFormatSupported = (file: File): boolean => {
  const unsupportedFormats = [
    'image/heic',
    'image/heif',
    'image/avif', // Some older browsers
  ];

  if (unsupportedFormats.includes(file.type.toLowerCase())) {
    console.warn(`Unsupported format: ${file.type}`);
    return false;
  }

  return true;
};
