import { useAtom, useSetAtom } from 'jotai';

import { SyncPending } from './atom';

export const useSyncPending = () => useAtom(SyncPending);

export const useSetSyncPending = () => useSetAtom(SyncPending);
