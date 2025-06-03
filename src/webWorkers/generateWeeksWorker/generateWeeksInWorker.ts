import type { IWeek } from '@/store/clientDB';

export const generateWeeksInWorker = (
  birthDateISO: string,
  lifeSpanYears: number,
): Promise<IWeek[]> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('./generateWeeks.worker.ts', import.meta.url),
      { type: 'module' },
    );
    worker.postMessage({ birthDateISO, lifeSpanYears });
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
  });
};
