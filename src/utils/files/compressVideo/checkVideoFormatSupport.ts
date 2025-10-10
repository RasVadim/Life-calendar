/**
 * Check if browser can play the video format
 * @param file - Video file to check
 * @returns Promise<boolean> - true if format is supported
 */
export const checkVideoFormatSupport = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    // Set timeout to avoid hanging
    setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve(false);
    }, 5000);

    video.src = url;
    video.load();
  });
};
