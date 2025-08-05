import { useMemo } from 'react';

import { MAP_ZODIAC_JSX_SET, MAP_ZODIAC_PNG_SET } from '@/constants';
import { useDBSettings } from '@/store/clientDB';
import { TZodiacIconSet } from '@/types';

export const useZodiacIconSet = (
  { jsx }: { jsx: boolean } = { jsx: false },
): TZodiacIconSet | undefined => {
  const settings = useDBSettings();

  const actualSet = useMemo(() => {
    if (!settings?.zodiacMode) return undefined;

    if (jsx) {
      return MAP_ZODIAC_JSX_SET[settings.zodiacMode as keyof typeof MAP_ZODIAC_JSX_SET];
    }

    return MAP_ZODIAC_PNG_SET[settings.zodiacMode as keyof typeof MAP_ZODIAC_PNG_SET];
  }, [settings?.zodiacMode]);

  return actualSet;
};
