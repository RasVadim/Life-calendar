import { saveDBFileBlob, saveDBThumbnail } from '@/store/clientDB';

import { compress } from './compress';

export type TAddFileOptions = {
  accept?: string;
  multiple?: boolean;
  onSuccess?: (fileId: string, isVideo: boolean, size: number) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
};

/**
 * Utility function for adding files to IndexedDB
 * @param date - Date in format '19981224'
 * @param options - Configuration options for file selection and handling
 */
export const addFile = async (dateKey?: string | null, options: TAddFileOptions = {}) => {
  if (!dateKey) {
    console.error('Date key is required');
    return;
  }

  const { accept = 'image/*,video/*', multiple = false, onSuccess, onError, onCancel } = options;

  try {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const { compressedFile, thumbnail, isVideo } = await compress(file);

          // Generate file ID based on date and file type
          const fileExtension = isVideo ? 'v' : 'p';
          const fileId = `${dateKey}${fileExtension}`;

          // Save file to IndexedDB
          await saveDBFileBlob(fileId, compressedFile);
          await saveDBThumbnail(fileId, thumbnail);

          onSuccess?.(fileId, isVideo, file.size);
        } catch (error) {
          onError?.(error as Error);
        }
      } else {
        // User cancelled file selection
        onCancel?.();
      }
    };

    // Handle window focus to detect cancellation
    const handleWindowFocus = () => {
      // Small delay to allow file dialog to close
      setTimeout(() => {
        if (!input.files || input.files.length === 0) {
          onCancel?.();
        }
        window.removeEventListener('focus', handleWindowFocus);
      }, 100);
    };

    window.addEventListener('focus', handleWindowFocus);

    // Trigger file selection
    input.click();
  } catch (error) {
    onError?.(error as Error);
  }
};
