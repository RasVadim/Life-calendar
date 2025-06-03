import { generateWeeks } from '@/utils';

self.onmessage = function (e) {
  const { birthDateISO, lifeSpanYears } = e.data;
  const weeks = generateWeeks(birthDateISO, lifeSpanYears);
  self.postMessage(weeks);
};
