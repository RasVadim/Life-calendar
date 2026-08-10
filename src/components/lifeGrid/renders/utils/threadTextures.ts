import { Graphics, Texture, Renderer } from 'pixi.js';

import { THREAD_HEIGHT, THREAD_CIRCLE_RADIUS } from '../../constants/thread';

// Cached textures for performance optimization
let circleTexture: Texture | null = null;

/**
 * Clears cached textures (call when changing birth date or re-rendering)
 */
export const clearTextureCache = (): void => {
  circleTexture = null;
};

/**
 * Checks if textures are valid
 */
const isTextureValid = (texture: Texture | null): boolean => {
  return texture !== null && !texture.destroyed;
};

/**
 * Creates cached circle texture for Sprite usage
 */
export const getCircleTexture = (renderer: Renderer): Texture => {
  if (!isTextureValid(circleTexture)) {
    const graphics = new Graphics();
    graphics.circle(0, 0, THREAD_CIRCLE_RADIUS).stroke({ color: 0xffffff, width: THREAD_HEIGHT });
    circleTexture = renderer.generateTexture(graphics);
  }
  return circleTexture!;
};
