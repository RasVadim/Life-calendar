import { FC } from 'react';

import { BullCircleIcon } from '@/icons/zodiac/circles/bullCircleIcon';
import { DogCircleIcon } from '@/icons/zodiac/circles/dogCircleIcon';
import { DragonCircleIcon } from '@/icons/zodiac/circles/dragonCircleIcon';
import { GoatCircleIcon } from '@/icons/zodiac/circles/goatCircleIcon';
import { HorseCircleIcon } from '@/icons/zodiac/circles/horseCircleIcon';
import { MonkeyCircleIcon } from '@/icons/zodiac/circles/monkeyCircleIcon';
import { PigCircleIcon } from '@/icons/zodiac/circles/pigCircleIcon';
import { RabbitCircleIcon } from '@/icons/zodiac/circles/rabbitCircleIcon';
import { RatCircleIcon } from '@/icons/zodiac/circles/ratCircleIcon';
import { RoosterCircleIcon } from '@/icons/zodiac/circles/roosterCircleIcon';
import { SnakeCircleIcon } from '@/icons/zodiac/circles/snakeCircleIcon';
import { TigerCircleIcon } from '@/icons/zodiac/circles/tigerCircleIcon';
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
