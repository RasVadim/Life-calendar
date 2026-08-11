import { GlowFilter } from 'pixi-filters';
import { Container, Graphics, GraphicsContext, FillGradient } from 'pixi.js';

import { ELifeMode, ESide, EWeekType, THolidayName } from '@/types';

import { BORDER_RADIUS_MAP, BORDER_WIDTH_MAP } from '../constants';
import { getBGColor, getBorderColor, getCachedColor } from '../utils';

// Cache for gradient objects
const gradientCache = new Map<string, FillGradient>();

// Shared week geometry: one GraphicsContext per (size, radius, border, colours)
// combo, reused by every matching cell. This turns thousands of per-cell
// tessellations per paint into a handful of geometry builds — the single biggest
// win for paint cost (which fires at each morph end / resize) on mobile.
const contextCache = new Map<string, GraphicsContext>();

// Drop cached geometry / gradients (theme change, HMR, birth-date regen).
export const clearWeekCache = (): void => {
  contextCache.clear();
  gradientCache.clear();
};

type TRenderWeekProps = {
  theme: Record<string, string>;
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  isScreenMedium: boolean;
  stage?: Container;
  lifeMode?: ELifeMode;
  weekType: EWeekType;
  holiday: THolidayName | null;
  half: boolean | ESide;
  borderRadius?: number; // override the mode default (seasons scales it per cell size)
};

/**
 * Renders a single week on the given PixiJS stage.
 * @param theme - Theme palette
 * @param x - X position of the week
 * @param y - Y position of the week
 * @param cellWidth - Width of the cell
 * @param cellHeight - Height of the cell
 * @param isScreenMedium - Whether to use medium size styling
 * @param isPresent - Whether this is the present week (for glow effect)
 * @param stage - PixiJS Container
 */
export const renderWeek = ({
  theme,
  x,
  y,
  cellWidth,
  cellHeight,
  isScreenMedium,
  stage,
  lifeMode = ELifeMode.Years,
  weekType,
  holiday,
  half,
  borderRadius: borderRadiusOverride,
}: TRenderWeekProps) => {
  const screenSize = isScreenMedium ? 'small' : 'large';

  const borderRadius = borderRadiusOverride ?? BORDER_RADIUS_MAP[lifeMode][screenSize];
  const borderWidth = BORDER_WIDTH_MAP[lifeMode][screenSize];

  const borderColorHex = getBorderColor(weekType, theme);
  const borderColor = getCachedColor(borderColorHex);
  const bgColorHex = getBGColor(theme, holiday);
  const bgColor = getCachedColor(bgColorHex);

  const isPresent = weekType === EWeekType.Present;
  const isHalf = half === ESide.Left || half === true || half === ESide.Right;

  // --- Half week (birth/death boundary): unique gradient fill, drawn per cell.
  // These are rare (year boundaries), so a shared context isn't worth it.
  if (isHalf) {
    const gradientKey = `${bgColorHex}-${half}-${theme.background}`;
    let gradient = gradientCache.get(gradientKey);

    if (!gradient) {
      const bgColorString = bgColor.toRgbaString();
      const canvasBgColor = getCachedColor(theme.background).toRgbaString();

      gradient =
        half === ESide.Right
          ? new FillGradient({
              type: 'linear',
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
              colorStops: [
                { offset: 0, color: canvasBgColor },
                { offset: 0.85, color: bgColorString },
              ],
              textureSpace: 'local',
            })
          : new FillGradient({
              type: 'linear',
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
              colorStops: [
                { offset: 0.15, color: bgColorString },
                { offset: 1, color: canvasBgColor },
              ],
              textureSpace: 'local',
            });

      gradientCache.set(gradientKey, gradient);
    }

    const g = new Graphics();
    g.roundRect(0, 0, cellWidth, cellHeight, borderRadius).fill({ fill: gradient });
    g.setStrokeStyle({ width: borderWidth, color: borderColor });
    g.stroke();
    g.position.set(x, y);
    stage?.addChild(g);
    return;
  }

  // --- Full week: reuse a cached geometry (position is the only per-cell diff).
  const contextKey = `${cellWidth}|${cellHeight}|${borderRadius}|${borderWidth}|${borderColorHex}|${bgColorHex}`;
  let context = contextCache.get(contextKey);
  if (!context) {
    context = new GraphicsContext()
      .roundRect(0, 0, cellWidth, cellHeight, borderRadius)
      .fill({ color: bgColor })
      .stroke({ width: borderWidth, color: borderColor });
    contextCache.set(contextKey, context);
  }

  const g = new Graphics(context);
  g.position.set(x, y);

  // Present week keeps its glow (filter lives on the instance, not the context).
  if (isPresent) {
    g.filters = [
      new GlowFilter({
        color: borderColor,
        distance: 8,
        outerStrength: 2,
        innerStrength: 0,
        quality: 1,
      }),
    ];
  }

  stage?.addChild(g);
};
