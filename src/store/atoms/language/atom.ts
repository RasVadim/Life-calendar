import { atomWithStorage } from 'jotai/utils';

export type TLanguage = 'en' | 'ru' | null;

export const Language = atomWithStorage<TLanguage>('language', null, undefined, {
  getOnInit: true,
});
