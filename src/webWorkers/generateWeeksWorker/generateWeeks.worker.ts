import { generateWeeks } from '@/utils';

self.onmessage = function (e) {
  const { birthDateISO, lifeSpanYears, deathDateISO } = e.data;
  const weeks = generateWeeks(birthDateISO, lifeSpanYears, deathDateISO);
  self.postMessage(weeks);
};
