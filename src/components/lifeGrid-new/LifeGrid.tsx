import { FC, useEffect, useRef } from 'react';

import { createLifeGrid } from './creators';
import { onResizeGrid } from './handlers';
import { usePixiLifeGridController } from './hooks';
import { initPixi } from './utils';

import s from './s.module.styl';

// type TProps = undefined;

export const LifeGrid: FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const state = usePixiLifeGridController();

  useEffect(() => {
    if (!pixiContainerRef.current) return;

    const initApp = async () => {
      // Initialize PixiJS
      const app = await initPixi(pixiContainerRef.current!);
      state.app = app;

      // Add canvas to DOM
      pixiContainerRef.current!.appendChild(app.canvas);
      createLifeGrid(state);
    };

    initApp();

    // Add resize listener
    window.addEventListener('resize', onResizeGrid);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResizeGrid);
      if (state.app) {
        state.app.destroy(true, { children: true });
      }
    };
  }, []);

  return <div ref={pixiContainerRef} className={s.PIXIContainer} />;
};
