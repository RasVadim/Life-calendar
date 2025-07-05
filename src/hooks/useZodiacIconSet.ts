import { useMemo } from 'react';

import { ZODIAC_CIRCLES_ICONS, ZODIAC_ICONS } from '@/constants';
import { useDBSettings } from '@/store/clientDB';
import { EZodiacMode } from '@/types';

export const useZodiacIconSet = () => {
  const settings = useDBSettings();

  const actualSet = useMemo(() => {
    if (settings?.zodiacMode === EZodiacMode.NATURAL) return ZODIAC_ICONS;
    if (settings?.zodiacMode === EZodiacMode.CIRCLES) return ZODIAC_CIRCLES_ICONS;
    return undefined;
  }, [settings?.zodiacMode]);

  return actualSet;
};
