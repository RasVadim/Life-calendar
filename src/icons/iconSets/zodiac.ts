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
  rat: '/icons/zodiac/rat.svg',
  ox: '/icons/zodiac/bull.svg',
  tiger: '/icons/zodiac/tiger.svg',
  rabbit: '/icons/zodiac/rabbit.svg',
  dragon: '/icons/zodiac/dragon.svg',
  snake: '/icons/zodiac/snake.svg',
  horse: '/icons/zodiac/horse.svg',
  goat: '/icons/zodiac/goat.svg',
  monkey: '/icons/zodiac/monkey.svg',
  rooster: '/icons/zodiac/rooster.svg',
  dog: '/icons/zodiac/dog.svg',
  pig: '/icons/zodiac/pig.svg',
};
