import { useMemo } from 'react';

import {
  ZODIAC_CIRCLES_ICONS,
  ZODIAC_CIRCLES_SVG_PATHS,
  ZODIAC_ICONS,
  ZODIAC_SVG_PATHS,
} from '@/icons';
import { useDBSettings } from '@/store/clientDB';
import { EZodiacMode, TZodiacIconSet } from '@/types';

export const useZodiacIconSet = (
  { jsx }: { jsx: boolean } = { jsx: false },
): TZodiacIconSet | undefined => {
  const settings = useDBSettings();

  const actualSet = useMemo(() => {
    if (settings?.zodiacMode === EZodiacMode.NATURAL) return jsx ? ZODIAC_ICONS : ZODIAC_SVG_PATHS;
    if (settings?.zodiacMode === EZodiacMode.CIRCLES)
      return jsx ? ZODIAC_CIRCLES_ICONS : ZODIAC_CIRCLES_SVG_PATHS;
    return undefined;
  }, [settings?.zodiacMode]);

  return actualSet;
};
