import { Application } from 'pixi.js';

import { THEMES } from '@/constants/themes';
import { IWeek } from '@/store/clientDB';

import { resizeApp } from './resizeApp';

type TInitPixiOptions = {
  container: HTMLDivElement;
  weeks: IWeek[];
  theme: (typeof THEMES)[keyof typeof THEMES];
  onDestroy?: () => void;
};

/**
 * Initializes PixiJS application with full setup including canvas mounting and resize handling.
 * @param options - Container, weeks data, theme and cleanup callback
 * @returns Promise<Application|null>
 */
export async function initPixi(options: TInitPixiOptions) {
  const { container, weeks, theme, onDestroy } = options;

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
    container.appendChild(app.canvas);

    // Initial resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      app.renderer.resize(width, height);
      resizeApp({ app, weeks, theme });
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

    return { app, cleanup };
  } catch (e) {
    console.error('PixiJS init error:', e);
    return null;
  }
}
