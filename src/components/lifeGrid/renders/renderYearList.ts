import { Container } from 'pixi.js';

import { ESide, EWeekType, EYearsWeekIndxsValues, THolidayName } from '@/types';

import { renderWeek } from './renderWeek';
import { GRID_GAP } from '../constants';
import { TLifeGridState } from '../types';

const PADDING_TOP = 45;
const PADDING_BOTTOM = 74;

type TRenderProps = { half: ESide | false; weekType?: EWeekType | null; stage?: Container | null };

export const renderYearList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isMedium, lifeMode, today } = state;

  const { lastWeekIndex, yearsIndxs, yearRows } = drawWeekIndexes;

  const width = app?.renderer.width || 0;
  const height = app?.renderer.height || 0;

  // Fixed number of elements per row (53)
  const cols = 53;
  const rows = yearRows;
  const gridGap = GRID_GAP[isMedium ? 'small' : 'large'];

  // --- Quadratic and adaptive gap ---
  const minRows = 90;
  let cellHeight: number;
  let actualGap: number;
  // Padding for header and navbar in years mode
  const paddingTop = isMedium ? PADDING_TOP : 10;
  const paddingBottom = isMedium ? PADDING_BOTTOM : 10;

  const availableHeight = height - paddingTop - paddingBottom;
  if (rows < minRows) {
    cellHeight = (availableHeight - gridGap * (minRows + 1)) / minRows;
    actualGap = (availableHeight - cellHeight * rows) / (rows + 1);
  } else {
    cellHeight = (availableHeight - gridGap * (rows + 1)) / rows;
    actualGap = gridGap;
  }
  const cellWidth = (width - gridGap * (cols + 1)) / cols;

  let currentRow = 0;
  let currentCol = 0;

  const getPosition = () => ({
    x: currentCol * (cellWidth + gridGap) + gridGap,
    y: paddingTop + currentRow * (cellHeight + actualGap) + actualGap,
  });

  const baseProps = {
    theme,
    cellWidth,
    cellHeight,
    isMedium: isMedium || false,
    stage: app?.stage,
    lifeMode,
    weekType: EWeekType.Present,
    holiday: null as THolidayName | null,
  };

  for (let i = 0; i < lastWeekIndex; i++) {
    const drawType = yearsIndxs[i];

    const holiday = drawWeekIndexes.holidaysIndxs[i];
    const weekType =
      i > today.todayWeekIndex
        ? EWeekType.Future
        : i === today.todayWeekIndex
          ? EWeekType.Present
          : EWeekType.Past;

    baseProps.holiday = holiday;
    baseProps.weekType = weekType;

    const render = ({ half, weekType, stage }: TRenderProps) => {
      renderWeek({
        ...baseProps,
        ...getPosition(),
        ...(weekType ? { weekType } : {}),
        ...(stage ? { stage } : {}),
        half,
      });
    };

    switch (drawType) {
      case EYearsWeekIndxsValues.Half:
        if (i === 0) {
          render({ half: ESide.Right });
        } else if (i === lastWeekIndex - 1) {
          render({ half: ESide.Left });
        } else {
          let leftWeekType: EWeekType | null = null;
          let rightWeekType: EWeekType | null = null;

          if (i === today.todayWeekIndex) {
            leftWeekType = today.todayWeekHalf === ESide.Left ? EWeekType.Present : EWeekType.Past;
            rightWeekType =
              today.todayWeekHalf === ESide.Right ? EWeekType.Present : EWeekType.Future;
          }

          // Create container for two weeks that will be positioned separately
          const twoWeekHalfsContainer = new Container();
          app?.stage.addChild(twoWeekHalfsContainer);

          currentCol++;
          render({ half: ESide.Left, weekType: leftWeekType, stage: twoWeekHalfsContainer });
          currentRow++;
          currentCol = 0;
          render({ half: ESide.Right, weekType: rightWeekType, stage: twoWeekHalfsContainer });
        }
        break;

      case EYearsWeekIndxsValues.HalfLeap:
        currentRow++;
        currentCol = 0;
        render({ half: ESide.Right });
        break;

      case EYearsWeekIndxsValues.FullFirst:
        if (i !== 0) {
          currentRow++;
          currentCol = 0;
        }
        render({ half: false });
        break;

      default:
        currentCol++;
        render({ half: false });
    }
  }
};
