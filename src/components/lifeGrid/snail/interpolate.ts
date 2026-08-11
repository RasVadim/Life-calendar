import { RectsDataBuffer } from '@snail/geometry/rect';

/** Linear interpolation between two scalars. */
export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

/** Smooth ease-in-out cubic for pinch morph progress. */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Element-wise lerp of two frame buffers produced by scenes over the same
 * model set. Writes into `out` when provided to avoid per-frame allocation.
 * Buffers are assumed to be the same length (same models => same size).
 */
export const interpolateFrames = (
  from: RectsDataBuffer,
  to: RectsDataBuffer,
  t: number,
  out?: RectsDataBuffer,
): RectsDataBuffer => {
  const len = Math.min(from.buffer.length, to.buffer.length);
  const target = out && out.buffer.length >= len ? out : new RectsDataBuffer(len / 4);

  const a = from.buffer;
  const b = to.buffer;
  const dst = target.buffer;

  for (let i = 0; i < len; i += 1) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dst[i] = av + (bv - av) * t;
  }

  return target;
};
