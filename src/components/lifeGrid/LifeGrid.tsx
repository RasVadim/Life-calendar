import React, { useEffect, useRef } from 'react';

import { DEVICE_SCREEN_WIDTH } from '@/constants';
import { THEMES } from '@/constants/themes';
import { useZodiacIconSet } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IDrawWeekIndexes } from '@/store/clientDB';
import { TTodayData } from '@/types';

import { renderLife } from './renders';
import { TLifeGridState } from './types';
import { resizeYearsGrid } from './updaters';
import { initPixi } from './utils';

import s from './s.module.styl';

type TProps = {
  drawWeekIndexes: IDrawWeekIndexes;
  today: TTodayData;
};

export const LifeGrid: React.FC<TProps> = ({ drawWeekIndexes, today }) => {
  const [lifeMode] = useLifeGridMode();
  const [themeMode] = useThemeMode();
  const zodiacIconSet = useZodiacIconSet();
  const theme = THEMES[themeMode];

  const pixiContainerRef = useRef<HTMLDivElement>(null);

  // state
  const stateRef = useRef<TLifeGridState>({
    drawWeekIndexes,
    today,
    theme,
    isScreenMedium: window.innerWidth < DEVICE_SCREEN_WIDTH.medium,
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
    stateRef.current.lifeMode = lifeMode;
    stateRef.current.zodiacIconSet = zodiacIconSet;

    // rerender
    stateRef.current.scrollContainer = renderLife(stateRef.current) || null;
  };

  // 1. Initialize PixiJS
  useEffect(() => {
    if (!pixiContainerRef.current) return;

    const initApp = async () => {
      // Initialize PixiJS
      const app = await initPixi(pixiContainerRef.current!);
      stateRef.current.app = app;

      // Add canvas to DOM
      pixiContainerRef.current!.appendChild(app.canvas);
      stateRef.current.container = pixiContainerRef.current;
      render();
    };

    initApp();

    const onResizeGrid = () => {
      resizeYearsGrid(stateRef.current);
    };

    // Add resize listener
    window.addEventListener('resize', onResizeGrid);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResizeGrid);
      if (stateRef.current.app) {
        stateRef.current.app.destroy(true, { children: true });
      }
    };
  }, []);

  // 2. Rerender weeks on parameters change
  useEffect(() => {
    if (!stateRef.current.app) return;

    render();
  }, [drawWeekIndexes.lastWeekIndex, theme, lifeMode]);

  useEffect(() => {
    if (!stateRef.current.app) return;

    render();
  }, [zodiacIconSet]);

  useEffect(() => {
    if (!stateRef.current.app) return;

    render();
  }, [today.todayWeekIndex]);

  // wheel scroll for seasons mode
  // useEffect(() => {
  //   if (!pixiContainerRef.current) return;
  //   const canvas = pixiContainerRef.current.querySelector('canvas');
  //   if (!canvas) return;
  //   const handleWheel = getHandleWheel({
  //     lifeMode,
  //     scrollContainer: stateRef.current.scrollContainer,
  //     app: stateRef.current.app,
  //   });
  //   canvas.addEventListener('wheel', handleWheel, { passive: false });
  //   return () => {
  //     canvas.removeEventListener('wheel', handleWheel);
  //   };
  // }, [lifeMode]);

  return <div ref={pixiContainerRef} className={s.container} />;
};
