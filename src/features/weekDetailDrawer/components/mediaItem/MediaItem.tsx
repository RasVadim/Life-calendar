import { FC, useEffect, useState } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { useSetFullscreenViewer } from '@/store/atoms';
import { useDBFileBlob, useDBThumbnail } from '@/store/clientDB';
import { uploadMediaFile } from '@/utils';

import { TMediaItem } from '../../types';

import s from './s.module.styl';

type TProps = {
  item?: TMediaItem | null;
  isSmall?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  isOnlyOne?: boolean;
};

enum EMediaState {
  PLACEHOLDER = 'placeholder',
  PHOTO = 'photo',
  VIDEO = 'video',
}

enum EPlaceholderState {
  IDLE = 'idle',
  LOADING = 'loading',
  UPLOADING = 'uploading',
}

export const MediaItem: FC<TProps> = ({
  item,
  isSmall = false,
  isFirst = false,
  isLast = false,
  isOnlyOne = false,
}) => {
  const { t } = useTranslation();

  const { fileId, isVideo, dayOfWeek, mediaIndex, weekIndex, dayIndex, isWeekPreview } = item || {};

  const { blob } = useDBFileBlob({ fileId, enabled: isWeekPreview });
  const { thumbnail } = useDBThumbnail({ fileId, enabled: !isWeekPreview });

  const mediaBlob = isSmall ? thumbnail : blob;

  const [mediaState, setMediaState] = useState<EMediaState>(EMediaState.PLACEHOLDER);
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [placeholderState, setPlaceholderState] = useState<EPlaceholderState>(
    EPlaceholderState.IDLE,
  );

  const setMediaItem = useSetFullscreenViewer();

  const dayLabel = dayOfWeek ? t(`life.shortDays.${dayOfWeek}`) : '';

  // File upload options
  const fileUploadOptions = {
    dateKey: mediaIndex,
    weekIndex,
    dayIndex,
    onError: (error: Error) => {
      console.error('Error uploading file:', error);
    },
  };

  // Create blob URL when file blob is loaded
  useEffect(() => {
    if (mediaBlob) {
      const url = URL.createObjectURL(mediaBlob);
      setBlobUrl(url);

      // Cleanup previous URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [mediaBlob]);

  useEffect(() => {
    if (!blobUrl) return;

    if (isVideo) {
      const videoEl = document.createElement('video');
      videoEl.oncanplaythrough = () => setMediaState(EMediaState.VIDEO);
      videoEl.onerror = () => setMediaState(EMediaState.PLACEHOLDER); // Fallback to placeholder
      videoEl.src = blobUrl;
      videoEl.load();
    } else {
      const img = new Image();
      img.onload = () => setMediaState(EMediaState.PHOTO);
      img.onerror = () => setMediaState(EMediaState.PLACEHOLDER); // Fallback to placeholder
      img.src = blobUrl;
    }
    setPlaceholderState(EPlaceholderState.IDLE);
  }, [blobUrl, isVideo]);

  const addMedia = () => {
    // Start skeleton animation immediately
    setPlaceholderState(EPlaceholderState.LOADING);

    // Start file upload
    uploadMediaFile({
      ...fileUploadOptions,
      onSuccess: () => {
        // File selected and upload started
        setPlaceholderState(EPlaceholderState.UPLOADING);
      },
      onCancel: () => {
        // User cancelled file selection
        setPlaceholderState(EPlaceholderState.IDLE);
      },
    });
  };

  const handleMediaClick = () => {
    if (mediaState === EMediaState.PHOTO || mediaState === EMediaState.VIDEO) {
      setMediaItem(item!);
    }
  };

  return (
    <div
      className={cx(s.mediaItem, {
        [s.smallMediaItem]: isSmall,
        [s.first]: isFirst,
        [s.last]: isLast,
        [s.bottomRadius]: !isSmall && isOnlyOne,
      })}
    >
      {mediaState === EMediaState.VIDEO ? (
        <video
          className={s.video}
          src={blobUrl}
          muted
          loop
          playsInline
          autoPlay
          onError={() => setMediaState(EMediaState.PHOTO)}
          onClick={handleMediaClick}
        />
      ) : mediaState === EMediaState.PHOTO ? (
        <img
          className={s.photo}
          src={blobUrl}
          alt={'photo'}
          onError={() => setMediaState(EMediaState.PLACEHOLDER)}
          onClick={handleMediaClick}
        />
      ) : (
        <div
          className={cx(s.placeholder, {
            [s.skeletonActive]: placeholderState !== EPlaceholderState.IDLE,
          })}
          onClick={addMedia}
        >
          <div className={s.placeholderIcon}>+</div>
          {dayLabel && <div className={s.dayLabel}>{dayLabel}</div>}
          {placeholderState !== EPlaceholderState.IDLE && <div className={s.skeleton} />}
        </div>
      )}
    </div>
  );
};
