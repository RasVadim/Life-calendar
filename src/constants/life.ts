import { FC } from 'react';

import { BullIcon } from '@/icons/zodiac/BullIcon';
import { DogIcon } from '@/icons/zodiac/DogIcon';
import { DragonIcon } from '@/icons/zodiac/DragonIcon';
import { GoatIcon } from '@/icons/zodiac/GoatIcon';
import { HorseIcon } from '@/icons/zodiac/HorseIcon';
import { MonkeyIcon } from '@/icons/zodiac/MonkeyIcon';
import { PigIcon } from '@/icons/zodiac/PigIcon';
import { RabbitIcon } from '@/icons/zodiac/RabbitIcon';
import { RatIcon } from '@/icons/zodiac/RatIcon';
import { RoosterIcon } from '@/icons/zodiac/RoosterIcon';
import { SnakeIcon } from '@/icons/zodiac/SnakeIcon';
import { TigerIcon } from '@/icons/zodiac/TigerIcon';
import { TWeekZodiac } from '@/types';

export const LIFE_MODES = {
  MONTHS: 'months',
  SEASONS: 'seasons',
  YEARS: 'years',
};

export const DEFAULT_BIRTH_DATE = '1990-05-10';

export const DEFAULT_LIFE_SPAN_YEARS = 90;

export const HOLIDAY_NAMES = {
  newYear: 'newYear',
  birthday: 'birthday',
  Feb23: '23Feb',
  Mar8: '8Mar',
} as const;

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
