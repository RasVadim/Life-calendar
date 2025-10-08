import { ESeason } from '@/types';

export const checkEvenSeason = (season?: ESeason): boolean | null => {
  if (!season) return null;
  return season === ESeason.Autumn || season === ESeason.Winter;
};
