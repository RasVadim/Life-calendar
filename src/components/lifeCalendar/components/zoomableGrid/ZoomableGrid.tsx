import { useEffect, useRef } from 'react';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { useDevice } from '@/hooks';
import { useLifeGridColumnsCount } from '@/store/atoms';

import {
  getNextZoomLevelSetter,
  getTwoTouchesDistance,
  snapToClosestZoom,
  calculateRowGapSize,
  calculateTopPadding,
} from './utils';
import { GridLabels } from '../gridLabels/GridLabels';

import s from './s.module.styl';

const DEBOUNCE_TIMEOUT = 200; // finish user scroll after this delay means the end of scrolling event
const NORMAL_STEP = 1; // usual value step for normal zoom: every NORMAL_STEP points will be called handleZoom
const SCROLL_STEP = 5; // if more then pause on middle level zoom is longer for desktop
const TOUCH_ZOOM_STEP = 90; // if more than pause on middle level zoom is longer for touch screens

export const ZoomableGrid = ({ children }: { children?: React.ReactNode }) => {
  const [columns, setColumns] = useLifeGridColumnsCount();

  const { isMobile } = useDevice();

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const touchesDistance = useRef<number | null>(null);

  const currentRowGap = isMobile ? calculateRowGapSize(columns) : 1;
  const currentTopPadding = isMobile ? calculateTopPadding(columns) : 1;

  const handleZoom = (delta: number) => {
    const direction = delta > 0 ? 1 : -1; // Scroll direction

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

        const deltaStep = columns === LIFE_GRID_ZOOM_LEVELS.seasons ? SCROLL_STEP : NORMAL_STEP;
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

      const deltaStep = columns === LIFE_GRID_ZOOM_LEVELS.seasons ? TOUCH_ZOOM_STEP : NORMAL_STEP;

      if (Math.abs(delta) > deltaStep) {
        handleZoom(-delta);
        touchesDistance.current = currentDistance;
      }
    };

    const onTouchEnd = () => {
      touchesDistance.current = null;
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
    <>
      <div
        className={s.container}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          rowGap: `${currentRowGap}px`,
          paddingTop: `${currentTopPadding}px`,
        }}
      >
        {children}
        <GridLabels />
        {columns !== LIFE_GRID_ZOOM_LEVELS.years && <div className={s.bottomPadding} />}
      </div>
    </>
  );
};
