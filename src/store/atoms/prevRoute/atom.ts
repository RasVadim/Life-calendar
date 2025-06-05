import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const storage = createJSONStorage<string>(() => sessionStorage);

export const PrevRoute = atomWithStorage<string>('prevRoute', '', storage);
