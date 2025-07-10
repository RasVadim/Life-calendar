import { Container } from 'pixi.js';

import { IWeek } from '@/store/clientDB';

import { renderWeek } from './renderWeek';

type TRenderWeekListProps = {
  weeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  height: number;
  gap?: number;
  stage: Container;
  isMedium?: boolean;
  mode: string;
};

/**
 * Renders weeks grid on the given PixiJS stage.
 * @param weeks - Array of week objects
 * @param theme - Theme palette
 * @param width - Width of the canvas
 * @param height - Height of the canvas
 * @param gap - Gap between cells
 * @param stage - PixiJS Container (usually app.stage)
 */
export function renderWeekList({
  weeks,
  theme,
  width,
  height,
  gap = 1.5,
  stage,
  isMedium,
  mode,
}: TRenderWeekListProps) {
  if (!weeks.length) return;

  // Группируем недели по годам жизни
  const yearsMap: Record<number, IWeek[]> = {};
  let minYear = Infinity;
  let maxYear = -Infinity;
  weeks.forEach((week) => {
    if (!yearsMap[week.year]) yearsMap[week.year] = [];
    yearsMap[week.year].push(week);
    if (week.year < minYear) minYear = week.year;
    if (week.year > maxYear) maxYear = week.year;
  });

  // Определяем максимальное количество недель в году (столбцов)
  let maxWeeksInYear = 0;
  Object.values(yearsMap).forEach((arr) => {
    if (arr.length > maxWeeksInYear) maxWeeksInYear = arr.length;
  });

  const rows = maxYear - minYear + 1;
  const cols = maxWeeksInYear;

  // --- Квадратизм и адаптивный gap ---
  const minRows = 90;
  let cellHeight: number;
  let actualGap: number;
  if (rows < minRows) {
    cellHeight = (height - gap * (minRows + 1)) / minRows;
    actualGap = (height - cellHeight * rows) / (rows + 1);
  } else {
    cellHeight = (height - gap * (rows + 1)) / rows;
    actualGap = gap;
  }
  const cellWidth = (width - gap * (cols + 1)) / cols;

  // Для быстрого поиска present-недели
  let presentWeek: IWeek | null = null;
  let presentRow = 0;
  let presentCol = 0;

  // Рендерим все недели
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
      const py = y * (cellHeight + actualGap) + actualGap;
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
      });
    }
  }

  // Рендерим present-неделю последней
  if (presentWeek) {
    const px = presentCol * (cellWidth + gap) + gap;
    const py = presentRow * (cellHeight + actualGap) + actualGap;
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
    });
  }
}
