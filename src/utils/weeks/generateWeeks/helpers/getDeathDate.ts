import { addYears, startOfDay } from 'date-fns';

type TGetYearsToGenerateParams = {
  birthDate: Date;
  deathDateISO?: string;
  lifeSpanYears: number;
};

/**
 * Calculates the number of years to generate based on the birth date, death date, and life span years.
 * @param {TGetYearsToGenerateParams} params - The parameters for the calculation.
 * @returns {Date} The result of the calculation = deathDate.
 */
export const getDeathDate = ({
  birthDate,
  deathDateISO,
  lifeSpanYears,
}: TGetYearsToGenerateParams): Date => {
  // Try to parse custom death date if provided
  if (deathDateISO) {
    const parsedDeath = new Date(deathDateISO);
    if (!isNaN(parsedDeath.getTime()) && parsedDeath > birthDate) {
      return startOfDay(parsedDeath);
    }
  }

  // Fallback to calculated death date based on life span
  return startOfDay(addYears(birthDate, lifeSpanYears));
};
