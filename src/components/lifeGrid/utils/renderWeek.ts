import { GlowFilter } from 'pixi-filters';
import { Container, Graphics } from 'pixi.js';

import { IWeek } from '@/store/clientDB';

import { getBGColor } from './getBGColor';
import { getBorderColor } from './getBorderColor';
import { normalizeHex } from './normalizeHex';

/**
 * Renders a single week on the given PixiJS stage.
 * @param week - Week object to render
 * @param theme - Theme palette
 * @param x - X position of the week
 * @param y - Y position of the week
 * @param cellWidth - Width of the cell
 * @param cellHeight - Height of the cell
 * @param isMedium - Whether to use medium size styling
 * @param isPresent - Whether this is the present week (for glow effect)
 * @param stage - PixiJS Container
 */
export const renderWeek = ({
  week,
  theme,
  x,
  y,
  cellWidth,
  cellHeight,
  isMedium,
  isPresent,
  stage,
}: {
  week: IWeek;
  theme: Record<string, string>;
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  isMedium: boolean;
  isPresent: boolean;
  stage: Container;
}) => {
  const bgColorStr = normalizeHex(getBGColor(week.holidays, theme));
  const borderColorStr = normalizeHex(getBorderColor(week.type, theme));
  const bgColor = /^#[0-9A-Fa-f]{6}$/.test(bgColorStr)
    ? parseInt(bgColorStr.replace('#', ''), 16)
    : 0xff00ff;
  const borderColor = /^#[0-9A-Fa-f]{6}$/.test(borderColorStr)
    ? parseInt(borderColorStr.replace('#', ''), 16)
    : 0x00ffff;

  const g = new Graphics();
  g.setStrokeStyle({ width: isMedium ? 1 : 2, color: borderColor });
  const borderRadius = isMedium ? 2 : 4;
  const finalRadius = isPresent ? borderRadius + 1 : borderRadius;

  g.roundRect(x, y, cellWidth, cellHeight, finalRadius);
  g.fill({ color: bgColor });
  g.stroke();

  if (isPresent) {
    g.filters = [
      new GlowFilter({
        color: borderColor,
        distance: 10,
        outerStrength: 2,
        innerStrength: 0,
        quality: 10,
      }),
    ];
  }

  stage.addChild(g);
};
