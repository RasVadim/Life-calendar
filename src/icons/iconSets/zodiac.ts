import { FC } from 'react';

import {
  BullIcon,
  DogIcon,
  DragonIcon,
  GoatIcon,
  HorseIcon,
  MonkeyIcon,
  PigIcon,
  RabbitIcon,
  RatIcon,
  RoosterIcon,
  SnakeIcon,
  TigerIcon,
} from '@/icons';
import { TWeekZodiac } from '@/types';

export const ZODIAC_ICONS: Record<TWeekZodiac, FC<{ size?: string; color?: string }>> = {
  rat: RatIcon,
  ox: BullIcon,
  tiger: TigerIcon,
  rabbit: RabbitIcon,
  dragon: DragonIcon,
  snake: SnakeIcon,
  horse: HorseIcon,
  goat: GoatIcon,
  monkey: MonkeyIcon,
  rooster: RoosterIcon,
  dog: DogIcon,
  pig: PigIcon,
};
