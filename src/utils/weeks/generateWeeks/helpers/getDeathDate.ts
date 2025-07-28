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
  let parsedDeath: Date | null = null;
  let deathDate: Date;

  if (deathDateISO) {
    const d = new Date(deathDateISO);
    if (!isNaN(d.getTime()) && d > birthDate) {
      parsedDeath = d;
    }
  }

  if (parsedDeath) {
    deathDate = startOfDay(parsedDeath);
  } else {
    // If death date is exactly on the birthday, do not add an extra year
    deathDate = startOfDay(addYears(birthDate, lifeSpanYears));
  }

  return deathDate;
};
