import { useEffect } from 'react';

import { useSetSyncPending } from '@/store/atoms';
import { actualizeWeeksInWorker } from '@/webWorkers';

/**
 * Hook for actualizing weeks at startup and by timer until the next 01:00
 */
export const useActualizeWeeks = () => {
  const setPending = useSetSyncPending();

  // Actualize weeks at startup
  useEffect(() => {
    (async () => {
      setPending(true);
      await actualizeWeeksInWorker();
      setPending(false);
    })();
  }, []);

  // Timer until the next 01:00
  useEffect(() => {
    const scheduleNextCheck = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(1, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      const ms = next.getTime() - now.getTime();
      return setTimeout(async () => {
        setPending(true);
        await actualizeWeeksInWorker();
        scheduleNextCheck();
        setPending(false);
      }, ms);
    };
    const timer = scheduleNextCheck();
    return () => clearTimeout(timer);
  }, []);
};
