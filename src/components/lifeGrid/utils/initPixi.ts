import { Application } from 'pixi.js';

/**
 * Initialize the pixi application.
 * @param container - The container element.
 * @returns The pixi application.
 */
export const initPixi = async (container: HTMLDivElement): Promise<Application> => {
  const app = new Application();

  await app.init({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundAlpha: 0, // Make canvas transparent
    // Cap at 2x: phones report DPR 3, but rendering thousands of cells at 3x
    // (~2.25x the fill of 2x) tanks the GPU for no visible gain on this grid.
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
    antialias: true,
    resizeTo: container,
  });

  // Render-on-demand: stop the always-on 60fps loop (it re-traverses the whole
  // scene every frame even when idle). Callers render explicitly on scroll /
  // morph / paint instead — big idle CPU + battery win on mobile.
  app.ticker.stop();

  return app;
};
