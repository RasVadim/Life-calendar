import { Container, Renderer } from 'pixi.js';

import { EMonthsWeekIndxsValues } from '@/types';

import { THREAD_CIRCLE_GAP, WEEK_IN_MONTH_GAP } from '../constants';
import { createCircleSprite, createLine } from './utils';
import { THREAD_CIRCLE_RADIUS } from '../constants/thread';

type TRenderRowThreadLineParams = {
  container: Container;
  weekX: number;
  startX: number;
  threadY: number;
  containerWidth: number;
  weekType: EMonthsWeekIndxsValues;
  weekWidth: number;
  largeWeekWidth: number;
  isPreview: boolean;
  renderer: Renderer;
  // Pre-calculated color numbers for optimization
  currentColorNumber: number;
  nextColorNumber: number;
  isFirstRow: boolean;
};

export const renderRowThreadLine = ({
  container,
  weekX,
  startX,
  threadY,
  containerWidth,
  weekType,
  weekWidth,
  largeWeekWidth,
  isPreview,
  renderer,
  currentColorNumber,
  nextColorNumber,
  isFirstRow,
}: TRenderRowThreadLineParams) => {
  // Calculate positions based on week parameters
  const actualWeekWidth = isPreview ? largeWeekWidth : weekWidth;
  const y = threadY;

  switch (weekType) {
    case EMonthsWeekIndxsValues.First4:
    case EMonthsWeekIndxsValues.First5: {
      const lineWidth = weekX - startX + weekWidth;
      const thread = createLine(startX, y, lineWidth, currentColorNumber);
      container.addChild(thread);
      break;
    }
    case EMonthsWeekIndxsValues.FirstFull4: {
      // First weeks: just a line (no circles)
      const lineEndX =
        startX + WEEK_IN_MONTH_GAP + THREAD_CIRCLE_RADIUS + THREAD_CIRCLE_GAP + weekWidth / 2;
      const circle1 = createCircleSprite(renderer, lineEndX, y, currentColorNumber);
      container.addChild(circle1);

      const lineWidth = weekX - startX + weekWidth;
      const thread = createLine(lineEndX + THREAD_CIRCLE_RADIUS, y, lineWidth, currentColorNumber);
      container.addChild(thread);
      break;
    }
    case EMonthsWeekIndxsValues.FirstFull5: {
      // First weeks: just a line (no circles)
      const lineEndX = startX + WEEK_IN_MONTH_GAP + THREAD_CIRCLE_RADIUS + THREAD_CIRCLE_GAP;
      const circle1 = createCircleSprite(renderer, lineEndX, y, currentColorNumber);
      container.addChild(circle1);

      const lineWidth = weekX - startX + weekWidth;
      const thread = createLine(lineEndX + THREAD_CIRCLE_RADIUS, y, lineWidth, currentColorNumber);
      container.addChild(thread);
      break;
    }

    case EMonthsWeekIndxsValues.Border: {
      // Border: line + two circles (current and next month colors)

      // Draw the line (shortened by circle radius to avoid overlap)
      const lineEndX = weekX + actualWeekWidth / 2;
      const lineWidth = lineEndX - startX;
      const thread = createLine(
        startX + (isFirstRow ? 0 : weekWidth),
        y,
        lineWidth - THREAD_CIRCLE_RADIUS - (isFirstRow ? 0 : weekWidth),
        currentColorNumber,
      );
      container.addChild(thread);

      // Draw the first hollow circle (current month color)
      const circle1 = createCircleSprite(renderer, lineEndX, y, currentColorNumber);
      container.addChild(circle1);

      // Draw the second hollow circle (next month color)
      const circle2X = lineEndX + THREAD_CIRCLE_RADIUS * 2 + THREAD_CIRCLE_GAP;
      const circle2 = createCircleSprite(renderer, circle2X, y, nextColorNumber);
      container.addChild(circle2);

      // Draw the second thread line from second circle to right edge of screen
      const secondLineStartX = circle2X + THREAD_CIRCLE_RADIUS;
      const secondLineWidth = containerWidth - secondLineStartX;
      const secondThread = createLine(secondLineStartX, y, secondLineWidth, nextColorNumber);
      container.addChild(secondThread);

      break;
    }

    case EMonthsWeekIndxsValues.BorderEnd: {
      // BorderEnd: line + one circle (current month color only)

      // Draw the line (shortened by circle radius to avoid overlap)
      const lineEndX = weekX + actualWeekWidth - THREAD_CIRCLE_GAP - THREAD_CIRCLE_RADIUS;
      const lineWidth = lineEndX - startX;
      const thread = createLine(startX, y, lineWidth, currentColorNumber);
      container.addChild(thread);

      // Draw the hollow circle (current month color)
      const circle1 = createCircleSprite(
        renderer,
        weekX + actualWeekWidth - THREAD_CIRCLE_GAP,
        y,
        currentColorNumber,
      );
      container.addChild(circle1);

      break;
    }

    default: {
      break;
    }
  }
};
