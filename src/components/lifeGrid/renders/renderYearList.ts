import { Container } from 'pixi.js';

import { IWeek } from '@/store/clientDB';
import { TLifeMode, TZodiacIconSet } from '@/types';

import { renderWeek } from './renderWeek';

type TRenderYearsProps = {
  weeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  height: number;
  gap?: number;
  isMedium?: boolean;
  stage: Container;
  mode: TLifeMode;
  zodiacIconSet?: TZodiacIconSet;
};

export const renderYearList = ({
  weeks,
  theme,
  width,
  height,
  gap = 1.5,
  isMedium,
  stage,
  mode,
}: TRenderYearsProps) => {
  // --- mode: years (default) ---
  // Group weeks by years
  const yearsMap: Record<number, IWeek[]> = {};
  let minYear = Infinity;
  let maxYear = -Infinity;
  weeks.forEach((week) => {
    if (!yearsMap[week.year]) yearsMap[week.year] = [];
    yearsMap[week.year].push(week);
    if (week.year < minYear) minYear = week.year;
    if (week.year > maxYear) maxYear = week.year;
  });

  // Define the maximum number of weeks in a year (columns)
  let maxWeeksInYear = 0;
  Object.values(yearsMap).forEach((arr) => {
    if (arr.length > maxWeeksInYear) maxWeeksInYear = arr.length;
  });

  const rows = maxYear - minYear + 1;
  const cols = maxWeeksInYear;

  // --- Quadratic and adaptive gap ---
  const minRows = 90;
  let cellHeight: number;
  let actualGap: number;
  // Padding for header and navbar in years mode
  const PADDING_TOP = 45;
  const PADDING_BOTTOM = 74;
  const availableHeight = height - PADDING_TOP - PADDING_BOTTOM;
  if (rows < minRows) {
    cellHeight = (availableHeight - gap * (minRows + 1)) / minRows;
    actualGap = (availableHeight - cellHeight * rows) / (rows + 1);
  } else {
    cellHeight = (availableHeight - gap * (rows + 1)) / rows;
    actualGap = gap;
  }
  const cellWidth = (width - gap * (cols + 1)) / cols;

  // For quick search of present week
  let presentWeek: IWeek | null = null;
  let presentRow = 0;
  let presentCol = 0;

  // Render all weeks
  for (let y = 0; y < rows; y++) {
    const year = minYear + y;
    const weeksOfYear = yearsMap[year] || [];
    for (let x = 0; x < weeksOfYear.length; x++) {
      const week = weeksOfYear[x];
      if (week.type === 'present') {
        presentWeek = week;
        presentRow = y;
        presentCol = x;
        continue;
      }
      const px = x * (cellWidth + gap) + gap;
      const py = PADDING_TOP + y * (cellHeight + actualGap) + actualGap;
      renderWeek({
        week,
        theme,
        x: px,
        y: py,
        cellWidth,
        cellHeight,
        isMedium: isMedium || false,
        isPresent: false,
        stage,
        mode,
      });
    }
  }

  // Render present week last
  if (presentWeek) {
    const px = presentCol * (cellWidth + gap) + gap;
    const py = PADDING_TOP + presentRow * (cellHeight + actualGap) + actualGap;
    renderWeek({
      week: presentWeek,
      theme,
      x: px,
      y: py,
      cellWidth,
      cellHeight,
      isMedium: isMedium || false,
      isPresent: true,
      stage,
      mode,
    });
  }
};
