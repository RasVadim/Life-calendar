import { Container, Renderer } from 'pixi.js';

import { EMonthsEndsIndxsValues } from '@/types';

import { WEEK_IN_MONTH_GAP } from '../constants';
import { CIRCLE_OFFSET, DOUBLE_CIRCLE_GAP } from '../constants/thread';
import { createCircleSprite, createLine } from './utils';

type TRenderThreadLineEndParams = {
  container: Container;
  startX: number;
  weekX: number;
  threadY: number;
  containerWidth: number;
  weekType: EMonthsEndsIndxsValues;
  weekWidth: number;
  largeWeekWidth: number;
  isPreview: boolean;
  renderer: Renderer;
  currentColorNumber: number;
  nextColorNumber: number;
};

/**
 * Thread cap for the death week — horizontal mirror of `renderThreadLineStart`.
 * The birth week's month grows to the right (future); here the month(s) arrive
 * from the left (`startX`, the past) and terminate at `endX`. `endX` sits at the
 * right edge for a full week (dies on Sunday) or at the center for a half week
 * (dies mid-week), so the final marker moves toward the center exactly like the
 * first week's half cap.
 */
export const renderThreadLineEnd = ({
  container,
  startX,
  weekX,
  threadY,
  weekType,
  weekWidth,
  largeWeekWidth,
  isPreview,
  renderer,
  currentColorNumber,
  nextColorNumber,
}: TRenderThreadLineEndParams) => {
  const w = isPreview ? largeWeekWidth : weekWidth;
  const y = threadY;

  const isHalf =
    weekType === EMonthsEndsIndxsValues.Half ||
    weekType === EMonthsEndsIndxsValues.HalfBorder ||
    weekType === EMonthsEndsIndxsValues.HalfBorderEnd;

  // Where the last month's content ends inside the week. A half week (death not
  // on Sunday) is drawn at the week centre, a full week at the right edge.
  const endX = weekX + (isHalf ? w / 2 : w - WEEK_IN_MONTH_GAP);

  const circle = (x: number, color: number) =>
    container.addChild(createCircleSprite(renderer, x, y, color));
  const line = (fromX: number, toX: number, color: number) =>
    container.addChild(createLine(fromX, y, toX - fromX, color));

  switch (weekType) {
    // Single month fills the week and ends at the death point.
    case EMonthsEndsIndxsValues.Full:
    case EMonthsEndsIndxsValues.Half: {
      line(startX, endX - CIRCLE_OFFSET, currentColorNumber);
      circle(endX, currentColorNumber);
      break;
    }

    // Two months: month A arrives from the left, the A→B boundary sits at the week
    // centre and month B ends at the death point — a horizontal mirror of
    // renderThreadLineStart's border, so the 3 dots stay centred in the week
    // instead of bunching up at its start.
    case EMonthsEndsIndxsValues.FullBorder:
    case EMonthsEndsIndxsValues.HalfBorder: {
      const boundaryX = weekX + w / 2; // month A → B, week centre
      const deathX = weekX + (isHalf ? (3 * w) / 4 : w - WEEK_IN_MONTH_GAP);
      const circleAX = boundaryX - DOUBLE_CIRCLE_GAP; // month A end (single)
      line(startX, circleAX - CIRCLE_OFFSET, currentColorNumber);
      circle(circleAX, currentColorNumber);
      circle(boundaryX, nextColorNumber);
      line(boundaryX + CIRCLE_OFFSET, deathX - CIRCLE_OFFSET, nextColorNumber);
      circle(deathX, nextColorNumber);
      break;
    }

    // The month began inside this very week (previous week is another month) and
    // life ends here too. Nothing arrives from the past — so this is self-contained,
    // a horizontal mirror of renderThreadLineStart's *BorderEnd: a start marker at
    // the month's beginning (left of the week) and a death marker at the end point.
    case EMonthsEndsIndxsValues.FullBorderEnd:
    case EMonthsEndsIndxsValues.HalfBorderEnd: {
      const monthStartX = weekX + WEEK_IN_MONTH_GAP;
      circle(monthStartX, currentColorNumber);
      line(monthStartX + CIRCLE_OFFSET, endX - CIRCLE_OFFSET, currentColorNumber);
      circle(endX, currentColorNumber);
      break;
    }

    default: {
      break;
    }
  }
};
