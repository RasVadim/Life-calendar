import { Container, Graphics } from 'pixi.js';

import { THREAD_CIRCLE_GAP } from '../constants';
import { getCachedColor } from '../utils';

// Constants for thread lines
const THREAD_HEIGHT = 1;
const THREAD_CIRCLE_RADIUS = 2;

type TRenderRowThreadLineParams = {
  container: Container;
  startX: number;
  endX: number;
  y: number;
  currentColor: string;
  nextColor: string;
  containerWidth: number;
  drawToLeftEdge?: boolean;
  drawToRightEdge?: boolean;
};

/**
 * Render thread line under a row of weeks with two hollow circles at the end
 */
export const renderRowThreadLine = ({
  container,
  startX,
  endX,
  y,
  currentColor,
  nextColor,
  containerWidth,
  drawToLeftEdge = true,
  drawToRightEdge = true,
}: TRenderRowThreadLineParams) => {
  const currentColorNumber = getCachedColor(currentColor).toNumber();
  const nextColorNumber = getCachedColor(nextColor).toNumber();

  if (drawToLeftEdge) {
    // Draw the line (shortened by circle radius to avoid overlap)
    {
      const lineEndX = endX - THREAD_CIRCLE_RADIUS;
      const thread = new Graphics();
      thread.rect(startX, y, lineEndX - startX, THREAD_HEIGHT).fill(currentColorNumber);
      container.addChild(thread);
    }
  }
  // Draw the first hollow circle (current month color)
  const circle1 = new Graphics();
  circle1
    .circle(endX, y + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
    .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
  container.addChild(circle1);

  if (drawToRightEdge) {
    // Draw the second hollow circle (next month color)
    const circle2X = endX + THREAD_CIRCLE_RADIUS * 2 + THREAD_CIRCLE_GAP;
    const circle2 = new Graphics();
    circle2
      .circle(circle2X, y + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
      .stroke({ color: nextColorNumber, width: THREAD_HEIGHT });
    container.addChild(circle2);

    // Draw the second thread line from second circle to right edge of screen
    const secondLineStartX = circle2X + THREAD_CIRCLE_RADIUS;
    const secondThread = new Graphics();
    secondThread
      .rect(secondLineStartX, y, containerWidth - secondLineStartX, THREAD_HEIGHT)
      .fill(nextColorNumber);
    container.addChild(secondThread);
  }
};
