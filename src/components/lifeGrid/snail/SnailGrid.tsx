import { FC, useEffect, useRef } from 'react';

import { DEVICE_SCREEN_WIDTH } from '@/constants';
import { THEMES } from '@/constants/themes';
import { useZodiacIconSet } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IDrawWeekIndexes } from '@/store/clientDB';
import { ELifeMode, TMedia, TMediaDatesMap, TTodayData } from '@/types';

import { BORDER_RADIUS_MAP, CONTAINER_LABELS, WEEK_IN_MONTH_GAP } from '../constants';
import { renderLife } from '../renders';
import { getMonthDynamicWeekWidth } from '../renders/utils';
import { TLifeGridState } from '../types';
import { clearPixiCache, initPixi } from '../utils';

import { SnailGridRenderer } from './bridge';
import { computeMonthsFrames } from './frames/monthsFrames';
import { computeYearsFrames } from './frames/yearsFrames';
import { easeInOutCubic } from './interpolate';
import { buildWeekModels, TWeekModel } from './weekModel';

import s from '../s.module.styl';

type TProps = {
  drawWeekIndexes: IDrawWeekIndexes;
  media: TMediaDatesMap<TMedia>;
  today: TTodayData;
};

const MORPH_DURATION = 480;

// Seasons has no dedicated scene yet — render it as years for now.
const effectiveMode = (mode: ELifeMode): ELifeMode =>
  mode === ELifeMode.Seasons ? ELifeMode.Years : mode;

/**
 * Grid with animated mode transitions. Rest states are drawn by the original,
 * pixel-exact renderers (half weeks, month threads); only the transition is a
 * cheap sprite morph between geometry that matches those renderers.
 */
export const SnailGrid: FC<TProps> = ({ drawWeekIndexes, today, media }) => {
  const [lifeMode] = useLifeGridMode();
  const [themeMode] = useThemeMode();
  const zodiacIconSet = useZodiacIconSet();
  const theme = THEMES[themeMode];

  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<TLifeGridState>({
    drawWeekIndexes,
    media,
    today,
    theme,
    isScreenMedium: window.innerWidth < DEVICE_SCREEN_WIDTH.medium,
    lifeMode: effectiveMode(lifeMode),
    zodiacIconSet,
    container: null,
    app: null,
    scrollContainer: null,
  });

  const modelsRef = useRef<TWeekModel[]>([]);
  const morphRef = useRef<SnailGridRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const paintedRef = useRef<ELifeMode>(effectiveMode(lifeMode));

  const framesFor = (mode: ELifeMode) =>
    mode === ELifeMode.Months
      ? computeMonthsFrames(stateRef.current)
      : computeYearsFrames(stateRef.current);

  const paint = (mode: ELifeMode) => {
    stateRef.current.lifeMode = mode;
    renderLife(stateRef.current);
    paintedRef.current = mode;
  };

  const stopMorph = () => {
    cancelAnimationFrame(rafRef.current);
    morphRef.current?.destroy();
    morphRef.current = null;
  };

  const runMorph = (fromMode: ELifeMode, toMode: ELifeMode) => {
    const state = stateRef.current;
    if (!state.app) return;

    stopMorph();

    const from = framesFor(fromMode);
    const to = framesFor(toMode);
    const models = modelsRef.current;

    // Hide the exact rest layer while the sprite morph plays on top.
    const weeks = state.app.stage.getChildByLabel(CONTAINER_LABELS.weeks);
    if (weeks) weeks.visible = false;

    // Corner ratio so a month-sized square matches the months border radius.
    const screenSize = state.isScreenMedium ? 'small' : 'large';
    const width = state.container?.clientWidth || state.app.renderer.width;
    const monthCell = getMonthDynamicWeekWidth(5, width, WEEK_IN_MONTH_GAP);
    const cornerRatio = monthCell > 0 ? BORDER_RADIUS_MAP[ELifeMode.Months][screenSize] / monthCell : 0;

    const renderer = new SnailGridRenderer(
      state.app.stage,
      state.app.renderer,
      state.theme,
      cornerRatio,
    );
    morphRef.current = renderer;

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / MORPH_DURATION);
      renderer.morph(from, to, easeInOutCubic(progress), models);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        stopMorph();
        paint(toMode);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Init Pixi once, paint the initial rest state, wire resize.
  useEffect(() => {
    let disposed = false;
    const el = containerRef.current;
    if (!el) return;

    const onResize = () => {
      stateRef.current.isScreenMedium = window.innerWidth < DEVICE_SCREEN_WIDTH.medium;
      if (!morphRef.current) paint(paintedRef.current);
    };

    (async () => {
      const app = await initPixi(el);
      if (disposed) {
        app.destroy(true, { children: true });
        return;
      }
      // Drop textures cached against a previous renderer (HMR / remount).
      clearPixiCache();
      el.appendChild(app.canvas);
      stateRef.current.app = app;
      stateRef.current.container = el;
      modelsRef.current = buildWeekModels(stateRef.current.drawWeekIndexes, stateRef.current.today);
      paint(effectiveMode(lifeMode));
    })();

    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      stopMorph();
      window.removeEventListener('resize', onResize);
      stateRef.current.app?.destroy(true, { children: true });
      stateRef.current.app = null;
      // Invalidate textures bound to the destroyed renderer.
      clearPixiCache();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate on mode change (years <-> months); seasons folds into years.
  useEffect(() => {
    if (!stateRef.current.app) return;
    const target = effectiveMode(lifeMode);
    if (paintedRef.current === target) return;
    runMorph(paintedRef.current, target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifeMode]);

  // Re-tint / repaint on theme change.
  useEffect(() => {
    if (!stateRef.current.app) return;
    stateRef.current.theme = theme;
    morphRef.current?.setTheme(theme);
    if (!morphRef.current) paint(paintedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeMode]);

  // Rebuild when the underlying week data changes.
  useEffect(() => {
    if (!stateRef.current.app) return;
    stateRef.current.drawWeekIndexes = drawWeekIndexes;
    stateRef.current.today = today;
    stateRef.current.media = media;
    modelsRef.current = buildWeekModels(drawWeekIndexes, today);
    if (!morphRef.current) paint(paintedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawWeekIndexes.lastWeekIndex, today.todayWeekIndex]);

  return <div ref={containerRef} className={s.pixiContainer} />;
};
