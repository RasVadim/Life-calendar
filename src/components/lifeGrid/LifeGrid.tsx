import React, { useEffect, useRef } from 'react';

import { THEMES } from '@/constants/themes';
import { useDevice } from '@/hooks';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IWeek } from '@/store/clientDB';

import { initPixi } from './utils';

type TProps = {
  weeks: IWeek[];
};

export const LifeGrid: React.FC<TProps> = ({ weeks }) => {
  const { isMedium } = useDevice();
  const [themeMode] = useThemeMode();
  const theme = THEMES[themeMode];

  const pixiContainer = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let destroyed = false;

    const setup = async () => {
      if (!pixiContainer.current) return;

      try {
        const result = await initPixi({
          container: pixiContainer.current,
          weeks,
          theme,
          onDestroy: () => {
            if (destroyed) return;
          },
        });

        if (!result) {
          console.error('Failed to initialize PixiJS application');
          return;
        }

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks, themeMode]);

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
