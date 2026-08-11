import { FC, useEffect, useRef } from 'react';

import type { RectsDataBuffer } from '@snail/geometry/rect';

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

// Zoom axis: pinch-in (spread) walks toward Months, pinch-out toward Years,
// stopping on Seasons in between. Kept separate from ELifeMode's own order.
const MODE_ZOOM_ORDER = [ELifeMode.Years, ELifeMode.Seasons, ELifeMode.Months] as const;
// How far fingers must spread / squeeze (relative to the running baseline) to
// commit one mode step. Re-based after every step so a long pinch chains steps.
const PINCH_STEP_IN = 1.25;
const PINCH_STEP_OUT = 0.8;

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
  const [lifeMode, setLifeMode] = useLifeGridMode();
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
  const pinchRef = useRef<{ base: number } | null>(null);
  const lastStepRef = useRef<number>(0);
  // Pinch midpoint (container coords) to anchor the next zoom step on.
  const zoomAnchorRef = useRef<{ x: number; y: number } | null>(null);

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

  // Extra room past the content so the final row can be scrolled up toward the
  // screen center instead of being stuck at the bottom edge / behind nav.
  const bottomPadFor = (scroller: HTMLDivElement, mode: ELifeMode) =>
    isScrollable(mode) ? scroller.clientHeight * 0.35 : 0;

  // Configure the native scroller for the given mode (only months / seasons
  // scroll). `initialScroll` lets a zoom step land the view anchored, not at top.
  const setupScroller = (mode: ELifeMode, contentHeight: number, initialScroll = 0) => {
    const scroller = scrollerRef.current;
    const spacer = spacerRef.current;
    if (!scroller || !spacer) return;

    const scrollable = isScrollable(mode);
    const bottomPad = bottomPadFor(scroller, mode);
    spacer.style.height = scrollable ? `${contentHeight + bottomPad}px` : '0px';
    scroller.style.pointerEvents = scrollable ? 'auto' : 'none';
    // Browser clamps to the valid range once the spacer height is applied.
    scroller.scrollTop = scrollable ? initialScroll : 0;
  };

  const paint = (mode: ELifeMode, initialScroll = 0) => {
    const state = stateRef.current;
    state.lifeMode = mode;
    renderLife(state);
    paintedRef.current = mode;

    const weeks = weeksContainer();
    setupScroller(mode, weeks?.height ?? 0, initialScroll);

    // Sync the canvas offset to the (clamped) scroll position.
    const top = isScrollable(mode) ? (scrollerRef.current?.scrollTop ?? 0) : 0;
    scrollRef.current = -Math.round(top);
    if (weeks) weeks.y = scrollRef.current;
  };

  // Target scroll (px) for the zoomed-in `to` layout so the week currently under
  // the pinch point stays under it. `from` is already in screen coords here.
  const anchoredScroll = (
    from: RectsDataBuffer,
    to: RectsDataBuffer,
    anchorX: number,
    anchorY: number,
  ): number => {
    const a = from.buffer;
    const b = to.buffer;
    const n = modelsRef.current.length;

    // The focused week is the one under the fingers (rect hit, else nearest).
    let focus = 0;
    let best = Infinity;
    let hit = -1;
    for (let i = 0; i < n; i += 1) {
      const o = i * 4;
      const x = a[o] ?? 0;
      const y = a[o + 1] ?? 0;
      const w = a[o + 2] ?? 0;
      const h = a[o + 3] ?? 0;
      if (anchorX >= x && anchorX <= x + w && anchorY >= y && anchorY <= y + h) {
        hit = i;
        break;
      }
      const dx = x + w / 2 - anchorX;
      const dy = y + h / 2 - anchorY;
      const d = dx * dx + dy * dy;
      if (d < best) {
        best = d;
        focus = i;
      }
    }
    if (hit >= 0) focus = hit;

    const o = focus * 4;
    const targetCenter = (b[o + 1] ?? 0) + (b[o + 3] ?? 0) / 2;
    const desired = targetCenter - anchorY;

    // Clamp to the target layout's scrollable range (content + bottom pad).
    let contentH = 0;
    for (let i = 0; i < n; i += 1) {
      const p = i * 4;
      contentH = Math.max(contentH, (b[p + 1] ?? 0) + (b[p + 3] ?? 0));
    }
    const scroller = scrollerRef.current;
    const viewport = scroller?.clientHeight ?? 0;
    const bottomPad = scroller ? bottomPadFor(scroller, ELifeMode.Months) : 0;
    const maxScroll = Math.max(0, contentH + bottomPad - viewport);
    return Math.min(Math.max(desired, 0), maxScroll);
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

    // Anchor the zoom at the pinch midpoint: keep the focused week put instead of
    // snapping to the start of life. Only when the target scrolls (months/seasons).
    const anchor = zoomAnchorRef.current;
    zoomAnchorRef.current = null;
    let toScroll = 0;
    if (anchor && isScrollable(toMode)) {
      toScroll = anchoredScroll(from, to, anchor.x, anchor.y);
      if (toScroll !== 0) to.translate(0, -toScroll);
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
        paint(toMode, toScroll);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Advance one mode along the zoom axis. dir=+1 zooms in (toward Months),
  // dir=-1 zooms out (toward Years). Ignored while a morph plays, and rate-
  // limited to one step per morph so the sequence stays clean and smooth.
  const stepZoom = (dir: 1 | -1, anchor: { x: number; y: number } | null = null) => {
    const now = performance.now();
    if (morphRef.current || now - lastStepRef.current < MORPH_DURATION) return;
    const i = MODE_ZOOM_ORDER.indexOf(paintedRef.current);
    const next = Math.min(MODE_ZOOM_ORDER.length - 1, Math.max(0, i + dir));
    if (next === i) return;
    lastStepRef.current = now;
    // Consumed by the upcoming morph to keep the focused week under the fingers.
    zoomAnchorRef.current = anchor;
    setLifeMode(MODE_ZOOM_ORDER[next]);
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

  // Pinch-to-zoom drives the mode axis. Two-finger spread zooms in, squeeze
  // zooms out; each threshold cross commits one step and re-bases the gesture so
  // a long pinch chains steps. Ctrl+wheel (trackpad pinch) mirrors it on desktop.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const dist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    // Client point -> container-local coords (matches frame coordinate space).
    const toLocal = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    };

    const midpoint = (t: TouchList) =>
      toLocal((t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) pinchRef.current = { base: dist(e.touches) };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinchRef.current) return;
      // Own the two-finger gesture: block native scroll / page zoom underneath.
      e.preventDefault();
      const d = dist(e.touches);
      const ratio = d / pinchRef.current.base;
      if (ratio >= PINCH_STEP_IN) {
        stepZoom(1, midpoint(e.touches));
        pinchRef.current.base = d;
      } else if (ratio <= PINCH_STEP_OUT) {
        stepZoom(-1, midpoint(e.touches));
        pinchRef.current.base = d;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // trackpad pinch arrives as ctrl+wheel
      e.preventDefault();
      const anchor = toLocal(e.clientX, e.clientY);
      if (e.deltaY < 0) stepZoom(1, anchor);
      else if (e.deltaY > 0) stepZoom(-1, anchor);
    };

    // Capture phase + non-passive so we intercept before the native scroller.
    const opts = { passive: false, capture: true } as const;
    el.addEventListener('touchstart', onTouchStart, opts);
    el.addEventListener('touchmove', onTouchMove, opts);
    el.addEventListener('touchend', onTouchEnd, opts);
    el.addEventListener('touchcancel', onTouchEnd, opts);
    el.addEventListener('wheel', onWheel, opts);

    return () => {
      el.removeEventListener('touchstart', onTouchStart, opts);
      el.removeEventListener('touchmove', onTouchMove, opts);
      el.removeEventListener('touchend', onTouchEnd, opts);
      el.removeEventListener('touchcancel', onTouchEnd, opts);
      el.removeEventListener('wheel', onWheel, opts);
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
