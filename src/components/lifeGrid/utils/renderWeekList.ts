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
}: TRenderWeekListProps) {
  const cols = 52;
  const rows = Math.ceil(weeks.length / cols);
  if (rows === 0) return;
  const cellWidth = (width - gap * (cols + 1)) / cols;
  const cellHeight = (height - gap * (rows + 1)) / rows;
  let presentWeekIndex: number | null = null;

  // render all weeks except present
  weeks.forEach((week, i) => {
    if (week.type === 'present') {
      presentWeekIndex = i;
      return;
    }
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (cellWidth + gap) + gap;
    const y = row * (cellHeight + gap) + gap;

    renderWeek({
      week,
      theme,
      x,
      y,
      cellWidth,
      cellHeight,
      isMedium: isMedium || false,
      isPresent: false,
      stage,
    });
  });

  // render present week last
  if (presentWeekIndex !== null && presentWeekIndex !== -1) {
    const week = weeks[presentWeekIndex];
    const col = presentWeekIndex % cols;
    const row = Math.floor(presentWeekIndex / cols);
    const x = col * (cellWidth + gap) + gap;
    const y = row * (cellHeight + gap) + gap;

    renderWeek({
      week,
      theme,
      x,
      y,
      cellWidth,
      cellHeight,
      isMedium: isMedium || false,
      isPresent: true,
      stage,
    });
  }
}
