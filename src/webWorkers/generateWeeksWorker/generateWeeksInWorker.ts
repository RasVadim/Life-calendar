import { IGenerateWeeksResult } from '@/utils';

export const generateWeeksInWorker = (
  birthDateISO: string,
  lifeSpanYears: number,
  deathDateISO?: string,
): Promise<IGenerateWeeksResult> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./generateWeeks.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.postMessage({ birthDateISO, lifeSpanYears, deathDateISO });
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
