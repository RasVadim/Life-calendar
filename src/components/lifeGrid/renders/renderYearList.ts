import { Container } from 'pixi.js';

import { ESide, EWeekType, EYearsWeekIndxsValues, THolidayName } from '@/types';

import { renderWeek } from './renderWeek';
import { CONTAINER_LABELS } from '../constants';
import { computeYearsLayout } from '../layouts';
import { TLifeGridState } from '../types';
import { getWeekType } from '../utils';

type TRenderProps = { half: ESide | false; weekType?: EWeekType | null; stage?: Container | null };

export const renderYearList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today } = state;

  if (!app) return;

  const { lastWeekIndex, yearsIndxs } = drawWeekIndexes;

  const weekContainer = app.stage.getChildByLabel(CONTAINER_LABELS.weeks);

  const layout = computeYearsLayout(state);
  const { cellWidth, cellHeight, positionAt } = layout;

  let currentRow = 0;
  let currentCol = 0;

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

  for (let i = 0; i <= lastWeekIndex; i++) {
    const drawType = yearsIndxs[i];

    const holiday = drawWeekIndexes.holidaysIndxs[i];

    baseProps.holiday = holiday;
    baseProps.weekType = getWeekType(i, today.todayWeekIndex);

    const render = ({ half, weekType, stage }: TRenderProps) => {
      renderWeek({
        ...baseProps,
        ...positionAt(currentRow, currentCol),
        ...(weekType ? { weekType } : {}),
        ...(stage ? { stage } : {}),
        half,
      });
    };

    switch (drawType) {
      case EYearsWeekIndxsValues.Half:
        if (i === 0) {
          render({ half: ESide.Right });
        } else if (i === lastWeekIndex) {
          // Real death week that died mid-week: only its left (earlier) half exists.
          currentCol++;
          render({ half: ESide.Left });
        } else {
          let leftWeekType: EWeekType | null = null;
          let rightWeekType: EWeekType | null = null;

          if (i === today.todayWeekIndex) {
            leftWeekType =
              today.todayWeekYearHalf === ESide.Left ? EWeekType.Present : EWeekType.Past;
            rightWeekType =
              today.todayWeekYearHalf === ESide.Right ? EWeekType.Present : EWeekType.Future;
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
