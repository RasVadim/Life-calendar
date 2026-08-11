// constants/icons - special import because it has connection to environment
// (window methods inside icons-components: ZODIAC_CIRCLES_ICONS and ZODIAC_ICONS)
//
// IMPORTANT: This file causes issues in web workers due to React imports
// REMOVE constants/icons AND uncomment constants/user IF icons-components
// starts to be not used in the project

import {
  ZODIAC_CIRCLES_ICONS,
  ZODIAC_CIRCLES_PNG_PATHS,
  ZODIAC_ICONS,
  ZODIAC_PNG_PATHS,
} from '@/icons';
import { EZodiacMode } from '@/types';

export const MAP_ZODIAC_JSX_SET = {
  [EZodiacMode.NATURAL]: ZODIAC_ICONS,
  [EZodiacMode.CIRCLES]: ZODIAC_CIRCLES_ICONS,
};

export const MAP_ZODIAC_PNG_SET = {
  [EZodiacMode.NATURAL]: ZODIAC_PNG_PATHS,
  [EZodiacMode.CIRCLES]: ZODIAC_CIRCLES_PNG_PATHS,
};
