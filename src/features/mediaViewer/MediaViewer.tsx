import { FC, useCallback, useMemo } from 'react';

import { useTranslation } from '@/hooks';
import { useFullscreenViewer } from '@/store/atoms';
import { useDBFileBlob } from '@/store/clientDB';
import { FullscreenMediaViewer } from '@/ui-kit';

export const MediaViewer: FC = () => {
  const { t } = useTranslation();
  const [mediaItem, setMediaItem] = useFullscreenViewer();
  const isOpen = !!mediaItem;
  const { fileId, isVideo } = mediaItem || {};

  const { blob } = useDBFileBlob({ fileId, enabled: !!fileId });

  const blobUrl = useMemo(() => {
    return blob ? URL.createObjectURL(blob) : '';
  }, [blob]);

  const handleClose = useCallback(() => {
    setMediaItem(null);
  }, [setMediaItem]);

  return (
    <FullscreenMediaViewer
      isOpen={isOpen}
      isVideo={isVideo}
      hint={t('layout.swipeToClose')}
      url={blobUrl}
      onClose={handleClose}
    />
  );
};
