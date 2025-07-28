import React, { useEffect, useRef } from 'react';

import { THEMES } from '@/constants/themes';
import { useDevice, useZodiacIconSet } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IDrawWeekIndexes } from '@/store/clientDB';
import { TTodayData } from '@/types';

import { renderLife } from './renders';
import { TLifeGridState } from './types';
import { initPixi, getHandleWheel } from './utils';

import s from './s.module.styl';

type TProps = {
  drawWeekIndexes: IDrawWeekIndexes;
  today: TTodayData;
};

export const LifeGrid: React.FC<TProps> = ({ drawWeekIndexes, today }) => {
  const { isMedium } = useDevice();
  const [lifeMode] = useLifeGridMode();
  const [themeMode] = useThemeMode();
  const theme = THEMES[themeMode];
  const zodiacIconSet = useZodiacIconSet();

  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // state
  const stateRef = useRef<TLifeGridState>({
    drawWeekIndexes,
    today,
    theme,
    isMedium,
    lifeMode,
    zodiacIconSet,
    container: null,
    app: null,
    scrollContainer: null,
  });

  const render = () => {
    // update state
    stateRef.current.drawWeekIndexes = drawWeekIndexes;
    stateRef.current.today = today;
    stateRef.current.theme = theme;
    stateRef.current.isMedium = isMedium;
    stateRef.current.lifeMode = lifeMode;
    stateRef.current.zodiacIconSet = zodiacIconSet;

    // rerender
    stateRef.current.scrollContainer = renderLife(stateRef.current) || null;
  };

  // 1. Initialize PixiJS
  useEffect(() => {
    if (!pixiContainerRef.current || stateRef.current.app) return;
    let destroyed = false;

    const setup = async () => {
      try {
        // Update state with current container
        stateRef.current.container = pixiContainerRef.current;

        const result = await initPixi({
          state: stateRef.current,
          onDestroy: () => {
            if (destroyed) return;
          },
        });
        if (!result) {
          console.error('Failed to initialize PixiJS application');
          return;
        }
        cleanupRef.current = result.cleanup;

        // Trigger initial render
        if (drawWeekIndexes.lastWeekIndex > 0) {
          render();
        }

        if (destroyed) {
          result.cleanup();
          return;
        }
      } catch (e) {
        console.error('PixiJS setup error:', e);
      }
    };
    setup();
    return () => {
      destroyed = true;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      stateRef.current.app = null;
      stateRef.current.scrollContainer = null;
    };
  }, [drawWeekIndexes.lastWeekIndex]);

  // 2. Rerender weeks on parameters change
  useEffect(() => {
    if (!stateRef.current.app) return;

    render();
  }, [
    drawWeekIndexes.lastWeekIndex,
    theme,
    isMedium,
    lifeMode,
    zodiacIconSet,
    today.todayWeekIndex,
  ]);

  // wheel scroll for seasons mode
  useEffect(() => {
    if (!pixiContainerRef.current) return;
    const canvas = pixiContainerRef.current.querySelector('canvas');
    if (!canvas) return;
    const handleWheel = getHandleWheel({
      lifeMode,
      scrollContainer: stateRef.current.scrollContainer,
      app: stateRef.current.app,
    });
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [lifeMode]);

  return <div ref={pixiContainerRef} className={s.container} />;
};
