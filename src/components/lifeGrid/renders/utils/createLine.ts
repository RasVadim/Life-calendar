import { Graphics } from 'pixi.js';

import { THREAD_HEIGHT } from '../../constants/thread';

/**
 * Creates a line Graphics object
 */
export const createLine = (x: number, y: number, width: number, color: number): Graphics => {
  const line = new Graphics();
  line.rect(x, y, width, THREAD_HEIGHT).fill(color);
  return line;
};
