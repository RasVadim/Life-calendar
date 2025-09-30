import { Container, Graphics, Sprite, Texture, Renderer } from 'pixi.js';

import { THREAD_CIRCLE_GAP } from '../constants';
import { getCachedColor } from '../utils';

// Constants for thread lines
const THREAD_HEIGHT = 1;
const THREAD_CIRCLE_RADIUS = 2;

// Cached textures for performance optimization
let circleTexture: Texture | null = null;
let lineTexture: Texture | null = null;

/**
 * Creates cached circle texture
 */
const getCircleTexture = (renderer: Renderer): Texture => {
  if (!circleTexture) {
    const graphics = new Graphics();
    graphics.circle(0, 0, THREAD_CIRCLE_RADIUS).stroke({ color: 0xffffff, width: THREAD_HEIGHT });
    circleTexture = renderer.generateTexture(graphics);
  }
  return circleTexture;
};

/**
 * Creates cached line texture
 */
const getLineTexture = (renderer: Renderer): Texture => {
  if (!lineTexture) {
    const graphics = new Graphics();
    graphics.rect(0, 0, 100, THREAD_HEIGHT).fill(0xffffff);
    lineTexture = renderer.generateTexture(graphics);
  }
  return lineTexture;
};

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
  renderer: Renderer;
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
  renderer,
}: TRenderRowThreadLineParams) => {
  const currentColorNumber = getCachedColor(currentColor).toNumber();
  const nextColorNumber = getCachedColor(nextColor).toNumber();

  if (drawToLeftEdge) {
    // Draw the line (shortened by circle radius to avoid overlap)
    {
      const lineEndX = endX - THREAD_CIRCLE_RADIUS;
      const lineWidth = lineEndX - startX;
      const thread = new Sprite(getLineTexture(renderer));
      thread.tint = currentColorNumber;
      thread.x = startX;
      thread.y = y;
      thread.width = lineWidth;
      container.addChild(thread);
    }
  }
  // Draw the first hollow circle (current month color)
  const circle1 = new Sprite(getCircleTexture(renderer));
  circle1.tint = currentColorNumber;
  circle1.anchor.set(0.5, 0.5); // Center the sprite
  circle1.x = endX;
  circle1.y = y;
  container.addChild(circle1);

  if (drawToRightEdge) {
    // Draw the second hollow circle (next month color)
    const circle2X = endX + THREAD_CIRCLE_RADIUS * 2 + THREAD_CIRCLE_GAP;
    const circle2 = new Sprite(getCircleTexture(renderer));
    circle2.tint = nextColorNumber;
    circle2.anchor.set(0.5, 0.5); // Center the sprite
    circle2.x = circle2X;
    circle2.y = y;
    container.addChild(circle2);

    // Draw the second thread line from second circle to right edge of screen
    const secondLineStartX = circle2X + THREAD_CIRCLE_RADIUS;
    const secondLineWidth = containerWidth - secondLineStartX;
    const secondThread = new Sprite(getLineTexture(renderer));
    secondThread.tint = nextColorNumber;
    secondThread.x = secondLineStartX;
    secondThread.y = y;
    secondThread.width = secondLineWidth;
    container.addChild(secondThread);
  }
};
