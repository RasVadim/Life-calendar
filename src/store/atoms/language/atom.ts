import { atomWithStorage } from 'jotai/utils';

import { TLanguage } from '@/types';

export const Language = atomWithStorage<TLanguage>('language', null, undefined, {
  getOnInit: true,
});
