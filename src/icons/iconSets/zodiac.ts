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

export const ZODIAC_SVG_PATHS: Record<TWeekZodiac, string> = {
  rat: '/icons/zodiac/rat.png',
  ox: '/icons/zodiac/bull.png',
  tiger: '/icons/zodiac/tiger.png',
  rabbit: '/icons/zodiac/rabbit.png',
  dragon: '/icons/zodiac/dragon.png',
  snake: '/icons/zodiac/snake.png',
  horse: '/icons/zodiac/horse.png',
  goat: '/icons/zodiac/goat.png',
  monkey: '/icons/zodiac/monkey.png',
  rooster: '/icons/zodiac/rooster.png',
  dog: '/icons/zodiac/dog.png',
  pig: '/icons/zodiac/pig.png',
};
