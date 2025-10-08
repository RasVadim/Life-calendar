import { FC, useCallback, useEffect, useMemo } from 'react';

import cx from 'classnames';

import { useDragGesture, useBodyScrollLock, useBrowserZoom } from './hooks';
import { MediaElement } from './MediaElement/MediaElement';

import s from './s.module.styl';

type TProps = {
  url?: string;
  isVideo?: boolean;
  hint?: string;
  isOpen?: boolean;
  onClose: () => void;
};

export const FullscreenMediaViewer: FC<TProps> = ({
  url,
  isVideo = false,
  hint = 'Swipe down or tap to close • Pinch to zoom',
  isOpen = false,
  onClose,
}) => {
  // Custom hooks
  useBodyScrollLock(isOpen);
  useBrowserZoom(isOpen); // Enable browser zoom when fullscreen is open

  const { dragOffset, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd, resetDrag } =
    useDragGesture(isOpen, onClose);

  // Media style with drag offset
  const mediaStyle = useMemo(
    () => ({
      '--drag-x': `${dragOffset.x}px`,
      '--drag-y': `${dragOffset.y}px`,
      transition: isDragging ? 'none' : 'transform 1s ease-out',
    }),
    [dragOffset.x, dragOffset.y, isDragging],
  );

  const handleMediaClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose],
  );

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset drag when closing
  useEffect(() => {
    if (!isOpen) {
      resetDrag();
    }
  }, [isOpen, resetDrag]);

  if (!isOpen || !url) {
    return null;
  }

  return (
    <div
      className={cx(s.fullscreenContainer, {
        [s.isOpen]: isOpen,
        [s.hidden]: !isOpen,
      })}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
    >
      <div className={s.mediaWrapper}>
        <MediaElement
          isVideo={isVideo}
          src={url}
          style={mediaStyle}
          onClick={handleMediaClick}
          isOpen={isOpen}
        />
      </div>

      <div className={s.closeHint}>{hint}</div>
    </div>
  );
};
