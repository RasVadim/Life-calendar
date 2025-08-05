import { GlowFilter } from 'pixi-filters';
import { Color, Container, Graphics, FillGradient } from 'pixi.js';

import { ELifeMode, ESide, EWeekType, THolidayName } from '@/types';

import { getBGColor, getBorderColor } from '../utils';

const BORDER_RADIUS_MAP = {
  [ELifeMode.Years]: { small: 2, large: 3 },
  [ELifeMode.Seasons]: { small: 4, large: 6 },
  [ELifeMode.Months]: { small: 14, large: 22 },
};

const BORDER_WIDTH_MAP = {
  [ELifeMode.Years]: { small: 1, large: 1 },
  [ELifeMode.Seasons]: { small: 1, large: 2 },
  [ELifeMode.Months]: { small: 2, large: 3 },
};

// Cache for gradient objects
const gradientCache = new Map<string, FillGradient>();

type TRenderWeekProps = {
  theme: Record<string, string>;
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  isMedium: boolean;
  stage?: Container;
  lifeMode?: ELifeMode;
  weekType: EWeekType;
  holiday: THolidayName | null;
  half: boolean | ESide;
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
  theme,
  x,
  y,
  cellWidth,
  cellHeight,
  isMedium,
  stage,
  lifeMode = ELifeMode.Years,
  weekType,
  holiday,
  half,
}: TRenderWeekProps) => {
  const borderRadius = BORDER_RADIUS_MAP[lifeMode][isMedium ? 'small' : 'large'];

  const borderWidth = BORDER_WIDTH_MAP[lifeMode][isMedium ? 'small' : 'large'];

  const borderColor = new Color(getBorderColor(weekType, theme));
  const bgColor = new Color(getBGColor(theme, holiday));

  const isPresent = weekType === EWeekType.Present;

  const g = new Graphics();
  g.setStrokeStyle({ width: borderWidth, color: borderColor });

  const finalRadius = isPresent ? borderRadius + 1 : borderRadius;

  // Handle half week rendering
  if (half === ESide.Left || half === true || half === ESide.Right) {
    // Use cached gradient objects
    const gradientKey = `${bgColor}-${half}-${cellWidth}-${cellHeight}`;
    let gradient = gradientCache.get(gradientKey);

    if (!gradient) {
      // Create gradient using PixiJS native FillGradient
      const bgColorRgb = bgColor.toRgb();
      const bgColorString = bgColor.toRgbaString();
      const transparentColor = `rgba(${bgColorRgb.r}, ${bgColorRgb.g}, ${bgColorRgb.b}, 0.4)`;

      if (half === ESide.Left || half === true) {
        // Left to right fade
        gradient = new FillGradient({
          type: 'linear',
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
          colorStops: [
            { offset: 0.3, color: bgColorString },
            { offset: 1, color: transparentColor },
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
            { offset: 0, color: transparentColor },
            { offset: 0.7, color: bgColorString },
          ],
          textureSpace: 'local',
        });
      }

      gradientCache.set(gradientKey, gradient);
    }

    // Draw with cached gradient
    g.clear();
    g.roundRect(x, y, cellWidth, cellHeight, finalRadius);
    g.fill({ fill: gradient });
    g.stroke();
  } else {
    // Draw full week
    g.clear();
    g.roundRect(x, y, cellWidth, cellHeight, finalRadius);
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
    g.zIndex = 1000; // High z-index to appear above other weeks
  }

  stage?.addChild(g);
};
