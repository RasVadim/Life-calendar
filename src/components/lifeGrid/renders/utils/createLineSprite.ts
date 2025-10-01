import { Renderer, Sprite } from 'pixi.js';

import { getLineTexture } from './threadTextures';

/**
 * Creates a line Sprite with proper positioning
 */
export const createLineSprite = (
  renderer: Renderer,
  x: number,
  y: number,
  width: number,
  color: number,
): Sprite => {
  const sprite = new Sprite(getLineTexture(renderer));
  sprite.tint = color;
  sprite.x = x;
  sprite.y = y;
  sprite.width = width;
  return sprite;
};
