import React, { useEffect, useRef } from 'react';

import { DEVICE_SCREEN_WIDTH } from '@/constants';
import { THEMES } from '@/constants/themes';
import { useZodiacIconSet } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IDrawWeekIndexes } from '@/store/clientDB';
import { TMediaDatesMap, TMedia, TTodayData } from '@/types';

import { renderLife } from './renders';
import { TLifeGridState } from './types';
import { resizeYearsList } from './updaters';
import { initPixi } from './utils';

import s from './s.module.styl';

type TProps = {
  drawWeekIndexes: IDrawWeekIndexes;
  media: TMediaDatesMap<TMedia>;
  today: TTodayData;
};

export const LifeGrid: React.FC<TProps> = ({ drawWeekIndexes, today, media }) => {
  const [lifeMode] = useLifeGridMode();
  const [themeMode] = useThemeMode();
  const zodiacIconSet = useZodiacIconSet();
  const theme = THEMES[themeMode];

  const pixiContainerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<TLifeGridState>({
    drawWeekIndexes,
    media,
    today,
    theme,
    isScreenMedium: window.innerWidth < DEVICE_SCREEN_WIDTH.medium,
    lifeMode,
    zodiacIconSet,
    container: null,
    app: null,
    scrollContainer: null,
  });

  // Sync latest props into the mutable state and repaint the Pixi scene
  const render = () => {
    Object.assign(stateRef.current, {
      drawWeekIndexes,
      media,
      today,
      theme,
      lifeMode,
      zodiacIconSet,
    });
    stateRef.current.scrollContainer = renderLife(stateRef.current) || null;
  };

  // Initialize Pixi once, wire resize, cleanup on unmount
  useEffect(() => {
    if (!pixiContainerRef.current) return;

    const initApp = async () => {
      const app = await initPixi(pixiContainerRef.current!);
      stateRef.current.app = app;
      pixiContainerRef.current!.appendChild(app.canvas);
      stateRef.current.container = pixiContainerRef.current;
      render();
    };

    initApp();

    const onResizeGrid = () => resizeYearsList(stateRef.current);
    window.addEventListener('resize', onResizeGrid);

    return () => {
      window.removeEventListener('resize', onResizeGrid);
      stateRef.current.app?.destroy(true, { children: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Repaint on any visual input change
  useEffect(() => {
    if (!stateRef.current.app) return;
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawWeekIndexes.lastWeekIndex, theme, lifeMode, zodiacIconSet, today.todayWeekIndex]);

  return <div ref={pixiContainerRef} className={s.pixiContainer} />;
};
