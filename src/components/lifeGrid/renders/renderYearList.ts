import { IWeek } from '@/store/clientDB';

import { renderWeek } from './renderWeek';
import { GRID_GAP } from '../constants';
import { TLifeGridState } from '../types';

const PADDING_TOP = 45;
const PADDING_BOTTOM = 74;

export const renderYearList = (state: TLifeGridState) => {
  const { app, weeks, theme, isMedium, lifeMode } = state;
  // --- mode: years (default) ---
  // Group weeks by years
  const width = app?.renderer.width || 0;
  const height = app?.renderer.height || 0;

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
  const paddingTop = isMedium ? PADDING_TOP : 10;
  const paddingBottom = isMedium ? PADDING_BOTTOM : 10;

  const availableHeight = height - paddingTop - paddingBottom;
  if (rows < minRows) {
    cellHeight = (availableHeight - GRID_GAP * (minRows + 1)) / minRows;
    actualGap = (availableHeight - cellHeight * rows) / (rows + 1);
  } else {
    cellHeight = (availableHeight - GRID_GAP * (rows + 1)) / rows;
    actualGap = GRID_GAP;
  }
  const cellWidth = (width - GRID_GAP * (cols + 1)) / cols;

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
      const px = x * (cellWidth + GRID_GAP) + GRID_GAP;
      const py = paddingTop + y * (cellHeight + actualGap) + actualGap;
      renderWeek({
        week,
        theme,
        x: px,
        y: py,
        cellWidth,
        cellHeight,
        isMedium: isMedium || false,
        isPresent: false,
        stage: app?.stage,
        lifeMode,
      });
    }
  }

  // Render present week last
  if (presentWeek) {
    const px = presentCol * (cellWidth + GRID_GAP) + GRID_GAP;
    const py = paddingTop + presentRow * (cellHeight + actualGap) + actualGap;
    renderWeek({
      week: presentWeek,
      theme,
      x: px,
      y: py,
      cellWidth,
      cellHeight,
      isMedium: isMedium || false,
      isPresent: true,
      stage: app?.stage,
      lifeMode,
    });
  }
};
