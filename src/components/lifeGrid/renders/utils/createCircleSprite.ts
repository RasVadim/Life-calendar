import { Renderer, Sprite } from 'pixi.js';

import { getCircleTexture } from './threadTextures';

/**
 * Creates a circle Sprite with proper positioning
 */
export const createCircleSprite = (
  renderer: Renderer,
  x: number,
  y: number,
  color: number,
): Sprite => {
  const sprite = new Sprite(getCircleTexture(renderer));
  sprite.tint = color;
  sprite.anchor.set(0.5, 0.5); // Center the sprite
  sprite.x = x;
  sprite.y = y;
  return sprite;
};
