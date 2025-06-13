import { useAtom, useSetAtom } from 'jotai';

import { Language } from './atom';

export const useLanguage = () => useAtom(Language);

export const useSetLanguage = () => useSetAtom(Language);
