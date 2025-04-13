import { useEffect, useRef } from 'react';
import cx from 'classnames';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { useDevice } from '@/hooks';
import { useLifeGridColumnsCount } from '@/store/atoms';

import { getNextZoomLevelSetter, snapToClosestZoom } from './utils';
import s from './s.module.styl';

const DEBOUNCE_TIMEOUT = 200; // finish user scroll after this delay means the end of scrolling event

export const ZoomableGrid = ({ children }: { children?: React.ReactNode }) => {
  const [columns, setColumns] = useLifeGridColumnsCount();
  // const { isDesktop } = useDevice();

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const isExactLevel = LIFE_GRID_ZOOM_LEVELS.includes(columns);

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
        animationIntervalState: animationRef.current,
      }); // columns can be outdated
    }, DEBOUNCE_TIMEOUT);
  };

  // watch for `columns` and update snap when debounce
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        handleZoom(e.deltaY);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [columns]);


  // useEffect(() => {
  //   let initialDistance: number | null = null;
  
  //   const getDistance = (touches: TouchList) => {
  //     if (touches.length < 2) return 0;
  
  //     const dx = touches[0].clientX - touches[1].clientX;
  //     const dy = touches[0].clientY - touches[1].clientY;
  
  //     return Math.sqrt(dx * dx + dy * dy);
  //   };
  
  //   const onTouchStart = (e: TouchEvent) => {
  //     if (e.touches.length === 2) {
  //       initialDistance = getDistance(e.touches);
  //     }
  //   };
  
  //   const onTouchMove = (e: TouchEvent) => {
  //     if (e.touches.length === 2 && initialDistance !== null) {
  //       e.preventDefault();
  //       const currentDistance = getDistance(e.touches);
  //       const delta = currentDistance - initialDistance;
  
  //       // Зумим, только если есть заметное изменение
  //       if (Math.abs(delta) > 10) {
  //         handleZoom(-delta); // Минус потому что deltaY>0 = уменьшение в wheel-обработчике
  
  //         // обновим дистанцию, чтобы можно было плавно продолжить
  //         initialDistance = currentDistance;
  //       }
  //     }
  //   };
  
  //   const onTouchEnd = () => {
  //     initialDistance = null;
  //   };
  
  //   window.addEventListener('touchstart', onTouchStart, { passive: false });
  //   window.addEventListener('touchmove', onTouchMove, { passive: false });
  //   window.addEventListener('touchend', onTouchEnd);
  
  //   return () => {
  //     window.removeEventListener('touchstart', onTouchStart);
  //     window.removeEventListener('touchmove', onTouchMove);
  //     window.removeEventListener('touchend', onTouchEnd);
  //   };
  // }, [columns]);

  return (
    <div
      className={cx(s.container, {
        [s.dashed]: isExactLevel,
      })}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
};
