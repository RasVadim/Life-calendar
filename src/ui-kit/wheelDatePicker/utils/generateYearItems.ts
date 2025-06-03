export type TItem = {
  value: string | number;
  label: string;
};

export const generateYearItems = (currentYear: number, range: number = 120): TItem[] => {
  return Array.from({ length: range }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });
}; 