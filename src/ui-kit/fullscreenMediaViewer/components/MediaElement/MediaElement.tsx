import { FC } from 'react';

import cx from 'classnames';

import s from './s.module.styl';

type TProps = {
  isVideo: boolean;
  src: string;
  style: React.CSSProperties;
  onClick: (e: React.MouseEvent) => void;
  isOpen: boolean;
};

export const MediaElement: FC<TProps> = ({ isVideo, src, style, onClick, isOpen }) => {
  if (isVideo) {
    return (
      <video
        className={cx(s.media, {
          [s.isOpen]: isOpen,
        })}
        src={src}
        style={style}
        controls
        autoPlay
        muted
        loop
        playsInline
        onClick={onClick}
      />
    );
  }

  return (
    <img
      className={cx(s.media, {
        [s.isOpen]: isOpen,
      })}
      src={src}
      style={style}
      alt="Fullscreen media"
      onClick={onClick}
    />
  );
};
