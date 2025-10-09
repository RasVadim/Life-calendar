import { FC, useCallback, useMemo } from 'react';

import { useTranslation } from '@/hooks';
import { useFullscreenViewer } from '@/store/atoms';
import { useDBFileBlob } from '@/store/clientDB';
import { FullscreenMediaViewer } from '@/ui-kit';
import { addFile, deleteMediaFile } from '@/utils';

export const MediaViewer: FC = () => {
  const { t } = useTranslation();
  const [mediaItem, setMediaItem] = useFullscreenViewer();
  const isOpen = !!mediaItem;
  const { fileId, isVideo, weekIndex, dayIndex } = mediaItem || {};

  const { blob } = useDBFileBlob({ fileId, enabled: !!fileId });

  const blobUrl = useMemo(() => {
    return blob ? URL.createObjectURL(blob) : '';
  }, [blob]);

  const handleClose = useCallback(() => {
    setMediaItem(null);
  }, [setMediaItem]);

  const handleReplaceMedia = useCallback(() => {
    if (!mediaItem?.mediaIndex) return;

    addFile(mediaItem.mediaIndex, {
      onError: (error) => {
        console.error('Error replacing media:', error);
      },
    });
  }, [mediaItem]);

  const handleDeleteMedia = useCallback(async () => {
    if (!mediaItem?.mediaIndex) return;

    try {
      await deleteMediaFile({
        dateKey: mediaItem.mediaIndex,
        weekIndex,
        dayIndex,
      });
      // Close viewer after successful deletion
      setMediaItem(null);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  }, [mediaItem, weekIndex, dayIndex, setMediaItem]);

  return (
    <FullscreenMediaViewer
      isOpen={isOpen}
      isVideo={isVideo}
      hint={t('layout.swipeToClose')}
      url={blobUrl}
      onClose={handleClose}
      onReplaceMedia={handleReplaceMedia}
      onDeleteMedia={handleDeleteMedia}
    />
  );
};
