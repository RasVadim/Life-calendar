import { FC } from 'react';

import {
  BullCircleIcon,
  RatCircleIcon,
  TigerCircleIcon,
  RabbitCircleIcon,
  DragonCircleIcon,
  SnakeCircleIcon,
  HorseCircleIcon,
  GoatCircleIcon,
  MonkeyCircleIcon,
  RoosterCircleIcon,
  DogCircleIcon,
  PigCircleIcon,
} from '@/icons';
import { TWeekZodiac } from '@/types';

export const ZODIAC_CIRCLES_ICONS: Record<TWeekZodiac, FC<{ size?: string; color?: string }>> = {
  rat: RatCircleIcon,
  ox: BullCircleIcon,
  tiger: TigerCircleIcon,
  rabbit: RabbitCircleIcon,
  dragon: DragonCircleIcon,
  snake: SnakeCircleIcon,
  horse: HorseCircleIcon,
  goat: GoatCircleIcon,
  monkey: MonkeyCircleIcon,
  rooster: RoosterCircleIcon,
  dog: DogCircleIcon,
  pig: PigCircleIcon,
};
