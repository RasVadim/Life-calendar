import { Container, Sprite, Texture } from 'pixi.js';

import { RectsDataBuffer } from '@snail/geometry/rect';

import { TTheme } from '../types';
import { getBGColor, getCachedColor } from '../utils';

import { TWeekModel } from './weekModel';

/**
 * Lightweight morph layer: one reusable tinted sprite per week, positioned by
 * interpolating two frame buffers. Used only during mode transitions — the
 * exact rest visuals (borders, half gradients, threads) are drawn elsewhere.
 */
export class SnailGridRenderer {
  private readonly root = new Container();
  private readonly sprites: Sprite[] = [];

  constructor(
    private readonly stage: Container,
    private theme: TTheme,
  ) {
    this.stage.addChild(this.root);
  }

  private ensure(count: number, models: TWeekModel[]): void {
    for (let i = this.sprites.length; i < count; i += 1) {
      const sprite = new Sprite(Texture.WHITE);
      this.root.addChild(sprite);
      this.sprites.push(sprite);
    }
    for (let i = 0; i < count; i += 1) {
      this.sprites[i]!.tint = getCachedColor(getBGColor(this.theme, models[i]?.holiday)).toNumber();
    }
  }

  /**
   * Interpolate every week between `from` and `to` at progress `t` (0..1).
   * Weeks that collapse to zero size on one side shrink/grow in place.
   */
  morph(from: RectsDataBuffer, to: RectsDataBuffer, t: number, models: TWeekModel[]): void {
    const count = models.length;
    this.ensure(count, models);

    const a = from.buffer;
    const b = to.buffer;

    for (let i = 0; i < count; i += 1) {
      const o = i * 4;
      const fw = a[o + 2] ?? 0;
      const fh = a[o + 3] ?? 0;
      const tw = b[o + 2] ?? 0;
      const th = b[o + 3] ?? 0;

      const zeroFrom = fw <= 0 || fh <= 0;
      const zeroTo = tw <= 0 || th <= 0;

      // Anchor position to the visible side so hidden weeks shrink in place.
      const ax = zeroTo ? (a[o] ?? 0) : zeroFrom ? (b[o] ?? 0) : (a[o] ?? 0) + ((b[o] ?? 0) - (a[o] ?? 0)) * t;
      const ay = zeroTo ? (a[o + 1] ?? 0) : zeroFrom ? (b[o + 1] ?? 0) : (a[o + 1] ?? 0) + ((b[o + 1] ?? 0) - (a[o + 1] ?? 0)) * t;
      const w = fw + (tw - fw) * t;
      const h = fh + (th - fh) * t;

      const sprite = this.sprites[i]!;
      const visible = w > 0.5 && h > 0.5;
      sprite.visible = visible;
      if (visible) {
        sprite.position.set(ax, ay);
        sprite.setSize(w, h);
      }
    }
  }

  setTheme(theme: TTheme): void {
    this.theme = theme;
  }

  destroy(): void {
    this.root.destroy({ children: true });
    this.sprites.length = 0;
  }
}
