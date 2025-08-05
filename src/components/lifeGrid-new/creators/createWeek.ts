import { Color, Container, Graphics, FillGradient } from 'pixi.js';

import { ELifeMode, ESide, EWeekType, THolidayName } from '@/types';

import { BORDER_RADIUS_MAP, BORDER_WIDTH_MAP } from '../constants';
import { getBGColor, getBorderColor } from '../utils';

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
  half: boolean | ESide;
  holiday?: THolidayName | null;
};

/**
 * Creates a single week on the given PixiJS stage.
 * @param theme - Theme palette
 * @param x - X position of the week
 * @param y - Y position of the week
 * @param cellWidth - Width of the cell
 * @param cellHeight - Height of the cell
 * @param isScreenMedium - Whether to use medium size styling
 * @param stage - PixiJS Container
 */
export const createWeek = ({
  theme,
  x,
  y,
  cellWidth,
  cellHeight,
  isScreenMedium,
  stage,
  half,
  holiday,
}: TRenderWeekProps) => {
  const borderRadius = BORDER_RADIUS_MAP[ELifeMode.Years][isScreenMedium ? 'small' : 'large'];
  const borderWidth = BORDER_WIDTH_MAP[ELifeMode.Years].small;

  const borderColor = new Color(getBorderColor(EWeekType.Future, theme));
  const bgColor = new Color(getBGColor(theme, holiday));

  const g = new Graphics();
  g.position.set(x, y);
  g.setStrokeStyle({ width: borderWidth, color: borderColor });

  // Handle half week rendering
  if (half === ESide.Left || half === true || half === ESide.Right) {
    // Use cached gradient objects
    const gradientKey = `${bgColor}-${half}`;
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

  stage?.addChild(g);
};
