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
 * pixel-exact renderers; the transition is a cheap sprite morph. Scrolling
 * (months) reuses a native, transparent DOM scroller synced to the canvas, so
 * momentum and iOS rubber-banding come for free.
 */
export const SnailGrid: FC<TProps> = ({ drawWeekIndexes, today, media }) => {
  const [lifeMode] = useLifeGridMode();
  const [themeMode] = useThemeMode();
  const zodiacIconSet = useZodiacIconSet();
  const theme = THEMES[themeMode];

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

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
  const scrollRef = useRef<number>(0);

  const framesFor = (mode: ELifeMode) =>
    mode === ELifeMode.Months
      ? computeMonthsFrames(stateRef.current)
      : computeYearsFrames(stateRef.current);

  const weeksContainer = () =>
    stateRef.current.app?.stage.getChildByLabel(CONTAINER_LABELS.weeks) ?? null;

  // Configure the native scroller for the given mode (only months scrolls).
  const setupScroller = (mode: ELifeMode, contentHeight: number) => {
    const scroller = scrollerRef.current;
    const spacer = spacerRef.current;
    if (!scroller || !spacer) return;

    const scrollable = mode === ELifeMode.Months;
    // Extra room past the content so the final month can be scrolled up toward
    // the screen center instead of being stuck at the bottom edge / behind nav.
    const bottomPad = scrollable ? scroller.clientHeight * 0.35 : 0;
    spacer.style.height = scrollable ? `${contentHeight + bottomPad}px` : '0px';
    scroller.style.pointerEvents = scrollable ? 'auto' : 'none';
    scroller.scrollTop = 0;
  };

  const paint = (mode: ELifeMode) => {
    const state = stateRef.current;
    state.lifeMode = mode;
    renderLife(state);
    paintedRef.current = mode;

    scrollRef.current = 0;
    const weeks = weeksContainer();
    if (weeks) weeks.y = 0;
    setupScroller(mode, weeks?.height ?? 0);
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

    // Start the morph from where a scrolled months view currently sits.
    if (fromMode === ELifeMode.Months && scrollRef.current !== 0) {
      from.translate(0, scrollRef.current);
    }

    // Hide the exact rest layer + disable scrolling while the morph plays.
    const weeks = state.app.stage.getChildByLabel(CONTAINER_LABELS.weeks);
    if (weeks) weeks.visible = false;
    if (scrollerRef.current) scrollerRef.current.style.pointerEvents = 'none';

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

  // Init Pixi once, paint the initial rest state, wire native scroll + resize.
  useEffect(() => {
    let disposed = false;
    const el = containerRef.current;
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;

    const onResize = () => {
      stateRef.current.isScreenMedium = window.innerWidth < DEVICE_SCREEN_WIDTH.medium;
      if (!morphRef.current) paint(paintedRef.current);
    };

    // Native scroll drives the canvas: sync weekContainer.y to scrollTop.
    // Snap to whole pixels so thin borders/threads don't shimmer while moving.
    const onScroll = () => {
      if (paintedRef.current !== ELifeMode.Months || morphRef.current) return;
      const y = -Math.round(scroller.scrollTop);
      scrollRef.current = y;
      const weeks = weeksContainer();
      if (weeks) weeks.y = y;
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
      // Let touches fall through the canvas to the native scroller above it.
      app.canvas.style.pointerEvents = 'none';
      stateRef.current.app = app;
      stateRef.current.container = el;
      modelsRef.current = buildWeekModels(stateRef.current.drawWeekIndexes, stateRef.current.today);
      paint(effectiveMode(lifeMode));
    })();

    window.addEventListener('resize', onResize);
    scroller.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      disposed = true;
      stopMorph();
      window.removeEventListener('resize', onResize);
      scroller.removeEventListener('scroll', onScroll);
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

  return (
    <div ref={containerRef} className={s.pixiContainer}>
      <div ref={scrollerRef} className={s.scroller}>
        <div ref={spacerRef} className={s.scrollSpacer} />
      </div>
    </div>
  );
};
