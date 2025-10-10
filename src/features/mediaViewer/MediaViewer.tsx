import { FC, useCallback, useMemo } from 'react';

import { useTranslation, useNotifications } from '@/hooks';
import { useFullscreenViewer } from '@/store/atoms';
import { useDBFileBlob } from '@/store/clientDB';
import { FullscreenMediaViewer } from '@/ui-kit';
import { addFile, deleteMediaFile } from '@/utils';

export const MediaViewer: FC = () => {
  const { t } = useTranslation();
  const { showNotification, hideNotification } = useNotifications();
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

  const handleDeleteMedia = useCallback(() => {
    showNotification({
      message: t('layout.confirmDelete.message'),
      buttonLabel: t('layout.confirmDelete.delete'),
      closable: true,
      onButtonClick: async () => {
        if (!mediaItem?.mediaIndex) return;

        try {
          await deleteMediaFile({
            dateKey: mediaItem.mediaIndex,
            weekIndex,
            dayIndex,
          });
          // Close viewer after successful deletion
          setMediaItem(null);
          hideNotification();
        } catch (error) {
          console.error('Error deleting media:', error);
        }
      },
    });
  }, [mediaItem, weekIndex, dayIndex, showNotification]);

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
