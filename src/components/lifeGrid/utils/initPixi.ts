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
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
    resizeTo: container,
  });

  return app;
};
