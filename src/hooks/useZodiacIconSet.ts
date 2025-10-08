import { useMemo } from 'react';

import { MAP_ZODIAC_JSX_SET, MAP_ZODIAC_PNG_SET } from '@/constants/icons';
import { useDBSettings } from '@/store/clientDB';
import { EZodiacMode, TZodiacIconSet } from '@/types';

type useZodiacIconSetOptions = {
  jsx?: boolean;
  first?: boolean;
};

export const useZodiacIconSet = (
  { jsx, first }: useZodiacIconSetOptions = { jsx: false, first: false },
): TZodiacIconSet | undefined => {
  const settings = useDBSettings();

  const actualSet = useMemo(() => {
    const mode = first ? settings?.zodiacMode || EZodiacMode.NATURAL : settings?.zodiacMode;

    if (!mode) return undefined;

    if (jsx) {
      return MAP_ZODIAC_JSX_SET[mode as keyof typeof MAP_ZODIAC_JSX_SET];
    }

    return MAP_ZODIAC_PNG_SET[mode as keyof typeof MAP_ZODIAC_PNG_SET];
  }, [settings?.zodiacMode]);

  return actualSet;
};
