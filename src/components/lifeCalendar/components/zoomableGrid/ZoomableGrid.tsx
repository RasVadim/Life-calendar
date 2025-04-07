import { useState, useEffect } from 'react';
import s from './s.module.styl';

// in descending order !!
const ZOOM_LEVELS = [52, 13, 4];

export const ZoomableGrid = ({ children }: { children?: React.ReactNode }) => {
  const [columns, setColumns] = useState(52);


const autoZoomDebounced = () => {
  
}

  const handleZoom = (delta: number) => {
    const calculateDeltaColumns = (prevCols: number) => {
      console.log('prevCols', prevCols);
      const newZoom = prevCols + (delta > 0 ? 1 : -1) * 3;

      console.log('newZoom', newZoom);
      const closestColumns = ZOOM_LEVELS.reduce((prev, curr) =>
        Math.abs(curr - newZoom) < Math.abs(prev - newZoom) ? curr : prev
      );

      console.log('closestColumns', closestColumns);

      if (ZOOM_LEVELS[0] < newZoom) return ZOOM_LEVELS[0];

      if (newZoom < ZOOM_LEVELS[ZOOM_LEVELS.length - 1])
        return ZOOM_LEVELS[ZOOM_LEVELS.length - 1];

      return newZoom;
    };

    setColumns(calculateDeltaColumns);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        // console.log('e.deltaY', e.deltaY);
        handleZoom(e.deltaY);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div
      className={s.container}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
};
