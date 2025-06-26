import { actualizeWeeks } from '@/utils/weeks/actualizeWeeks';

self.onmessage = async function () {
  await actualizeWeeks();
  self.postMessage('done');
};
