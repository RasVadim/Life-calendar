import { GlowFilter } from 'pixi-filters';
import { Graphics, Container } from 'pixi.js';

import { IWeek } from '@/store/clientDB';

import { getBGColor } from './getBGColor';
import { getBorderColor } from './getBorderColor';
import { normalizeHex } from './normalizeHex';

/**
 * Renders weeks grid on the given PixiJS stage.
 * @param weeks - Array of week objects
 * @param theme - Theme palette
 * @param width - Width of the canvas
 * @param height - Height of the canvas
 * @param gap - Gap between cells
 * @param stage - PixiJS Container (usually app.stage)
 */
export function renderWeeks({
  weeks,
  theme,
  width,
  height,
  gap = 1.5,
  stage,
  isMedium,
  mode,
}: {
  weeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  height: number;
  gap?: number;
  stage: Container;
  isMedium?: boolean;
  mode: string;
}) {
  // console.log('mode', mode);
  const cols = 52;
  const rows = Math.ceil(weeks.length / cols);
  if (rows === 0) return;
  const cellWidth = (width - gap * (cols + 1)) / cols;
  const cellHeight = (height - gap * (rows + 1)) / rows;

  // Сначала рендерим все недели кроме present
  weeks.forEach((week, i) => {
    if (week.type === 'present') return;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (cellWidth + gap) + gap;
    const y = row * (cellHeight + gap) + gap;

    const bgColorStr = normalizeHex(getBGColor(week.holidays, theme));
    const borderColorStr = normalizeHex(getBorderColor(week.type, theme));
    const bgColor = /^#[0-9A-Fa-f]{6}$/.test(bgColorStr)
      ? parseInt(bgColorStr.replace('#', ''), 16)
      : 0xff00ff;
    const borderColor = /^#[0-9A-Fa-f]{6}$/.test(borderColorStr)
      ? parseInt(borderColorStr.replace('#', ''), 16)
      : 0x00ffff;
    const g = new Graphics();
    g.setStrokeStyle({ width: isMedium ? 1 : 2, color: borderColor });
    const borderRadius = isMedium ? 2 : 4;
    g.roundRect(x, y, cellWidth, cellHeight, borderRadius);
    g.fill({ color: bgColor });
    g.stroke();
    stage.addChild(g);
  });
  // Теперь рендерим present-неделю последней
  const presentIndex = weeks.findIndex(w => w.type === 'present');
  if (presentIndex !== -1) {
    const week = weeks[presentIndex];
    const col = presentIndex % cols;
    const row = Math.floor(presentIndex / cols);
    const x = col * (cellWidth + gap) + gap;
    const y = row * (cellHeight + gap) + gap;
    const bgColorStr = normalizeHex(getBGColor(week.holidays, theme));
    const borderColorStr = normalizeHex(getBorderColor(week.type, theme));
    const bgColor = /^#[0-9A-Fa-f]{6}$/.test(bgColorStr)
      ? parseInt(bgColorStr.replace('#', ''), 16)
      : 0xff00ff;
    const borderColor = /^#[0-9A-Fa-f]{6}$/.test(borderColorStr)
      ? parseInt(borderColorStr.replace('#', ''), 16)
      : 0x00ffff;
    const g = new Graphics();
    g.setStrokeStyle({ width: isMedium ? 1 : 2, color: borderColor });
    const borderRadius = isMedium ? 2 : 4;
    const presentRadius = borderRadius + 1;
    g.roundRect(x, y, cellWidth, cellHeight, presentRadius);
    g.fill({ color: bgColor });
    g.stroke();
    g.filters = [
      new GlowFilter({
        color: borderColor,
        distance: 6,
        outerStrength: 2,
        innerStrength: 0,
        quality: 0.7,
      }),
    ];
    stage.addChild(g);
  }
}
