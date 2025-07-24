import { Application } from 'pixi.js';

import { resizeApp } from './resizeApp';
import { TLifeGridState } from '../types';

type TInitPixiOptions = {
  state: TLifeGridState;
  onDestroy?: () => void;
};

/**
 * Initializes PixiJS application with full setup including canvas mounting and resize handling.
 * @param options - Container, weeks data, theme and cleanup callback
 * @returns Promise<Application|null>
 */
export async function initPixi({ state, onDestroy }: TInitPixiOptions) {
  const { container } = state;
  try {
    const app = new Application();
    await app.init({
      width: 100,
      height: 100,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    // Add canvas to container
    container?.appendChild(app.canvas);

    // Update state with new app
    state.app = app;

    // Initial resize
    const handleResize = () => {
      const width = container?.clientWidth || 0;
      const height = container?.clientHeight || 0;
      app.renderer.resize(width, height);

      state.scrollContainer = resizeApp(state) || null;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Return cleanup function
    const cleanup = () => {
      window.removeEventListener('resize', handleResize);
      if (app && typeof app.destroy === 'function') {
        app.destroy(true, { children: true });
      }
      onDestroy?.();
    };

    return { cleanup };
  } catch (e) {
    console.error('PixiJS init error:', e);
    return null;
  }
}
