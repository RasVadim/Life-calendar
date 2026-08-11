import { Container, Renderer } from 'pixi.js';

import { createCircleSprite, createLine } from './utils';
import { CIRCLE_OFFSET, DOUBLE_CIRCLE_GAP, THREAD_CIRCLE_GAP } from '../constants/thread';

// Nudge the border-transition dot pair slightly off the cell centre toward the
// week's end, so it reads as "end of this week" rather than dead-centre.
const BORDER_DOTS_NUDGE = 1;

// How a season block's underline terminates, mirroring the month thread vocabulary.
//
// Start:
// - full:        season starts on Monday (clean boundary) — a dot at the cell's left.
// - halfLife:    life starts mid-week (birth) — a dot at the birth point (cell centre).
// - wrapIn:      season continued from the previous block's mid-week border — a plain
//                line slides in from the left screen edge (no dot; dots live on that border).
// - borderStart: this block's first cell IS the shared (two-season) week — the previous
//                season arrives from the left edge and hands off at the cell centre.
// End:
// - full:        season ends on Sunday (clean boundary) — a dot at the cell's right.
// - halfLife:    life ends mid-week (death) — a dot at the death point (cell centre).
// - borderEnd:   season ends mid-week — hands off to the next season at the cell centre,
//                then the next colour slides off the right screen edge (re-enters next block).
export type TSeasonStartCap = 'full' | 'halfLife' | 'wrapIn' | 'borderStart';
export type TSeasonEndCap = 'full' | 'halfLife' | 'borderEnd';

type TRenderSeasonThreadLineParams = {
  container: Container;
  renderer: Renderer;
  threadY: number;
  containerWidth: number; // right screen edge for mid-week wraps
  startX: number; // left edge of the first (chronological) cell
  startWidth: number;
  endX: number; // left edge of the last (chronological) cell
  endWidth: number;
  startCap: TSeasonStartCap;
  endCap: TSeasonEndCap;
  colorNumber: number; // this season's colour
  otherColorNumber: number; // neighbouring season's colour (mid-week handoffs)
};

export const renderSeasonThreadLine = ({
  container,
  renderer,
  threadY: y,
  containerWidth,
  startX,
  startWidth,
  endX,
  endWidth,
  startCap,
  endCap,
  colorNumber,
  otherColorNumber,
}: TRenderSeasonThreadLineParams) => {
  const circle = (x: number, color: number) =>
    container.addChild(createCircleSprite(renderer, x, y, color));
  const line = (fromX: number, toX: number, color: number) => {
    if (toX > fromX) container.addChild(createLine(fromX, y, toX - fromX, color));
  };

  // ----- start cap: where the coloured underline begins -----
  let lineFromX: number;
  switch (startCap) {
    case 'wrapIn': {
      lineFromX = 0; // slide in from the left screen edge, no marker
      break;
    }
    case 'borderStart': {
      // Two transition dots centred on the shared cell (prev | this).
      const centerX = startX + startWidth / 2;
      const prevCircleX = centerX - DOUBLE_CIRCLE_GAP / 2;
      const thisCircleX = centerX + DOUBLE_CIRCLE_GAP / 2;
      line(0, prevCircleX - CIRCLE_OFFSET, otherColorNumber);
      circle(prevCircleX, otherColorNumber);
      circle(thisCircleX, colorNumber);
      lineFromX = thisCircleX + CIRCLE_OFFSET;
      break;
    }
    case 'halfLife': {
      const birthX = startX + startWidth / 2;
      circle(birthX, colorNumber);
      lineFromX = birthX + CIRCLE_OFFSET;
      break;
    }
    default: {
      // Inset from the cell's left edge so the dot doesn't poke outside the week.
      const dotX = startX + THREAD_CIRCLE_GAP;
      circle(dotX, colorNumber);
      lineFromX = dotX + CIRCLE_OFFSET;
      break;
    }
  }

  // ----- end cap: draw the middle line and terminate -----
  switch (endCap) {
    case 'borderEnd': {
      // Two transition dots centred on the shared (last) cell (this | next),
      // nudged a touch toward the week's end.
      const centerX = endX + endWidth / 2 + BORDER_DOTS_NUDGE;
      const thisCircleX = centerX - DOUBLE_CIRCLE_GAP / 2;
      const nextCircleX = centerX + DOUBLE_CIRCLE_GAP / 2;
      line(lineFromX, thisCircleX - CIRCLE_OFFSET, colorNumber);
      circle(thisCircleX, colorNumber);
      circle(nextCircleX, otherColorNumber);
      line(nextCircleX + CIRCLE_OFFSET, containerWidth, otherColorNumber);
      break;
    }
    case 'halfLife': {
      const deathX = endX + endWidth / 2;
      line(lineFromX, deathX - CIRCLE_OFFSET, colorNumber);
      circle(deathX, colorNumber);
      break;
    }
    default: {
      // Inset from the cell's right edge so the dot doesn't poke outside the week.
      const dotX = endX + endWidth - THREAD_CIRCLE_GAP;
      line(lineFromX, dotX - CIRCLE_OFFSET, colorNumber);
      circle(dotX, colorNumber);
      break;
    }
  }
};
