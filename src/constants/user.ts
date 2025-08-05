import {
  ZODIAC_CIRCLES_ICONS,
  ZODIAC_CIRCLES_PNG_PATHS,
  ZODIAC_ICONS,
  ZODIAC_PNG_PATHS,
} from '@/icons';
import { EZodiacMode } from '@/types';

export const WEEKS_PER_YEAR = 52;

export const MAP_ZODIAC_PNG_SET = {
  [EZodiacMode.NATURAL]: ZODIAC_PNG_PATHS,
  [EZodiacMode.CIRCLES]: ZODIAC_CIRCLES_PNG_PATHS,
};

export const MAP_ZODIAC_JSX_SET = {
  [EZodiacMode.NATURAL]: ZODIAC_ICONS,
  [EZodiacMode.CIRCLES]: ZODIAC_CIRCLES_ICONS,
};
