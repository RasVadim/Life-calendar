import { useRef, useEffect } from 'react';

import { useDevice } from '@/hooks';
import { useZoomCentralWeek } from '@/store/atoms';
import { IWeek } from '@/store/clientDB';
import { TLifeMode, TZodiacIconSet } from '@/types';

import { GridLabels } from './components';
import { VirtualRow } from '../virtaulRow/VirtaulRow';
import { Week } from '../week/Week';

import s from './s.module.styl';

const DEBOUNCE_TIMEOUT = 200; // finish user scroll after this delay means the end of scrolling event

type PropsType = {
  weeks: IWeek[];
  isByWidth: boolean;
  lifeMode: TLifeMode;
  zodiacIconSet: TZodiacIconSet;
};

export const YearsGrid = ({ weeks, isByWidth, lifeMode, zodiacIconSet }: PropsType) => {
  const { isMedium } = useDevice();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoomCentralWeekId, setZoomCentralWeekId] = useZoomCentralWeek();

  // DESKTOP
  useEffect(() => {
    let zoomTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        // Clear previous timeout
        if (zoomTimeout) {
          clearTimeout(zoomTimeout);
        }

        const elem = document.elementFromPoint(e.clientX, e.clientY);
        const weekId = elem?.getAttribute('data-week-id');
        if (weekId) {
          setZoomCentralWeekId(weekId);
        }

        zoomTimeout = setTimeout(() => {
          setZoomCentralWeekId('');
          zoomTimeout = null;
        }, DEBOUNCE_TIMEOUT);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (zoomTimeout) {
        clearTimeout(zoomTimeout);
      }
    };
  }, []);

  // TOUCHSCREEN DEVICE
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const x = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const elem = document.elementFromPoint(x, y);
      const weekId = elem?.getAttribute('data-week-id');
      if (weekId) {
        console.log('Pinch center weekId:', weekId);
        setZoomCentralWeekId(weekId);
      }
    };

    const onTouchEnd = () => {
      setZoomCentralWeekId('');
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      <VirtualRow
        weekId={'w034_26' || undefined}
        weeks={weeks}
        isVisible={!!'w034_26'}
        lifeMode={lifeMode}
      />
      <div ref={containerRef} className={s.container}>
        {(weeks || []).map((week) => (
          <Week key={week.id} id={week.id} week={week} isByWidth={isByWidth} lifeMode={lifeMode} />
        ))}
        {!isMedium && <GridLabels zodiacIconSet={zodiacIconSet} />}
      </div>
    </>
  );
};
