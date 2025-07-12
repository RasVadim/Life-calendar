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

export const ZODIAC_CIRCLES_SVG_PATHS: Record<TWeekZodiac, string> = {
  rat: '/icons/zodiac/circles/Rat.svg',
  ox: '/icons/zodiac/circles/Bull.svg',
  tiger: '/icons/zodiac/circles/Tiger.svg',
  rabbit: '/icons/zodiac/circles/Rabbit.svg',
  dragon: '/icons/zodiac/circles/Dragon.svg',
  snake: '/icons/zodiac/circles/Snake.svg',
  horse: '/icons/zodiac/circles/Horse.svg',
  goat: '/icons/zodiac/circles/Goat.svg',
  monkey: '/icons/zodiac/circles/Monkey.svg',
  rooster: '/icons/zodiac/circles/Rooster.svg',
  dog: '/icons/zodiac/circles/Dog.svg',
  pig: '/icons/zodiac/circles/Pig.svg',
};
