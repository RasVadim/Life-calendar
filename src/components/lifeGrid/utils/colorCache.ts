import { Color } from 'pixi.js';

const colorCache = new Map<string, Color>();

export const getCachedColor = (colorString: string): Color => {
  let cached = colorCache.get(colorString);
  if (!cached) {
    cached = new Color(colorString);
    colorCache.set(colorString, cached);
  }
  return cached;
};
