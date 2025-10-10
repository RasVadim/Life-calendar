import { compressImageInWorker } from './compressImageInWorker';
import { CompressImageWorkerMessage } from './types';

/**
 * Web Worker for image compression
 * Handles heavy computational tasks without blocking main thread
 */
self.onmessage = async function (e: MessageEvent<CompressImageWorkerMessage>) {
  const message = e.data;

  if (message.type === 'compress') {
    const response = await compressImageInWorker(message.data);
    self.postMessage(response);
  }
};
