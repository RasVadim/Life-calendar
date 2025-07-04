export const actualizeWeeksInWorker = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./actualizeWeeks.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.postMessage('start');
    worker.onmessage = (e) => {
      if (e.data === 'done') {
        resolve();
      } else {
        reject(new Error('Unexpected worker response'));
      }
      worker.terminate();
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
  });
};
