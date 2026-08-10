import { TSeasonsIndxsValue } from '@/types';

import { PADDING_DESKTOP, PADDING_TOP, WEEK_IN_MONTH_GAP } from '../constants';
import { TLifeGridState } from '../types';

// Seasons geometry. A season is one block laid out as two rows of small weeks
// wrapped around a "big" (season-preview) week that spans 2 columns x 2 rows.
const SEASON_WEEK_GAP = WEEK_IN_MONTH_GAP; // gap between cells (h + v)
const SEASON_ROW_GAP = 100; // vertical space between season blocks (label + thread live here)
const SEASON_THREAD_MARGIN_TOP = 16; // gap below the big week's bottom where the thread sits

// The big week is intentionally larger than a clean 2x2: it grows by this fraction
// of a small week and is centred on the 2x2 area, so it overhangs the two rows.
const BIG_EXTRA_RATIO = 0.5;

// Target width of the top row (in small weeks) for a full season. Each group takes
// its half-share; leftover top slots are pulled up from the bottom to reach this.
const TOP_SMALL = 7;

export type TSeasonBlock = {
  indices: number[]; // global week indices, chronological
  bigPos: number; // position of the big week inside the block
  season: string;
  year: string;
};

type TBlockLayout = {
  col: number[]; // column of each week, keyed by chronological position
  row: number[]; // 0 = top, 1 = bottom
  cols: number; // total columns the block occupies (small units; big spans 2)
};

// Split the life into season blocks (consecutive weeks of the same primary season)
// and find each block's big week (the one flagged isSeasonPreview, else the first).
const buildSeasonBlocks = (state: TLifeGridState): TSeasonBlock[] => {
  const { drawWeekIndexes, media } = state;
  const { lastWeekIndex, seasonsIndxs } = drawWeekIndexes;

  const blocks: TSeasonBlock[] = [];
  let current: TSeasonBlock | null = null;

  const isBig = (value: TSeasonsIndxsValue): boolean =>
    !!value?.media && media[value.media]?.isSeasonPreview === true;

  for (let i = 0; i <= lastWeekIndex; i += 1) {
    const value = seasonsIndxs[i];
    if (!value) continue;

    if (value.isStart || !current) {
      current = { indices: [], bigPos: 0, season: value.season, year: value.year };
      blocks.push(current);
    }

    if (isBig(value)) current.bigPos = current.indices.length;
    current.indices.push(i);
  }

  return blocks;
};

// Places a block into two independent groups around the big (2x2) week: the weeks
// BEFORE it on the left, the weeks AFTER it on the right. Each group fills its top
// row left-to-right first (ceil of its count), then its bottom row (floor). Both
// bottom rows are pressed toward the big week, so any shortfall gap sits on the
// group's OUTER edge (far-left for the left group, far-right for the right group).
const layoutBlock = (block: TSeasonBlock): TBlockLayout => {
  const n = block.indices.length;
  const b = block.bigPos;
  const before = b;
  const after = n - 1 - b;

  const col = new Array<number>(n);
  const row = new Array<number>(n);

  // Each group starts with its half-share (ceil on top, floor pressed to the big).
  let lCols = Math.ceil(before / 2); // small columns left of the big week
  let rCols = Math.ceil(after / 2); // small columns right of the big week

  // Fill the top row up to TOP_SMALL by lifting bottom cells onto the top, favouring
  // the group with the deeper bottom. A full season thus reads 7 on top, rest below.
  let slack = TOP_SMALL - lCols - rCols;
  while (slack > 0) {
    const lBottom = before - lCols;
    const rBottom = after - rCols;
    if (rBottom >= lBottom && rBottom > 0) rCols += 1;
    else if (lBottom > 0) lCols += 1;
    else break;
    slack -= 1;
  }

  const bigCol = lCols; // big occupies columns [bigCol, bigCol + 1]

  col[b] = bigCol;
  row[b] = 0;

  // Left group: top row cols 0..lCols-1; bottom row right-aligned against the big.
  const leftBottom = before - lCols; // floor(before / 2)
  for (let i = 0; i < before; i += 1) {
    if (i < lCols) {
      col[i] = i;
      row[i] = 0;
    } else {
      col[i] = lCols - leftBottom + (i - lCols);
      row[i] = 1;
    }
  }

  // Right group: top row from beside the big; bottom row left-aligned against it.
  for (let j = 0; j < after; j += 1) {
    const chrono = b + 1 + j;
    if (j < rCols) {
      col[chrono] = bigCol + 2 + j;
      row[chrono] = 0;
    } else {
      col[chrono] = bigCol + 2 + (j - rCols);
      row[chrono] = 1;
    }
  }

  return { col, row, cols: lCols + 2 + rCols };
};

export type TSeasonCell = { x: number; y: number; size: number };

export type TSeasonBlockGeometry = {
  block: TSeasonBlock;
  topRowY: number;
  threadY: number;
  cellX: number[]; // rendered x per chronological position (thread anchors)
  cellSize: number[]; // rendered size per chronological position
};

export type TSeasonsLayout = {
  margin: number;
  small: number;
  bigSize: number;
  cells: TSeasonCell[]; // indexed by global week index (0..lastWeekIndex)
  blocks: TSeasonBlockGeometry[];
};

/**
 * Single source of truth for seasons-mode geometry. Shared by the rest renderer
 * and the morph frames so the animation lands exactly on the drawn scene.
 */
export const computeSeasonsLayout = (state: TLifeGridState): TSeasonsLayout => {
  const { drawWeekIndexes, isScreenMedium, container, app } = state;
  const { lastWeekIndex } = drawWeekIndexes;

  const blocks = buildSeasonBlocks(state);
  const layouts = blocks.map(layoutBlock);

  const width = container?.clientWidth || app?.renderer.width || 0;
  const gap = SEASON_WEEK_GAP;
  const margin = gap;

  // One fixed small-week size, sized so the widest season block fits the screen.
  // The +ratio reserves room for the big week's horizontal overhang.
  const maxSlots = layouts.reduce((max, l) => Math.max(max, l.cols), 1);
  const small = (width - 2 * margin - (maxSlots - 1) * gap) / (maxSlots + BIG_EXTRA_RATIO);

  const extra = small * BIG_EXTRA_RATIO; // how much the big week exceeds the clean 2x2
  const bigSize = 2 * small + gap + extra;
  const blockHeight = bigSize; // block height driven by the (larger) big week
  const paddingTop = isScreenMedium ? PADDING_TOP + SEASON_ROW_GAP : PADDING_DESKTOP;

  const slotX = (slot: number) => margin + slot * (small + gap);

  const cells: TSeasonCell[] = new Array(lastWeekIndex + 1);
  const blockGeometries: TSeasonBlockGeometry[] = [];

  blocks.forEach((block, blockIndex) => {
    const layout = layouts[blockIndex];
    const blockTop = paddingTop + blockIndex * (blockHeight + SEASON_ROW_GAP);
    const topRowY = blockTop;
    const bottomRowY = blockTop + small + gap;
    const bigCol = layout.col[block.bigPos];

    const n = block.indices.length;
    const cellX = new Array<number>(n);
    const cellSize = new Array<number>(n);

    for (let chrono = 0; chrono < n; chrono += 1) {
      const isBig = chrono === block.bigPos;
      const col = layout.col[chrono];

      // Small weeks: left-aligned to the big; those right of it are pushed out by
      // `extra` to keep a clean gap around the wider big. The big is left-aligned
      // horizontally and centred over the two rows vertically.
      const rowY = layout.row[chrono] === 0 ? topRowY : bottomRowY;
      const size = isBig ? bigSize : small;
      const x = isBig ? slotX(bigCol) : slotX(col) + (col > bigCol + 1 ? extra : 0);
      const y = isBig ? topRowY - extra / 2 : rowY;

      cellX[chrono] = x;
      cellSize[chrono] = size;
      cells[block.indices[chrono]] = { x, y, size };
    }

    blockGeometries.push({
      block,
      topRowY,
      // Sit below the big week's bottom overhang (extra / 2) plus the usual margin.
      threadY: bottomRowY + small + extra / 2 + SEASON_THREAD_MARGIN_TOP,
      cellX,
      cellSize,
    });
  });

  return { margin, small, bigSize, cells, blocks: blockGeometries };
};
