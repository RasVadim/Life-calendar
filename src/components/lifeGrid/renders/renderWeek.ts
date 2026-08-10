import { GlowFilter } from 'pixi-filters';
import { Container, Graphics, FillGradient } from 'pixi.js';

import { ELifeMode, ESide, EWeekType, THolidayName } from '@/types';

import { BORDER_RADIUS_MAP, BORDER_WIDTH_MAP } from '../constants';
import { getBGColor, getBorderColor, getCachedColor } from '../utils';

// Cache for gradient objects
const gradientCache = new Map<string, FillGradient>();

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

  const borderColor = getCachedColor(getBorderColor(weekType, theme));
  const bgColorHex = getBGColor(theme, holiday);
  const bgColor = getCachedColor(bgColorHex);

  const isPresent = weekType === EWeekType.Present;

  const g = new Graphics();
  g.position.set(x, y);
  g.setStrokeStyle({ width: borderWidth, color: borderColor });

  // Handle half week rendering
  if (half === ESide.Left || half === true || half === ESide.Right) {
    // Use cached gradient objects
    const gradientKey = `${bgColorHex}-${half}-${theme.background}`;
    let gradient = gradientCache.get(gradientKey);

    if (!gradient) {
      // Create gradient using PixiJS native FillGradient
      const bgColorString = bgColor.toRgbaString();
      const canvasBgColor = getCachedColor(theme.background).toRgbaString();

      if (half === ESide.Left || half === true) {
        // Left to right fade
        gradient = new FillGradient({
          type: 'linear',
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
          colorStops: [
            { offset: 0.15, color: bgColorString },
            { offset: 1, color: canvasBgColor },
          ],
          textureSpace: 'local',
        });
      } else {
        // Right to left fade
        gradient = new FillGradient({
          type: 'linear',
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
          colorStops: [
            { offset: 0, color: canvasBgColor },
            { offset: 0.85, color: bgColorString },
          ],
          textureSpace: 'local',
        });
      }

      gradientCache.set(gradientKey, gradient);
    }

    // Draw with cached gradient
    g.clear();
    g.roundRect(0, 0, cellWidth, cellHeight, borderRadius);
    g.fill({ fill: gradient });
    g.stroke();
  } else {
    // Draw full week
    g.clear();
    g.roundRect(0, 0, cellWidth, cellHeight, borderRadius);
    g.fill({ color: bgColor });
    g.stroke();
  }

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
    // g.zIndex = 1000;
  }

  stage?.addChild(g);
};
