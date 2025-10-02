import { FC, useEffect, useState } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { useDBFileBlob } from '@/store/clientDB';
import { uploadMediaFile } from '@/utils/files/uploadMediaFile';

import { TMediaItem } from '../../types';

import s from './s.module.styl';

type TProps = {
  item?: TMediaItem | null;
  isSmall?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
};

enum EMediaState {
  PLACEHOLDER = 'placeholder',
  PHOTO = 'photo',
  VIDEO = 'video',
}

export const MediaItem: FC<TProps> = ({
  item,
  isSmall = false,
  isFirst = false,
  isLast = false,
}) => {
  const { t } = useTranslation();

  const { fileId, isVideo, dayOfWeek, mediaIndex, weekIndex, dayIndex } = item || {};

  const fileBlob = useDBFileBlob(fileId);

  const [mediaState, setMediaState] = useState<EMediaState>(EMediaState.PLACEHOLDER);
  const [blobUrl, setBlobUrl] = useState<string>('');

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
    if (fileBlob?.blob) {
      const url = URL.createObjectURL(fileBlob.blob);
      setBlobUrl(url);

      // Cleanup previous URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [fileBlob]);

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
  }, [blobUrl, isVideo]);

  const addMedia = () => {
    uploadMediaFile(fileUploadOptions);
  };

  return (
    <div
      className={cx(s.mediaItem, {
        [s.smallMediaItem]: isSmall,
        [s.first]: isFirst,
        [s.last]: isLast,
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
        />
      ) : mediaState === EMediaState.PHOTO ? (
        <img
          className={s.photo}
          src={blobUrl}
          alt={'photo'}
          onError={() => setMediaState(EMediaState.PLACEHOLDER)}
        />
      ) : (
        <div className={s.placeholder} onClick={addMedia}>
          <div className={s.placeholderIcon}>+</div>
          {dayLabel && <div className={s.dayLabel}>{dayLabel}</div>}
        </div>
      )}
    </div>
  );
};
