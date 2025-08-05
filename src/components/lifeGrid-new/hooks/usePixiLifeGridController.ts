import { useEffect } from 'react';

import { liveQuery, Subscription } from 'dexie';
import { useStore } from 'jotai';

import { THEMES, MAP_ZODIAC_PNG_SET } from '@/constants';
import { LifeGridMode, ThemeMode } from '@/store/atoms';
import { lifeCalendarDB } from '@/store/clientDB';

import {
  onChangeDrawWeekIndxs,
  onChangeLifeMode,
  onChangeTheme,
  onChangeToday,
  onChangeZodiacSet,
} from '../handlers';
import type { TLifeGridState } from '../types';
import { getState } from '../utils';

/**
 * Use the pixi life grid controller.
 * @returns The state of the life grid.
 */
export const usePixiLifeGridController = () => {
  const atomStore = useStore();

  const state: TLifeGridState = getState();

  useEffect(() => {
    // --- Jotai subscriptions ---
    const jotaiSubs = [
      // ThemeMode
      atomStore.sub(ThemeMode, () => {
        state.theme = THEMES[atomStore.get(ThemeMode)];
        onChangeTheme(state);
      }),
      // LifeGridMode
      atomStore.sub(LifeGridMode, () => {
        state.lifeMode = atomStore.get(LifeGridMode);
        onChangeLifeMode(state);
      }),
    ];

    // --- IndexedDB subscriptions ---
    const dbSubs: Subscription[] = [
      // DrawWeekIndexes
      liveQuery(() => lifeCalendarDB.drawWeekIndexes.get('main')).subscribe({
        next: (drawWeekIndexes) => {
          if (drawWeekIndexes) {
            state.drawWeekIndexes = drawWeekIndexes;
            onChangeDrawWeekIndxs(state);
          }
        },
        error: (err) => {
          console.error('DB subscription error:', err);
        },
      }),

      // Meta (today data)
      liveQuery(() => lifeCalendarDB.meta.get('main')).subscribe({
        next: (meta) => {
          if (meta) {
            state.today = {
              todayWeekId: meta.todayWeekId,
              todayWeekIndex: meta.todayWeekIndex,
              todayWeekHalf: meta.todayWeekHalf,
              todayDayId: meta.todayDayId,
              todayDayIndex: meta.todayDayIndex,
            };
            onChangeToday(state);
          }
        },
        error: (err) => {
          console.error('Meta subscription error:', err);
        },
      }),

      // Settings (zodiacIconSet)
      liveQuery(() => lifeCalendarDB.settings.get('main')).subscribe({
        next: (settings) => {
          if (settings?.zodiacMode && settings.zodiacMode in MAP_ZODIAC_PNG_SET) {
            state.zodiacIconSet =
              MAP_ZODIAC_PNG_SET[settings.zodiacMode as keyof typeof MAP_ZODIAC_PNG_SET];
            onChangeZodiacSet(state);
          }
        },
        error: (err) => {
          console.error('Settings subscription error:', err);
        },
      }),
    ];

    return () => {
      jotaiSubs.forEach((unsub) => unsub());
      dbSubs.forEach((sub) => sub.unsubscribe());
    };
  }, [atomStore]);

  return state;
};
