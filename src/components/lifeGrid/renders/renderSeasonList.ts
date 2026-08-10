import { Container } from 'pixi.js';

import { ELifeMode, EWeekType, THolidayName } from '@/types';

import { renderLabel } from './renderLabel';
import { renderSeasonThreadLine } from './renderSeasonThreadLine';
import { renderWeek } from './renderWeek';
import { BIG_BORDER_RADIUS_MAP, BORDER_RADIUS_MAP, CONTAINER_LABELS } from '../constants';
import { computeSeasonsLayout } from '../layouts';
import { TLifeGridState } from '../types';
import { getCachedColor, getWeekType } from '../utils';

export const renderSeasonList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today } = state;
  if (!app) return;

  const renderer = app.renderer;
  const { seasonsIndxs } = drawWeekIndexes;

  const weekContainer = app.stage.getChildByLabel(CONTAINER_LABELS.weeks) as Container;
  if (!weekContainer) return;

  const { margin, cells, blocks } = computeSeasonsLayout(state);
  if (!blocks.length) return;

  // Small and big weeks get independent corner radii (tuned per mode in the maps),
  // so the big week isn't just a size-scaled copy of the small one.
  const screenSize = isScreenMedium ? 'small' : 'large';
  const smallRadius = BORDER_RADIUS_MAP[ELifeMode.Seasons][screenSize];
  const bigRadius = BIG_BORDER_RADIUS_MAP[ELifeMode.Seasons][screenSize];

  const baseProps = {
    theme,
    isScreenMedium,
    stage: weekContainer,
    lifeMode,
    weekType: EWeekType.Future,
    holiday: null as THolidayName | null,
    half: false as const,
  };

  blocks.forEach((geometry, blockIndex) => {
    const { block, topRowY, threadY, cellX, cellSize } = geometry;

    // Season name shares its thread's colour (alternating per block).
    const threadColor = blockIndex % 2 === 0 ? theme.primary : theme.primary2;

    renderLabel({
      container: weekContainer,
      season: block.season,
      year: block.year,
      x: margin,
      y: topRowY,
      theme,
      labelColor: threadColor,
    });

    const n = block.indices.length;

    for (let chrono = 0; chrono < n; chrono += 1) {
      const globalIndex = block.indices[chrono];
      const cell = cells[globalIndex];
      renderWeek({
        ...baseProps,
        x: cell.x,
        y: cell.y,
        cellWidth: cell.size,
        cellHeight: cell.size,
        weekType: getWeekType(globalIndex, today.todayWeekIndex),
        holiday: drawWeekIndexes.holidaysIndxs[globalIndex] ?? null,
        borderRadius: chrono === block.bigPos ? bigRadius : smallRadius,
      });
    }

    // Season thread: from the first week's left edge to the last week's cell. The
    // last week is wherever the bottom row ended (variable), so the end cap is read
    // straight off its rendered position; a mid-week season end pulls it to centre.
    const startX = cellX[0];
    const isEndHalf = !!seasonsIndxs[block.indices[n - 1]]?.secondSeason;
    const endX = cellX[n - 1] + (isEndHalf ? cellSize[n - 1] / 2 : cellSize[n - 1]);

    renderSeasonThreadLine({
      container: weekContainer,
      renderer,
      startX,
      endX,
      threadY,
      colorNumber: getCachedColor(threadColor).toNumber(),
    });
  });
};
