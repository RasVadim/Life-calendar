import { FC, useEffect, useRef } from 'react';

import { DEVICE_SCREEN_WIDTH } from '@/constants';
import { THEMES } from '@/constants/themes';
import { useZodiacIconSet } from '@/hooks';
import { useLifeGridMode } from '@/store/atoms';
import { useThemeMode } from '@/store/atoms/themeMode/useThemeMode';
import { IDrawWeekIndexes } from '@/store/clientDB';
import { ELifeMode, TMedia, TMediaDatesMap, TTodayData } from '@/types';

import {
  BIG_BORDER_RADIUS_MAP,
  BORDER_RADIUS_MAP,
  CONTAINER_LABELS,
  LARGE_MONTH_WEEK_SIZE_MULTIPLIER,
  WEEK_IN_MONTH_GAP,
} from '../constants';
import { computeSeasonsLayout, computeYearsLayout } from '../layouts';
import { renderLife } from '../renders';
import { getMonthDynamicWeekWidth } from '../renders/utils';
import { TLifeGridState } from '../types';
import { clearPixiCache, initPixi } from '../utils';
import { SnailGridRenderer } from './bridge';
import { computeMonthsFrames } from './frames/monthsFrames';
import { computeSeasonsFrames } from './frames/seasonsFrames';
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

// Modes that scroll vertically via the native DOM scroller synced to the canvas.
const isScrollable = (mode: ELifeMode): boolean =>
  mode === ELifeMode.Months || mode === ELifeMode.Seasons;

// Every mode now has a frame scene, so all transitions animate.
const hasMorphFrames = (mode: ELifeMode): boolean =>
  mode === ELifeMode.Years || mode === ELifeMode.Months || mode === ELifeMode.Seasons;

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
    lifeMode,
    zodiacIconSet,
    container: null,
    app: null,
    scrollContainer: null,
  });

  const modelsRef = useRef<TWeekModel[]>([]);
  const morphRef = useRef<SnailGridRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const paintedRef = useRef<ELifeMode>(lifeMode);
  const scrollRef = useRef<number>(0);

  const framesFor = (mode: ELifeMode) => {
    if (mode === ELifeMode.Months) return computeMonthsFrames(stateRef.current);
    if (mode === ELifeMode.Seasons) return computeSeasonsFrames(stateRef.current);
    return computeYearsFrames(stateRef.current);
  };

  // Corner ratio (radius / cell size) for the morph sprite, matched to a mode's
  // rest cells. Picking the target keeps the morph END exactly on the rest radius.
  const cornerRatioFor = (mode: ELifeMode): number => {
    const state = stateRef.current;
    if (!state.app) return 0;
    const screenSize = state.isScreenMedium ? 'small' : 'large';
    const radius = BORDER_RADIUS_MAP[mode][screenSize];

    let cell = 0;
    if (mode === ELifeMode.Months) {
      const width = state.container?.clientWidth || state.app.renderer.width;
      cell = getMonthDynamicWeekWidth(5, width, WEEK_IN_MONTH_GAP);
    } else if (mode === ELifeMode.Seasons) {
      cell = computeSeasonsLayout(state).small;
    } else {
      cell = computeYearsLayout(state).cellWidth;
    }

    return cell > 0 ? radius / cell : 0;
  };

  // Big (preview) weeks settle on a fixed radius, not a size-scaled one. Give the
  // morph their own corner ratio + index set so they land exactly on the rest look.
  const bigInfoFor = (mode: ELifeMode): { indices: Set<number>; ratio: number } => {
    const state = stateRef.current;
    const indices = new Set<number>();
    if (!state.app) return { indices, ratio: 0 };
    const screenSize = state.isScreenMedium ? 'small' : 'large';

    if (mode === ELifeMode.Months) {
      const { drawWeekIndexes, media } = state;
      const { lastWeekIndex, monthsIndxs } = drawWeekIndexes;
      for (let i = 0; i <= lastWeekIndex; i += 1) {
        const m = monthsIndxs[i];
        if (m?.media && media[m.media]?.isMonthPreview === true) indices.add(i);
      }
      const width = state.container?.clientWidth || state.app.renderer.width;
      const bigSize =
        getMonthDynamicWeekWidth(5, width, WEEK_IN_MONTH_GAP) * LARGE_MONTH_WEEK_SIZE_MULTIPLIER;
      const radius = BIG_BORDER_RADIUS_MAP[ELifeMode.Months][screenSize];
      return { indices, ratio: bigSize > 0 ? radius / bigSize : 0 };
    }

    if (mode === ELifeMode.Seasons) {
      const layout = computeSeasonsLayout(state);
      layout.blocks.forEach(({ block }) => indices.add(block.indices[block.bigPos]));
      const radius = BIG_BORDER_RADIUS_MAP[ELifeMode.Seasons][screenSize];
      return { indices, ratio: layout.bigSize > 0 ? radius / layout.bigSize : 0 };
    }

    return { indices, ratio: 0 };
  };

  const weeksContainer = () =>
    stateRef.current.app?.stage.getChildByLabel(CONTAINER_LABELS.weeks) ?? null;

  // Configure the native scroller for the given mode (only months scrolls).
  const setupScroller = (mode: ELifeMode, contentHeight: number) => {
    const scroller = scrollerRef.current;
    const spacer = spacerRef.current;
    if (!scroller || !spacer) return;

    const scrollable = isScrollable(mode);
    // Extra room past the content so the final row can be scrolled up toward
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

    // Seasons has no frame scene yet: switch instantly rather than faking a morph.
    if (!hasMorphFrames(fromMode) || !hasMorphFrames(toMode)) {
      paint(toMode);
      return;
    }

    const from = framesFor(fromMode);
    const to = framesFor(toMode);
    const models = modelsRef.current;

    // Start the morph from where a scrolled (months / seasons) view currently sits.
    if (isScrollable(fromMode) && scrollRef.current !== 0) {
      from.translate(0, scrollRef.current);
    }

    // Hide the exact rest layer + disable scrolling while the morph plays.
    const weeks = state.app.stage.getChildByLabel(CONTAINER_LABELS.weeks);
    if (weeks) weeks.visible = false;
    if (scrollerRef.current) scrollerRef.current.style.pointerEvents = 'none';

    // Corner ratio matched to the target mode so the morph ends on its rest radius.
    // Big weeks carry their own ratio so their fixed radius doesn't snap at settle.
    const cornerRatio = cornerRatioFor(toMode);
    const big = bigInfoFor(toMode);

    const renderer = new SnailGridRenderer(
      state.app.stage,
      state.app.renderer,
      state.theme,
      cornerRatio,
      big.ratio,
      big.indices,
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
      if (!isScrollable(paintedRef.current) || morphRef.current) return;
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
      paint(lifeMode);
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

  // Animate on mode change (years <-> months); seasons switches instantly for now.
  useEffect(() => {
    if (!stateRef.current.app) return;
    if (paintedRef.current === lifeMode) return;
    runMorph(paintedRef.current, lifeMode);
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
