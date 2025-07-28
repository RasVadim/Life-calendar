import { GlowFilter } from 'pixi-filters';
import { Color, Container, Graphics, Texture } from 'pixi.js';

import { LIFE_MODES } from '@/constants';
import { EWeekType, THolidayName, TLifeMode } from '@/types';

import { ESide } from '../types';
import { getBGColor, getBorderColor } from '../utils';

// Cache for gradient textures
const gradientTextures = new Map<string, Texture>();

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
  theme: Record<string, string>;
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  isMedium: boolean;
  stage?: Container;
  lifeMode?: TLifeMode;
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
  lifeMode = LIFE_MODES.YEARS,
  weekType,
  holiday,
  half,
}: TRenderWeekProps) => {
  const borderRadius = BORDER_RADIUS_MAP[lifeMode][isMedium ? 'small' : 'large'];

  const borderWidth = borderWidthMap[lifeMode][isMedium ? 'small' : 'large'];

  const borderColor = new Color(getBorderColor(weekType, theme));
  const bgColor = new Color(getBGColor(theme, holiday));

  const isPresent = weekType === EWeekType.Present;

  const g = new Graphics();
  g.setStrokeStyle({ width: borderWidth, color: borderColor });

  const finalRadius = isPresent ? borderRadius + 1 : borderRadius;

  // Handle half week rendering
  if (half === ESide.Left || half === true || half === ESide.Right) {
    // Use cached gradient textures
    const textureKey = `${bgColor}-${half}-${cellWidth}-${cellHeight}`;
    let texture = gradientTextures.get(textureKey);

    if (!texture) {
      // Create canvas with gradient (only once)
      const canvas = document.createElement('canvas');
      canvas.width = cellWidth;
      canvas.height = cellHeight;
      const ctx = canvas.getContext('2d')!;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, cellWidth, 0);
      if (half === ESide.Left || half === true) {
        // Left to right fade
        const bgColorRgb = bgColor.toRgb();
        gradient.addColorStop(0.3, bgColor.toRgbaString());
        gradient.addColorStop(1, `rgba(${bgColorRgb.r}, ${bgColorRgb.g}, ${bgColorRgb.b}, 0.4)`);
      } else {
        // Right to left fade
        const bgColorRgb = bgColor.toRgb();
        gradient.addColorStop(0, `rgba(${bgColorRgb.r}, ${bgColorRgb.g}, ${bgColorRgb.b}, 0.4)`);
        gradient.addColorStop(0.7, bgColor.toRgbaString());
      }

      // Fill canvas with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cellWidth, cellHeight);

      // Create and cache texture
      texture = Texture.from(canvas);
      gradientTextures.set(textureKey, texture);
    }

    // Draw with cached texture
    g.clear();
    g.roundRect(x, y, cellWidth, cellHeight, finalRadius);
    g.fill({ texture });
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
        distance: 10,
        outerStrength: 3,
        innerStrength: 0,
        quality: 10,
      }),
    ];
    g.zIndex = 1000; // High z-index to appear above other weeks
  }

  stage?.addChild(g);
};
