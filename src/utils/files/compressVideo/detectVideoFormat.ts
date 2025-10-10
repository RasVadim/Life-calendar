/**
 * Detect video format from file using browser APIs
 * @param file - Video file to analyze
 * @returns Object with format information
 */
export const detectVideoFormat = (
  file: File,
): {
  codec: string;
  container: string;
} => {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // Check for WebM
  if (mimeType.includes('webm') || fileName.includes('.webm')) {
    return {
      codec: 'VP8/VP9',
      container: 'WebM',
    };
  }

  // Check for MP4 files
  if (mimeType.includes('mp4') || fileName.includes('.mp4')) {
    return {
      codec: 'H.264/HEVC',
      container: 'MP4',
    };
  }

  // Check for MOV files (QuickTime)
  if (mimeType.includes('mov') || mimeType.includes('quicktime') || fileName.includes('.mov')) {
    return {
      codec: 'H.264/HEVC',
      container: 'MOV',
    };
  }

  // Check for AVI files
  if (mimeType.includes('avi') || fileName.includes('.avi')) {
    return {
      codec: 'DivX/Xvid/MJPEG',
      container: 'AVI',
    };
  }

  // Check for MKV files
  if (mimeType.includes('mkv') || fileName.includes('.mkv')) {
    return {
      codec: 'H.264/HEVC/VP8/VP9',
      container: 'MKV',
    };
  }

  // Check for 3GP files
  if (mimeType.includes('3gp') || fileName.includes('.3gp')) {
    return {
      codec: 'H.264',
      container: '3GP',
    };
  }

  // Check for FLV files
  if (mimeType.includes('flv') || fileName.includes('.flv')) {
    return {
      codec: 'H.264/VP6',
      container: 'FLV',
    };
  }

  // Default assumption
  return {
    codec: 'Unknown',
    container: 'Unknown',
  };
};
