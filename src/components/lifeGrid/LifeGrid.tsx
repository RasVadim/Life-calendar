import React, { useEffect, useRef } from 'react';

import { Application } from 'pixi.js';

import { THEMES } from '@/constants/themes';
import { useDevice } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IWeek } from '@/store/clientDB';

import { initPixi, renderWeekList } from './utils';

type TProps = {
  weeks: IWeek[];
};

export const LifeGrid: React.FC<TProps> = ({ weeks }) => {
  const { isMedium } = useDevice();
  const [lifeMode] = useLifeGridMode();
  const [themeMode] = useThemeMode();
  const theme = THEMES[themeMode];

  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // 1. Initialize PixiJS
  useEffect(() => {
    if (!pixiContainer.current || appRef.current) return;
    let destroyed = false;

    const setup = async () => {
      try {
        const result = await initPixi({
          container: pixiContainer.current!,
          weeks,
          isMedium,
          theme,
          mode: lifeMode,
          onDestroy: () => {
            if (destroyed) return;
          },
        });
        if (!result) {
          console.error('Failed to initialize PixiJS application');
          return;
        }
        appRef.current = result.app;
        cleanupRef.current = result.cleanup;
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
      appRef.current = null;
    };
  }, [weeks?.length]);

  // 2. Rerender weeks on parameters change
  useEffect(() => {
    if (!appRef.current) return;
    const width = appRef.current.renderer.width;
    const height = appRef.current.renderer.height;
    renderWeekList({
      weeks,
      theme,
      width,
      height,
      stage: appRef.current.stage,
      isMedium,
      mode: lifeMode,
    });
  }, [weeks, theme, isMedium, lifeMode]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: 'calc(100dvh - 118px)',
    position: 'absolute',
    top: '44px',
    left: '0',
    right: '0',
    bottom: '76px',
    ...(!isMedium && {
      height: '100%',
      top: '0',
      bottom: '0',
      maxWidth: '660px',
      margin: '0 auto',
    }),
  };
  return <div ref={pixiContainer} style={containerStyle} />;
};
