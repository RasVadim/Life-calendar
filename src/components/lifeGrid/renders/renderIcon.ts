import { Assets, Container, Sprite, Texture } from 'pixi.js';

import { TWeekZodiac, TZodiacIconSet } from '@/types';

import { ZODIAC_ICON_SIZE } from '../constants';

// Loaded PNG textures keyed by icon path. Colour comes from per-sprite tint, so
// one texture serves every theme — no reloads on theme change.
const textureCache = new Map<string, Texture>();

/**
 * Preload every icon of the active set so the (synchronous) seasons renderer can
 * draw them immediately. Call it when the icon set becomes available / changes,
 * then repaint. PNG-only sets (canvas) resolve to string paths; JSX sets are
 * ignored here (used by the DOM version).
 */
export const preloadZodiacTextures = async (zodiacIconSet?: TZodiacIconSet): Promise<void> => {
  if (!zodiacIconSet) return;
  const paths = Object.values(zodiacIconSet).filter(
    (value): value is string => typeof value === 'string' && !textureCache.has(value),
  );
  await Promise.all(
    paths.map(async (src) => {
      const texture = await Assets.load<Texture>({ key: src, src });
      textureCache.set(src, texture);
    }),
  );
};

type TRenderIconParams = {
  container: Container;
  zodiacIconSet?: TZodiacIconSet;
  zodiac: TWeekZodiac;
  x: number;
  y: number;
  colorNumber: number;
};

/**
 * Draw a tinted zodiac icon at (x, y) if its texture is already cached
 * (see preloadZodiacTextures). No-op for off mode / not-yet-loaded textures.
 */
export const renderIcon = ({
  container,
  zodiacIconSet,
  zodiac,
  x,
  y,
  colorNumber,
}: TRenderIconParams): void => {
  if (!zodiacIconSet) return;
  const iconPath = zodiacIconSet[zodiac];
  if (typeof iconPath !== 'string') return;

  const texture = textureCache.get(iconPath);
  if (!texture) return;

  const icon = new Sprite(texture);
  // Fit height to ZODIAC_ICON_SIZE, preserving aspect ratio.
  const scale = ZODIAC_ICON_SIZE / icon.height;
  icon.scale.set(scale, scale);
  icon.position.set(x, y);
  icon.tint = colorNumber;
  container.addChild(icon);
};
