import { Container, Graphics } from 'pixi.js';

import { EMonthsEndsIndxsValues } from '@/types';

import { THREAD_CIRCLE_GAP, WEEK_IN_MONTH_GAP } from '../constants';
import { getCachedColor } from '../utils';

// Constants for thread lines
const THREAD_HEIGHT = 1;
const THREAD_CIRCLE_RADIUS = 2;

// Derived constants for optimization
const CIRCLE_OFFSET = THREAD_CIRCLE_RADIUS;
const DOUBLE_CIRCLE_GAP = THREAD_CIRCLE_GAP * 2;

/**
 * Creates a circle Graphics object
 */
const createCircle = (x: number, y: number, color: number): Graphics => {
  const circle = new Graphics();
  circle
    .circle(x, y + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
    .stroke({ color, width: THREAD_HEIGHT });
  return circle;
};

/**
 * Creates a line Graphics object
 */
const createLine = (x: number, y: number, width: number, color: number): Graphics => {
  const line = new Graphics();
  line.rect(x, y, width, THREAD_HEIGHT).fill(color);
  return line;
};

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
      const circle = createCircle(centerX, threadY, currentColorNum);
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
      const circle = createCircle(centerX, threadY, currentColorNum);
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
      const circle1 = createCircle(centerX, threadY, currentColorNum);
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
      const circle2 = createCircle(circle2X, threadY, currentColorNum);
      container.addChild(circle2);

      // Draw third circle
      const circle3 = createCircle(circle3X, threadY, nextColorNum);
      container.addChild(circle3);

      // Draw second line
      const thread2 = createLine(
        lineStartX2,
        threadY,
        lineEndX2 - lineStartX2 - THREAD_CIRCLE_GAP,
        nextColorNum,
      );
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
      const circle1 = createCircle(centerX, threadY, currentColorNum);
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
      const circle2 = createCircle(circle2X, threadY, currentColorNum);
      container.addChild(circle2);

      // Draw third circle
      const circle3 = createCircle(circle3X, threadY, nextColorNum);
      container.addChild(circle3);

      // Draw second line
      const thread2 = createLine(
        lineStartX2,
        threadY,
        lineEndX2 - lineStartX2 - THREAD_CIRCLE_GAP,
        nextColorNum,
      );
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
      const circle1 = createCircle(centerX, threadY, currentColorNum);
      container.addChild(circle1);

      // Draw line
      const thread = createLine(
        lineStartX,
        threadY,
        lineEndX - lineStartX - WEEK_IN_MONTH_GAP,
        currentColorNum,
      );
      container.addChild(thread);

      // Draw second circle
      const circle2 = createCircle(circle2X, threadY, currentColorNum);
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
      const circle1 = createCircle(centerX, threadY, currentColorNum);
      container.addChild(circle1);

      // Draw line
      const thread = createLine(
        lineStartX,
        threadY,
        lineEndX - lineStartX - WEEK_IN_MONTH_GAP,
        currentColorNum,
      );
      container.addChild(thread);

      // Draw second circle
      const circle2 = createCircle(circle2X, threadY, currentColorNum);
      container.addChild(circle2);

      break;
    }

    default: {
      break;
    }
  }
};
