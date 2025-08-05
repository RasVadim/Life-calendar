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

export const ZODIAC_CIRCLES_PNG_PATHS: Record<TWeekZodiac, string> = {
  rat: '/icons/zodiac/circles/Rat.png',
  ox: '/icons/zodiac/circles/Bull.png',
  tiger: '/icons/zodiac/circles/Tiger.png',
  rabbit: '/icons/zodiac/circles/Rabbit.png',
  dragon: '/icons/zodiac/circles/Dragon.png',
  snake: '/icons/zodiac/circles/Snake.png',
  horse: '/icons/zodiac/circles/Horse.png',
  goat: '/icons/zodiac/circles/Goat.png',
  monkey: '/icons/zodiac/circles/Monkey.png',
  rooster: '/icons/zodiac/circles/Rooster.png',
  dog: '/icons/zodiac/circles/Dog.png',
  pig: '/icons/zodiac/circles/Pig.png',
};
