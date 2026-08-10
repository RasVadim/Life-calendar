import { RectsDataBuffer } from '@snail/geometry/rect';

import { EYearsWeekIndxsValues } from '@/types';

import { computeYearsLayout } from '../../layouts';
import { TLifeGridState } from '../../types';

/**
 * One rect per week matching the original years grid geometry (53 cols).
 * Boundary "half" weeks keep their primary (left) slot here; the extra right
 * half is a rest-only decoration drawn by the original renderer.
 */
export const computeYearsFrames = (state: TLifeGridState): RectsDataBuffer => {
  const { lastWeekIndex, yearsIndxs } = state.drawWeekIndexes;
  const { cellWidth, cellHeight, positionAt } = computeYearsLayout(state);

  const buffer = new RectsDataBuffer(lastWeekIndex + 1);

  const put = (index: number, row: number, col: number): void => {
    const { x, y } = positionAt(row, col);
    const ref = buffer.getRef(index);
    ref.x = x;
    ref.y = y;
    ref.width = cellWidth;
    ref.height = cellHeight;
  };

  let row = 0;
  let col = 0;

  for (let i = 0; i <= lastWeekIndex; i += 1) {
    switch (yearsIndxs[i]) {
      case EYearsWeekIndxsValues.Half:
        if (i === 0) {
          put(i, 0, 0);
        } else if (i === lastWeekIndex) {
          col += 1;
          put(i, row, col);
        } else {
          col += 1;
          put(i, row, col);
          row += 1;
          col = 0;
        }
        break;

      case EYearsWeekIndxsValues.HalfLeap:
        row += 1;
        col = 0;
        put(i, row, col);
        break;

      case EYearsWeekIndxsValues.FullFirst:
        if (i !== 0) {
          row += 1;
          col = 0;
        }
        put(i, row, col);
        break;

      default:
        col += 1;
        put(i, row, col);
    }
  }

  return buffer;
};
