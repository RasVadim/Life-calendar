import { FC, useEffect, useState } from 'react';

import cx from 'classnames';

import { TMedia } from '@/types';

import s from './s.module.styl';

type TProps = {
  media?: TMedia | null;
  isSmall?: boolean;
};

enum EMediaState {
  PLACEHOLDER = 'placeholder',
  PHOTO = 'photo',
  VIDEO = 'video',
}

export const MediaItem: FC<TProps> = ({ media, isSmall = false }) => {
  const { url, localPath, isVideo } = media || {};

  const [mediaState, setMediaState] = useState<EMediaState>(EMediaState.PLACEHOLDER);

  const path = localPath || url;

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

  return (
    <div className={cx(s.mediaItem, { [s.smallMediaItem]: isSmall })}>
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
        <div className={s.placeholder} />
      )}
    </div>
  );
};
