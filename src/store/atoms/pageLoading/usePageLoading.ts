import { useAtom, useSetAtom } from 'jotai';

import { PageLoading } from './atom';

export const usePageLoading = () => useAtom(PageLoading);

export const useSetPageLoading = () => useSetAtom(PageLoading);
