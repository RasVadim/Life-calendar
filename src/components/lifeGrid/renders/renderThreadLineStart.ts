import { Container, Renderer } from 'pixi.js';

import { EMonthsEndsIndxsValues } from '@/types';

import { THREAD_CIRCLE_GAP, WEEK_IN_MONTH_GAP } from '../constants';
import { CIRCLE_OFFSET, DOUBLE_CIRCLE_GAP } from '../constants/thread';
import { getCachedColor } from '../utils';
import { createCircleSprite, createLine } from './utils';

/**
 * Calculates positions for Half week type
 */
const calculateHalfPositions = (weekX: number, actualWeekWidth: number) => {
  const centerX = weekX + actualWeekWidth / 2;
  const lineStartX = centerX + CIRCLE_OFFSET;
  const lineEndX = weekX + actualWeekWidth;
  return { centerX, lineStartX, lineEndX };
};

/**
 * Calculates positions for Full week type
 */
const calculateFullPositions = (weekX: number, actualWeekWidth: number) => {
  const centerX = weekX + WEEK_IN_MONTH_GAP;
  const lineStartX = centerX + CIRCLE_OFFSET;
  const lineEndX = weekX + actualWeekWidth;
  return { centerX, lineStartX, lineEndX };
};

/**
 * Calculates positions for Border week types (FullBorder, HalfBorder)
 */
const calculateBorderPositions = (
  centerX: number,
  lineStartX: number,
  lineEndX: number,
  containerWidth: number,
) => {
  const lineWidth = lineEndX - lineStartX;
  const circle2X = centerX + lineWidth;
  const circle3X = centerX + lineWidth + DOUBLE_CIRCLE_GAP;
  const lineStartX2 = circle3X + CIRCLE_OFFSET;
  const lineEndX2 = containerWidth;
  return { circle2X, circle3X, lineStartX2, lineEndX2 };
};

/**
 * Calculates positions for End week types (FullBorderEnd, HalfBorderEnd)
 */
const calculateEndPositions = (centerX: number, lineStartX: number, lineEndX: number) => {
  const lineWidth = lineEndX - lineStartX;
  const circle2X = centerX + lineWidth;
  return { circle2X };
};

type TRenderThreadLineStartParams = {
  container: Container;
  weekX: number;
  threadY: number;
  currentColor: string;
  nextColor: string;
  containerWidth: number;
  weekType: EMonthsEndsIndxsValues;
  weekWidth: number;
  largeWeekWidth: number;
  isPreview: boolean;
  renderer: Renderer;
  // Pre-calculated color numbers for optimization
  currentColorNumber?: number;
  nextColorNumber?: number;
};

export const renderThreadLineStart = ({
  container,
  weekX,
  threadY,
  currentColor,
  nextColor,
  containerWidth,
  weekType,
  weekWidth,
  largeWeekWidth,
  isPreview,
  renderer,
  currentColorNumber,
  nextColorNumber,
}: TRenderThreadLineStartParams) => {
  const actualWeekWidth = isPreview ? largeWeekWidth : weekWidth;

  // Use pre-calculated color numbers if provided, otherwise calculate them
  const currentColorNum = currentColorNumber ?? getCachedColor(currentColor).toNumber();
  const nextColorNum = nextColorNumber ?? getCachedColor(nextColor).toNumber();

  switch (weekType) {
    case EMonthsEndsIndxsValues.Half: {
      // Half: circle in center + line to right edge of current week
      const { centerX, lineStartX, lineEndX } = calculateHalfPositions(weekX, actualWeekWidth);

      // Draw circle in center
      const circle = createCircleSprite(renderer, centerX, threadY, currentColorNum);
      container.addChild(circle);

      // Draw line from circle to right edge of current week
      const thread = createLine(lineStartX, threadY, lineEndX - lineStartX, currentColorNum);
      container.addChild(thread);
      break;
    }
    case EMonthsEndsIndxsValues.Full: {
      // Full: circle in center + line to right edge of current week
      const { centerX, lineStartX, lineEndX } = calculateFullPositions(weekX, actualWeekWidth);

      // Draw circle in center
      const circle = createCircleSprite(renderer, centerX, threadY, currentColorNum);
      container.addChild(circle);

      // Draw line from circle to right edge of current week
      const thread = createLine(lineStartX, threadY, lineEndX - lineStartX, currentColorNum);
      container.addChild(thread);
      break;
    }

    case EMonthsEndsIndxsValues.FullBorder: {
      // FullBorder: multiple circles and lines for border week
      const centerX = weekX + WEEK_IN_MONTH_GAP;
      const lineStartX = centerX + CIRCLE_OFFSET;
      const lineEndX = weekX + actualWeekWidth / 2;

      // Calculate border positions
      const { circle2X, circle3X, lineStartX2, lineEndX2 } = calculateBorderPositions(
        centerX,
        lineStartX,
        lineEndX,
        containerWidth,
      );

      // Draw first circle
      const circle1 = createCircleSprite(renderer, centerX, threadY, currentColorNum);
      container.addChild(circle1);

      // Draw first line
      const thread = createLine(
        lineStartX,
        threadY,
        lineEndX - lineStartX - THREAD_CIRCLE_GAP,
        currentColorNum,
      );
      container.addChild(thread);

      // Draw second circle
      const circle2 = createCircleSprite(renderer, circle2X, threadY, currentColorNum);
      container.addChild(circle2);

      // Draw third circle
      const circle3 = createCircleSprite(renderer, circle3X, threadY, nextColorNum);
      container.addChild(circle3);

      // Draw second line
      const thread2 = createLine(lineStartX2, threadY, lineEndX2, nextColorNum);
      container.addChild(thread2);

      break;
    }

    case EMonthsEndsIndxsValues.HalfBorder: {
      // HalfBorder: multiple circles and lines for half border week
      const centerX = weekX + actualWeekWidth / 4 + WEEK_IN_MONTH_GAP;
      const lineStartX = centerX + CIRCLE_OFFSET;
      const lineEndX = weekX + actualWeekWidth / 2 + WEEK_IN_MONTH_GAP;

      // Calculate border positions
      const { circle2X, circle3X, lineStartX2, lineEndX2 } = calculateBorderPositions(
        centerX,
        lineStartX,
        lineEndX,
        containerWidth,
      );

      // Draw first circle
      const circle1 = createCircleSprite(renderer, centerX, threadY, currentColorNum);
      container.addChild(circle1);

      // Draw first line
      const thread = createLine(
        lineStartX,
        threadY,
        lineEndX - lineStartX - THREAD_CIRCLE_GAP,
        currentColorNum,
      );
      container.addChild(thread);

      // Draw second circle
      const circle2 = createCircleSprite(renderer, circle2X, threadY, currentColorNum);
      container.addChild(circle2);

      // Draw third circle
      const circle3 = createCircleSprite(renderer, circle3X, threadY, nextColorNum);
      container.addChild(circle3);

      // Draw second line
      const thread2 = createLine(lineStartX2, threadY, lineEndX2, nextColorNum);
      container.addChild(thread2);

      break;
    }

    case EMonthsEndsIndxsValues.FullBorderEnd: {
      // FullBorderEnd: two circles and line for border end week
      const centerX = weekX + WEEK_IN_MONTH_GAP;
      const lineStartX = centerX + CIRCLE_OFFSET;
      const lineEndX = weekX + actualWeekWidth;

      // Calculate end positions
      const { circle2X } = calculateEndPositions(centerX, lineStartX, lineEndX);

      // Draw first circle
      const circle1 = createCircleSprite(renderer, centerX, threadY, currentColorNum);
      container.addChild(circle1);

      // Draw line
      const thread = createLine(
        lineStartX,
        threadY,
        lineEndX - lineStartX - WEEK_IN_MONTH_GAP,
        currentColorNum,
      );
      container.addChild(thread);

      // Draw second circle - adjust position to account for anchor centering
      const circle2 = createCircleSprite(
        renderer,
        circle2X - CIRCLE_OFFSET,
        threadY,
        currentColorNum,
      );
      container.addChild(circle2);

      break;
    }

    case EMonthsEndsIndxsValues.HalfBorderEnd: {
      // HalfBorderEnd: two circles and line for half border end week
      const centerX = weekX + actualWeekWidth / 2;
      const lineStartX = centerX + CIRCLE_OFFSET;
      const lineEndX = weekX + actualWeekWidth;

      // Calculate end positions
      const { circle2X } = calculateEndPositions(centerX, lineStartX, lineEndX);

      // Draw first circle
      const circle1 = createCircleSprite(renderer, centerX, threadY, currentColorNum);
      container.addChild(circle1);

      // Draw line
      const thread = createLine(
        lineStartX,
        threadY,
        lineEndX - lineStartX - WEEK_IN_MONTH_GAP,
        currentColorNum,
      );
      container.addChild(thread);

      // Draw second circle - adjust position to account for anchor centering
      const circle2 = createCircleSprite(
        renderer,
        circle2X - CIRCLE_OFFSET,
        threadY,
        currentColorNum,
      );
      container.addChild(circle2);

      break;
    }

    default: {
      break;
    }
  }
};
