import { saveDBFileBlob } from '@/store/clientDB';

export type TAddFileOptions = {
  accept?: string;
  multiple?: boolean;
  onSuccess?: (fileId: string, isVideo: boolean, size: number) => void;
  onError?: (error: Error) => void;
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

  const { accept = 'image/*,video/*', multiple = false, onSuccess, onError } = options;

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
          // Determine if file is video
          const isVideo = file.type.startsWith('video/');

          // Generate file ID based on date and file type
          const fileExtension = isVideo ? 'v' : 'p';
          const fileId = `${dateKey}${fileExtension}`;

          // Save file to IndexedDB
          await saveDBFileBlob(fileId, file);

          onSuccess?.(fileId, isVideo, file.size);
        } catch (error) {
          onError?.(error as Error);
        }
      }
    };

    // Trigger file selection
    input.click();
  } catch (error) {
    onError?.(error as Error);
  }
};
