import { Graphics, Container } from 'pixi.js';

import { IWeek } from '@/store/clientDB';

import { getBGColor } from './getBGColor';
import { getBorderColor } from './getBorderColor';

/**
 * Renders weeks grid on the given PixiJS stage.
 * @param weeks - Array of week objects
 * @param theme - Theme palette
 * @param width - Width of the canvas
 * @param height - Height of the canvas
 * @param gap - Gap between cells
 * @param stage - PixiJS Container (usually app.stage)
 */
export function renderWeeks({
  weeks,
  theme,
  width,
  height,
  gap = 2,
  stage,
}: {
  weeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  height: number;
  gap?: number;
  stage: Container;
}) {
  const cols = 52;
  const rows = Math.ceil(weeks.length / cols);
  if (rows === 0) return;
  const cellWidth = (width - gap * (cols + 1)) / cols;
  const cellHeight = (height - gap * (rows + 1)) / rows;

  weeks.forEach((week, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (cellWidth + gap) + gap;
    const y = row * (cellHeight + gap) + gap;

    const bgColorStr = getBGColor(week.holidays, theme);
    const borderColorStr = getBorderColor(week.type, theme);
    const bgColor = /^#[0-9A-Fa-f]{6}$/.test(bgColorStr)
      ? parseInt(bgColorStr.replace('#', ''), 16)
      : 0xff00ff;
    const borderColor = /^#[0-9A-Fa-f]{6}$/.test(borderColorStr)
      ? parseInt(borderColorStr.replace('#', ''), 16)
      : 0x00ffff;

    const g = new Graphics();
    g.roundRect(x, y, cellWidth, cellHeight, 2).fill({ color: bgColor });
    g.setStrokeStyle({ width: 1, color: borderColor });
    g.roundRect(x, y, cellWidth, cellHeight, 2);
    stage.addChild(g);
  });
}
