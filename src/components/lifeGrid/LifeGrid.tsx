import React, { useEffect, useRef } from 'react';

import cx from 'classnames';
import { Application } from 'pixi.js';
import { Container } from 'pixi.js';

import { THEMES } from '@/constants/themes';
import { useDevice, useZodiacIconSet } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IWeek } from '@/store/clientDB';

import { renderWeekList } from './renders';
import { initPixi, getHandleWheel } from './utils';

import s from './s.module.styl';

type TProps = {
  weeks: IWeek[];
};

export const LifeGrid: React.FC<TProps> = ({ weeks }) => {
  const { isMedium } = useDevice();
  const [lifeMode] = useLifeGridMode();
  const [themeMode] = useThemeMode();
  const theme = THEMES[themeMode];
  const zodiacIconSet = useZodiacIconSet();

  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const scrollContainerRef = useRef<Container | null>(null);
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
          zodiacIconSet,
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
        scrollContainerRef.current = result.scrollContainer || null;
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
      scrollContainerRef.current = null;
    };
  }, [weeks?.length]);

  // 2. Rerender weeks on parameters change
  useEffect(() => {
    if (!appRef.current) return;
    const width = appRef.current.renderer.width;
    const height = appRef.current.renderer.height;
    const scrollContainer = renderWeekList({
      weeks,
      theme,
      width,
      height,
      zodiacIconSet,
      stage: appRef.current.stage,
      isMedium,
      mode: lifeMode,
    });
    scrollContainerRef.current = scrollContainer || null;
  }, [weeks, theme, isMedium, lifeMode, zodiacIconSet]);

  // wheel scroll for seasons mode
  useEffect(() => {
    if (!pixiContainer.current) return;
    const canvas = pixiContainer.current.querySelector('canvas');
    if (!canvas) return;
    const handleWheel = getHandleWheel({
      lifeMode,
      scrollContainerRef,
      appRef,
    });
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [lifeMode, scrollContainerRef.current]);

  return (
    <div
      ref={pixiContainer}
      className={cx(s.container, {
        [s.wide_mode]: !isMedium,
      })}
    />
  );
};
