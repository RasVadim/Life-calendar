import { Assets, Container, Graphics } from 'pixi.js';

import { TWeekZodiac, TZodiacIconSet } from '@/types';

import { ZODIAC_ICON_SIZE } from '../constants';
import { colorizeSvg } from '../utils';

let cachedPrimaryColor: number | null = null;

export type TRenderSeasonParams = {
  primaryColor: number;
  container: Container;
  position: { x: number; y: number };
  zodiac: TWeekZodiac;
  zodiacIconSet: TZodiacIconSet;
};

export const renderIcon = async ({
  primaryColor,
  container,
  position,
  zodiac,
  zodiacIconSet,
}: TRenderSeasonParams) => {
  // Add zodiac icon
  const iconPath = zodiacIconSet[zodiac as TWeekZodiac];
  if (typeof iconPath === 'string') {
    if (cachedPrimaryColor !== primaryColor) {
      await Assets.reset();
      cachedPrimaryColor = primaryColor;
    }
    const svgContext = await Assets.load({
      key: iconPath,
      src: iconPath,
      data: { parseAsGraphicsContext: true },
    });

    console.log('svgContext', svgContext);
    const svgData = colorizeSvg(svgContext, primaryColor);
    const graphics = new Graphics(svgData);

    // Calculate scale to fit within ZODIAC_ICON_SIZE while preserving aspect ratio
    const scale = Math.min(ZODIAC_ICON_SIZE / graphics.width, ZODIAC_ICON_SIZE / graphics.height);

    graphics.scale.set(scale, scale);
    graphics.position.set(position.x, position.y);
    container.addChild(graphics);
  }
};
