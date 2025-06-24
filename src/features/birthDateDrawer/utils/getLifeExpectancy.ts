import { DEFAULT_LIFE_SPAN_YEARS } from '@/constants';

export const getLifeExpectancy = (birthDate: string | null): number => {
  if (!birthDate) return DEFAULT_LIFE_SPAN_YEARS;
  const birth = new Date(birthDate);
  const now = new Date();
  const age = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  if (age >= 105) return 120;
  if (age >= 95) return 110;
  if (age >= 85) return 100;
  return DEFAULT_LIFE_SPAN_YEARS;
};
