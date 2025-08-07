import { Container } from 'pixi.js';

import { ESide, EWeekType, EYearsWeekIndxsValues, THolidayName } from '@/types';

import { renderWeek } from './renderWeek';
import {
  CONTAINER_LABELS,
  GRID_GAP,
  PADDING_BOTTOM,
  PADDING_DESKTOP,
  PADDING_TOP,
  QUADRATIC_WEEK_ROWS_LEVEL,
} from '../constants';
import { TLifeGridState } from '../types';

type TRenderProps = { half: ESide | false; weekType?: EWeekType | null; stage?: Container | null };

export const renderYearList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today, container } = state;

  if (!app) return;

  const { lastWeekIndex, yearsIndxs, yearRows } = drawWeekIndexes;

  const weekContainer = app.stage.getChildByLabel(CONTAINER_LABELS.weeks);
  const width = container?.clientWidth || app.renderer.width;
  const height = container?.clientHeight || app.renderer.height;
  const screenSize = isScreenMedium ? 'small' : 'large';

  // Fixed number of elements per row (53)
  const cols = 53;
  const isMoreThanQuadratic = yearRows > QUADRATIC_WEEK_ROWS_LEVEL;
  const rows = isMoreThanQuadratic ? yearRows : QUADRATIC_WEEK_ROWS_LEVEL;
  const gridGap = GRID_GAP[screenSize];

  // Padding for header and navbar in years mode
  const paddingTop = isScreenMedium ? PADDING_TOP : PADDING_DESKTOP;
  const paddingBottom = isScreenMedium ? PADDING_BOTTOM : PADDING_DESKTOP;

  const availableHeight = height - paddingTop - paddingBottom;

  const cellHeight = (availableHeight - gridGap * (rows + 1)) / rows;
  const cellWidth = (width - gridGap * (cols + 1)) / cols;
  const actualGap = isMoreThanQuadratic
    ? gridGap
    : (availableHeight - cellHeight * rows) / (rows + 1);

  //Render week list
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
    isScreenMedium,
    stage: weekContainer!,
    lifeMode,
    weekType: EWeekType.Future,
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
          weekContainer?.addChild(twoWeekHalfsContainer);

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
