import { Container, Renderer } from 'pixi.js';

import { createCircleSprite, createLine } from './utils';
import { CIRCLE_OFFSET } from '../constants/thread';

type TRenderSeasonThreadLineParams = {
  container: Container;
  renderer: Renderer;
  startX: number; // season start cap (left)
  endX: number; // season end cap (right); pulled to a cell centre for mid-week ends
  threadY: number;
  colorNumber: number;
};

/**
 * Season thread: a single underline for one season block with a start and an end
 * cap. The block is one season, so unlike month threads there is no in-row colour
 * switch — the whole line is one colour. Mid-week season ends are conveyed by the
 * caller pulling endX to the last cell's centre (a "half" end).
 */
export const renderSeasonThreadLine = ({
  container,
  renderer,
  startX,
  endX,
  threadY,
  colorNumber,
}: TRenderSeasonThreadLineParams) => {
  if (endX <= startX) {
    container.addChild(createCircleSprite(renderer, startX, threadY, colorNumber));
    return;
  }

  container.addChild(createCircleSprite(renderer, startX, threadY, colorNumber));
  container.addChild(
    createLine(startX + CIRCLE_OFFSET, threadY, endX - startX - 2 * CIRCLE_OFFSET, colorNumber),
  );
  container.addChild(createCircleSprite(renderer, endX, threadY, colorNumber));
};
