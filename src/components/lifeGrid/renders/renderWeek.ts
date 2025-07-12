import { GlowFilter } from 'pixi-filters';
import { Container, Graphics } from 'pixi.js';

import { LIFE_MODES } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { TLifeMode } from '@/types';

import { getBGColor, getBorderColor, normalizeHex } from '../utils';

const BORDER_RADIUS_MAP = {
  [LIFE_MODES.YEARS]: { small: 2, large: 4 },
  [LIFE_MODES.SEASONS]: { small: 4, large: 6 },
  [LIFE_MODES.MONTHS]: { small: 14, large: 22 },
};

const borderWidthMap = {
  [LIFE_MODES.YEARS]: { small: 1, large: 2 },
  [LIFE_MODES.SEASONS]: { small: 1, large: 2 },
  [LIFE_MODES.MONTHS]: { small: 2, large: 3 },
};

type TRenderWeekProps = {
  week: IWeek;
  theme: Record<string, string>;
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  isMedium: boolean;
  isPresent: boolean;
  stage: Container;
  mode: TLifeMode;
};

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
  mode = LIFE_MODES.YEARS,
}: TRenderWeekProps) => {
  const borderRadius = BORDER_RADIUS_MAP[mode][isMedium ? 'small' : 'large'];

  const borderWidth = borderWidthMap[mode][isMedium ? 'small' : 'large'];

  const bgColorStr = normalizeHex(getBGColor(week.holidays, theme));
  const borderColorStr = normalizeHex(getBorderColor(week.type, theme));
  const bgColor = /^#[0-9A-Fa-f]{6}$/.test(bgColorStr)
    ? parseInt(bgColorStr.replace('#', ''), 16)
    : 0xff00ff;
  const borderColor = /^#[0-9A-Fa-f]{6}$/.test(borderColorStr)
    ? parseInt(borderColorStr.replace('#', ''), 16)
    : 0x00ffff;

  const g = new Graphics();
  g.setStrokeStyle({ width: borderWidth, color: borderColor });

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
