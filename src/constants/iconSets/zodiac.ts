import { FC } from 'react';

import { BullIcon } from '@/icons/zodiac/bullIcon';
import { DogIcon } from '@/icons/zodiac/dogIcon';
import { DragonIcon } from '@/icons/zodiac/dragonIcon';
import { GoatIcon } from '@/icons/zodiac/goatIcon';
import { HorseIcon } from '@/icons/zodiac/horseIcon';
import { MonkeyIcon } from '@/icons/zodiac/monkeyIcon';
import { PigIcon } from '@/icons/zodiac/pigIcon';
import { RabbitIcon } from '@/icons/zodiac/rabbitIcon';
import { RatIcon } from '@/icons/zodiac/ratIcon';
import { RoosterIcon } from '@/icons/zodiac/roosterIcon';
import { SnakeIcon } from '@/icons/zodiac/snakeIcon';
import { TigerIcon } from '@/icons/zodiac/TigerIcon';
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
