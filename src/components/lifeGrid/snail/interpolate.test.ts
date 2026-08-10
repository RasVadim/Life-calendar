import { describe, expect, it } from 'vitest';

import { RectsDataBuffer } from '@snail/geometry/rect';

import { easeInOutCubic, interpolateFrames, lerp } from './interpolate';

describe('lerp', () => {
  it('returns endpoints at t=0 and t=1', () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it('returns the midpoint at t=0.5', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe('easeInOutCubic', () => {
  it('is pinned at 0 and 1', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it('is symmetric around 0.5', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 6);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1, 6);
  });
});

describe('interpolateFrames', () => {
  const makeBuffer = (rects: number[][]): RectsDataBuffer => {
    const buffer = new RectsDataBuffer(rects.length);
    rects.forEach((rect, i) => buffer.buffer.set(rect, i * 4));
    return buffer;
  };

  it('lerps each rect component at t=0.5', () => {
    const from = makeBuffer([[0, 0, 10, 10]]);
    const to = makeBuffer([[10, 20, 30, 40]]);

    const result = interpolateFrames(from, to, 0.5);

    expect(Array.from(result.buffer)).toEqual([5, 10, 20, 25]);
  });

  it('returns from-frames at t=0 and to-frames at t=1', () => {
    const from = makeBuffer([[1, 2, 3, 4]]);
    const to = makeBuffer([[5, 6, 7, 8]]);

    expect(Array.from(interpolateFrames(from, to, 0).buffer)).toEqual([1, 2, 3, 4]);
    expect(Array.from(interpolateFrames(from, to, 1).buffer)).toEqual([5, 6, 7, 8]);
  });

  it('reuses the provided out buffer', () => {
    const from = makeBuffer([[0, 0, 0, 0]]);
    const to = makeBuffer([[4, 4, 4, 4]]);
    const out = new RectsDataBuffer(1);

    const result = interpolateFrames(from, to, 0.25, out);

    expect(result).toBe(out);
    expect(Array.from(out.buffer)).toEqual([1, 1, 1, 1]);
  });
});
