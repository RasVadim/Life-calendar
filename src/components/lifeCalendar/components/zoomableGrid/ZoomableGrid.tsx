import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { useLifeGridColumnsCount } from '@/store/atoms';

import {
  getNextZoomLevelSetter,
  getTwoTouchesDistance,
  snapToClosestZoom,
} from './utils';
import s from './s.module.styl';
import { useDevice } from '@/hooks';

const DEBOUNCE_TIMEOUT = 200; // finish user scroll after this delay means the end of scrolling event
const NORMAL_STEP = 2; // usual value step for normal zoom: every NORMAL_OFFSET points will be called handleZoom
const SCROLL_STEP = 5; // if more then pause on middle level zoom is longer for desktop
const TOUCH_ZOOM_STEP = 90; // if more than pause on middle level zoom is longer for touch screens

export const ZoomableGrid = ({ children }: { children?: React.ReactNode }) => {
  const [columns, setColumns] = useLifeGridColumnsCount();
  const [isZooming, setIsZooming] = useState(false);

  const { isTouchScreen } = useDevice();

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const touchesDistance = useRef<number | null>(null);
  const isExactLevel = LIFE_GRID_ZOOM_LEVELS.includes(columns);

  const handleZoom = (delta: number) => {
    const direction = delta > 0 ? 1 : -1; // Scroll direction
    setIsZooming(true);

    const columnsSetter = getNextZoomLevelSetter(direction);

    setColumns(columnsSetter);

    // restart debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      snapToClosestZoom({
        currentCount: columns,
        direction,
        setColumns,
        animationIntervalState: animationRef.current,
        onAnimationEnd: !isTouchScreen ? () => setIsZooming(false) : undefined,
      }); // columns can be outdated
    }, DEBOUNCE_TIMEOUT);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // watch for `columns` and update snap when debounce:
  // DESKTOP
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        const deltaStep =
          columns === LIFE_GRID_ZOOM_LEVELS[1] ? SCROLL_STEP : NORMAL_STEP;
        if (Math.abs(e.deltaY) > deltaStep) {
          handleZoom(e.deltaY);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [columns]);

  // TOUCHSCREEN DEVICE
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        touchesDistance.current = getTwoTouchesDistance(e.touches);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || touchesDistance.current === null) return;

      e.preventDefault();
      const currentDistance = getTwoTouchesDistance(e.touches);
      const delta = currentDistance - touchesDistance.current;

      const deltaStep =
        columns === LIFE_GRID_ZOOM_LEVELS[1] ? TOUCH_ZOOM_STEP : NORMAL_STEP;

      if (Math.abs(delta) > deltaStep) {
        handleZoom(-delta);
        touchesDistance.current = currentDistance;
      }
    };

    const onTouchEnd = () => {
      touchesDistance.current = null;
      setIsZooming(false);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [columns]);

  return (
    <div
      className={cx(s.container, {
        [s.dashed]: isExactLevel && isZooming,
      })}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
};
