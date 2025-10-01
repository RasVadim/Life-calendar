import { FC, useEffect, useState } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { EDayOfWeek, TMedia } from '@/types';

import s from './s.module.styl';

type TProps = {
  item?: (TMedia & { dayOfWeek?: EDayOfWeek }) | null;
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

  const { url, localPath, isVideo, dayOfWeek } = item || {};

  const [mediaState, setMediaState] = useState<EMediaState>(EMediaState.PLACEHOLDER);

  const path = localPath || url;
  const dayLabel = dayOfWeek ? t(`life.shortDays.${dayOfWeek}`) : '';

  useEffect(() => {
    if (!path) return;

    if (isVideo) {
      const videoEl = document.createElement('video');
      videoEl.oncanplaythrough = () => setMediaState(EMediaState.VIDEO);
      videoEl.onerror = () => {}; // Stay on photo if video fails
      videoEl.src = path;
      videoEl.load();
    }

    const img = new Image();
    img.onload = () => {
      setMediaState(EMediaState.PHOTO);
    };
    img.onerror = () => {}; // Stay on placeholder if photo fail  s
    img.src = path;
  }, [path, isVideo]);

  const addMedia = () => {
    console.log('addMedia');
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
          src={path}
          muted
          loop
          playsInline
          autoPlay
          onError={() => setMediaState(EMediaState.PHOTO)}
        />
      ) : mediaState === EMediaState.PHOTO ? (
        <img
          className={s.photo}
          src={path}
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
