import { actualizeWeeks } from '@/utils/weeks/actualizeWeeks/actualizeWeeks';

self.onmessage = async function () {
  await actualizeWeeks();
  self.postMessage('done');
};
