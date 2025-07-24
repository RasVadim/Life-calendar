import { Assets, Container, Sprite } from 'pixi.js';

import { TWeekZodiac, TZodiacIconSet } from '@/types';

import { ZODIAC_ICON_SIZE } from '../constants';

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
    const iconTexture = await Assets.load({
      key: iconPath,
      src: iconPath,
    });

    const icon = new Sprite(iconTexture);

    // Calculate scale to fit within ZODIAC_ICON_SIZE while preserving aspect ratio
    const scale = ZODIAC_ICON_SIZE / icon.height;

    icon.scale.set(scale, scale);
    icon.position.set(position.x, position.y);

    icon.tint = primaryColor;
    container.addChild(icon);
  }
};
