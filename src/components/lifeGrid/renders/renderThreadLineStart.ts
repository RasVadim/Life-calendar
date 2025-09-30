import { Container, Graphics } from 'pixi.js';

import { EMonthsEndsIndxsValues } from '@/types';

import { getCachedColor } from '../utils';
import { WEEK_GAP } from './renderMonthLIst';
import { THREAD_CIRCLE_GAP } from './renderRowThreadLine';

// Constants for thread lines
const THREAD_HEIGHT = 1;
const THREAD_CIRCLE_RADIUS = 2;

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
}: TRenderThreadLineStartParams) => {
  const actualWeekWidth = isPreview ? largeWeekWidth : weekWidth;
  const currentColorNumber = getCachedColor(currentColor).toNumber();
  const nextColorNumber = getCachedColor(nextColor).toNumber();

  switch (weekType) {
    case EMonthsEndsIndxsValues.Half: {
      // Half: circle in center + line to right edge of current week
      const centerX = weekX + actualWeekWidth / 2;

      // Draw circle in center
      const circle = new Graphics();
      circle
        .circle(centerX, threadY + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle);

      // Draw line from circle to right edge of current week
      const lineStartX = centerX + THREAD_CIRCLE_RADIUS;
      const lineEndX = weekX + actualWeekWidth;
      const thread = new Graphics();
      thread
        .rect(lineStartX, threadY, lineEndX - lineStartX, THREAD_HEIGHT)
        .fill(currentColorNumber);
      container.addChild(thread);
      break;
    }
    case EMonthsEndsIndxsValues.Full: {
      // Half: circle in center + line to right edge of current week
      const centerX = weekX + WEEK_GAP;

      // Draw circle in center
      const circle = new Graphics();
      circle
        .circle(centerX, threadY + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle);

      // Draw line from circle to right edge of current week
      const lineStartX = centerX + THREAD_CIRCLE_RADIUS;
      const lineEndX = weekX + actualWeekWidth;
      const thread = new Graphics();
      thread
        .rect(lineStartX, threadY, lineEndX - lineStartX, THREAD_HEIGHT)
        .fill(currentColorNumber);
      container.addChild(thread);
      break;
    }

    case EMonthsEndsIndxsValues.FullBorder: {
      // Half: circle in center + line to right edge of current week
      const centerX = weekX + WEEK_GAP;

      // Draw circle in center
      const circle1 = new Graphics();
      circle1
        .circle(centerX, threadY + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle1);

      // Draw line from circle to right edge of current week
      const lineStartX = centerX + THREAD_CIRCLE_RADIUS;
      const lineEndX = weekX + actualWeekWidth / 2;
      const thread = new Graphics();
      thread
        .rect(lineStartX, threadY, lineEndX - lineStartX - THREAD_CIRCLE_GAP, THREAD_HEIGHT)
        .fill(currentColorNumber);
      container.addChild(thread);

      const circle2 = new Graphics();
      circle2
        .circle(
          centerX + THREAD_CIRCLE_RADIUS * 2 + lineEndX - lineStartX - THREAD_CIRCLE_GAP,
          threadY + THREAD_HEIGHT / 2,
          THREAD_CIRCLE_RADIUS,
        )
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle2);

      const circle3 = new Graphics();
      circle3
        .circle(
          centerX + THREAD_CIRCLE_RADIUS * 2 + lineEndX - lineStartX + THREAD_CIRCLE_GAP,
          threadY + THREAD_HEIGHT / 2,
          THREAD_CIRCLE_RADIUS,
        )
        .stroke({ color: nextColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle3);

      // Draw line from circle to right edge of current week
      const lineStartX2 =
        centerX +
        THREAD_CIRCLE_RADIUS * 2 +
        lineEndX -
        lineStartX +
        THREAD_CIRCLE_GAP +
        THREAD_CIRCLE_RADIUS;
      const lineEndX2 = containerWidth;
      const thread2 = new Graphics();
      thread
        .rect(lineStartX2, threadY, lineEndX2 - lineStartX2 - THREAD_CIRCLE_GAP, THREAD_HEIGHT)
        .fill(nextColorNumber);
      container.addChild(thread2);

      break;
    }

    case EMonthsEndsIndxsValues.HalfBorder: {
      // Half: circle in center + line to right edge of current week
      const centerX = weekX + actualWeekWidth / 4 + WEEK_GAP;

      // Draw circle in center
      const circle1 = new Graphics();
      circle1
        .circle(centerX, threadY + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle1);

      // Draw line from circle to right edge of current week
      const lineStartX = centerX + THREAD_CIRCLE_RADIUS;
      const lineEndX = weekX + actualWeekWidth / 2 + WEEK_GAP;
      const thread = new Graphics();
      thread
        .rect(lineStartX, threadY, lineEndX - lineStartX - THREAD_CIRCLE_GAP, THREAD_HEIGHT)
        .fill(currentColorNumber);
      container.addChild(thread);

      const circle2 = new Graphics();
      circle2
        .circle(
          centerX + THREAD_CIRCLE_RADIUS * 2 + lineEndX - lineStartX - THREAD_CIRCLE_GAP,
          threadY + THREAD_HEIGHT / 2,
          THREAD_CIRCLE_RADIUS,
        )
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle2);

      const circle3 = new Graphics();
      circle3
        .circle(
          centerX + THREAD_CIRCLE_RADIUS * 2 + lineEndX - lineStartX + THREAD_CIRCLE_GAP,
          threadY + THREAD_HEIGHT / 2,
          THREAD_CIRCLE_RADIUS,
        )
        .stroke({ color: nextColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle3);

      // Draw line from circle to right edge of current week
      const lineStartX2 =
        centerX +
        THREAD_CIRCLE_RADIUS * 2 +
        lineEndX -
        lineStartX +
        THREAD_CIRCLE_GAP +
        THREAD_CIRCLE_RADIUS;
      const lineEndX2 = containerWidth;
      const thread2 = new Graphics();
      thread
        .rect(lineStartX2, threadY, lineEndX2 - lineStartX2 - THREAD_CIRCLE_GAP, THREAD_HEIGHT)
        .fill(nextColorNumber);
      container.addChild(thread2);

      break;
    }

    case EMonthsEndsIndxsValues.FullBorderEnd: {
      // Half: circle in center + line to right edge of current week
      const centerX = weekX + WEEK_GAP;

      // Draw circle in center
      const circle1 = new Graphics();
      circle1
        .circle(centerX, threadY + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle1);

      // Draw line from circle to right edge of current week
      const lineStartX = centerX + THREAD_CIRCLE_RADIUS;
      const lineEndX = weekX + actualWeekWidth;
      const thread = new Graphics();
      thread
        .rect(lineStartX, threadY, lineEndX - lineStartX - WEEK_GAP, THREAD_HEIGHT)
        .fill(currentColorNumber);
      container.addChild(thread);

      const circle2 = new Graphics();
      circle2
        .circle(
          centerX + THREAD_CIRCLE_RADIUS * 2 + lineEndX - lineStartX - WEEK_GAP,
          threadY + THREAD_HEIGHT / 2,
          THREAD_CIRCLE_RADIUS,
        )
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle2);

      break;
    }

    case EMonthsEndsIndxsValues.HalfBorderEnd: {
      // Half: circle in center + line to right edge of current week
      const centerX = weekX + actualWeekWidth / 2;

      // Draw circle in center
      const circle1 = new Graphics();
      circle1
        .circle(centerX, threadY + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle1);

      // Draw line from circle to right edge of current week
      const lineStartX = centerX + THREAD_CIRCLE_RADIUS;
      const lineEndX = weekX + actualWeekWidth;
      const thread = new Graphics();
      thread
        .rect(lineStartX, threadY, lineEndX - lineStartX - WEEK_GAP, THREAD_HEIGHT)
        .fill(currentColorNumber);
      container.addChild(thread);

      const circle2 = new Graphics();
      circle2
        .circle(
          centerX + THREAD_CIRCLE_RADIUS * 2 + lineEndX - lineStartX - WEEK_GAP,
          threadY + THREAD_HEIGHT / 2,
          THREAD_CIRCLE_RADIUS,
        )
        .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
      container.addChild(circle2);

      break;
    }

    default: {
      break;
    }
  }
};
