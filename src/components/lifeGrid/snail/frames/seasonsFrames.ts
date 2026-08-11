import { RectsDataBuffer } from '@snail/geometry/rect';

import { computeSeasonsLayout } from '../../layouts';
import { TLifeGridState } from '../../types';

/**
 * One rect per week matching the seasons grid geometry (big weeks included, sized
 * larger). Shares computeSeasonsLayout with the rest renderer, so a morph into /
 * out of seasons lands exactly on the drawn scene.
 */
export const computeSeasonsFrames = (state: TLifeGridState): RectsDataBuffer => {
  const { lastWeekIndex } = state.drawWeekIndexes;
  const { cells } = computeSeasonsLayout(state);

  const buffer = new RectsDataBuffer(lastWeekIndex + 1);

  for (let i = 0; i <= lastWeekIndex; i += 1) {
    const cell = cells[i];
    if (!cell) continue;
    const ref = buffer.getRef(i);
    ref.x = cell.x;
    ref.y = cell.y;
    ref.width = cell.size;
    ref.height = cell.size;
  }

  return buffer;
};
