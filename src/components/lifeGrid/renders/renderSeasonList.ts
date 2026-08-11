import { Container } from 'pixi.js';

import { ELifeMode, EWeekType, THolidayName } from '@/types';

import { renderLabel } from './renderLabel';
import {
  renderSeasonThreadLine,
  TSeasonEndCap,
  TSeasonStartCap,
} from './renderSeasonThreadLine';
import { renderWeek } from './renderWeek';
import { BIG_BORDER_RADIUS_MAP, BORDER_RADIUS_MAP, CONTAINER_LABELS } from '../constants';
import { computeSeasonsLayout } from '../layouts';
import { TLifeGridState } from '../types';
import { getCachedColor, getWeekType } from '../utils';

export const renderSeasonList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today, container } = state;
  if (!app) return;

  const renderer = app.renderer;
  const containerWidth = container?.clientWidth || app.renderer.width;
  const { seasonsIndxs, monthsIndxs, lastWeekIndex } = drawWeekIndexes;

  // Life's first/last weeks may be partial (born / die mid-week). Reuse the months
  // extreme flag ("half*") to decide if the birth/death point sits inside the cell.
  const isHalfLifeWeek = (index: number): boolean =>
    (monthsIndxs[index]?.type ?? '').startsWith('half');

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

    // Season thread: one underline anchored to the block's first and last cells
    // (wherever they landed in the two rows). Caps mirror the month vocabulary.
    // A mid-week season boundary lives on the single week that straddles the two
    // seasons — that week can be either the END of this block or the START of the
    // next, so we detect both and place the transition on the correct cell:
    //   - shared week is this block's LAST cell  -> borderEnd (wrap off right edge)
    //   - shared week is the NEXT block's first  -> this block ends full, next wrapIn
    //   - shared week is this block's FIRST cell -> borderStart (wrap in from left)
    // A clean Sunday/Monday boundary is a full dot on both sides.
    const firstIdx = block.indices[0];
    const lastIdx = block.indices[n - 1];
    const isLifeStart = blockIndex === 0 && firstIdx === 0;
    const isLifeEnd = lastIdx === lastWeekIndex;

    const startSharedHere = !!seasonsIndxs[firstIdx]?.secondSeason;
    const prevWeekShared = firstIdx > 0 && !!seasonsIndxs[firstIdx - 1]?.secondSeason;
    const endShared = !!seasonsIndxs[lastIdx]?.secondSeason;

    const startCap: TSeasonStartCap = isLifeStart
      ? isHalfLifeWeek(firstIdx)
        ? 'halfLife'
        : 'full'
      : startSharedHere
        ? 'borderStart'
        : prevWeekShared
          ? 'wrapIn'
          : 'full';

    const endCap: TSeasonEndCap = isLifeEnd
      ? isHalfLifeWeek(lastIdx)
        ? 'halfLife'
        : 'full'
      : endShared
        ? 'borderEnd'
        : 'full';

    // Alternating block colour; the neighbour season is always the opposite one.
    const otherColor = blockIndex % 2 === 0 ? theme.primary2 : theme.primary;

    renderSeasonThreadLine({
      container: weekContainer,
      renderer,
      threadY,
      containerWidth,
      startX: cellX[0],
      startWidth: cellSize[0],
      endX: cellX[n - 1],
      endWidth: cellSize[n - 1],
      startCap,
      endCap,
      colorNumber: getCachedColor(threadColor).toNumber(),
      otherColorNumber: getCachedColor(otherColor).toNumber(),
    });
  });
};
