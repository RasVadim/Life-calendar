import { Container, Graphics, Renderer, Sprite, Texture } from 'pixi.js';

import { RectsDataBuffer } from '@snail/geometry/rect';

import { TTheme } from '../types';
import { getBGColor, getCachedColor } from '../utils';

import { TWeekModel } from './weekModel';

// Base size of the rounded sprite texture; corner radius scales with the sprite.
const TEXTURE_SIZE = 128;

/**
 * Lightweight morph layer: one reusable rounded sprite per week, positioned by
 * interpolating two frame buffers. The corner radius is baked into the texture
 * as a fraction of size, so it grows smoothly as squares scale between modes.
 */
export class SnailGridRenderer {
  private readonly root = new Container();
  private readonly sprites: Sprite[] = [];
  private readonly texture: Texture;

  constructor(
    private readonly stage: Container,
    renderer: Renderer,
    private theme: TTheme,
    cornerRatio: number,
  ) {
    this.stage.addChild(this.root);

    const radius = Math.min(TEXTURE_SIZE / 2, TEXTURE_SIZE * cornerRatio);
    const shape = new Graphics().roundRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE, radius).fill(0xffffff);
    this.texture = renderer.generateTexture(shape);
    shape.destroy();
  }

  private ensure(count: number, models: TWeekModel[]): void {
    for (let i = this.sprites.length; i < count; i += 1) {
      const sprite = new Sprite(this.texture);
      this.root.addChild(sprite);
      this.sprites.push(sprite);
    }
    for (let i = 0; i < count; i += 1) {
      this.sprites[i]!.tint = getCachedColor(getBGColor(this.theme, models[i]?.holiday)).toNumber();
    }
  }

  /**
   * Interpolate every week between `from` and `to` at progress `t` (0..1).
   * Same sprite per week in both modes, so squares rearrange directly.
   */
  morph(from: RectsDataBuffer, to: RectsDataBuffer, t: number, models: TWeekModel[]): void {
    const count = models.length;
    this.ensure(count, models);

    const a = from.buffer;
    const b = to.buffer;

    for (let i = 0; i < count; i += 1) {
      const o = i * 4;
      const ax = (a[o] ?? 0) + ((b[o] ?? 0) - (a[o] ?? 0)) * t;
      const ay = (a[o + 1] ?? 0) + ((b[o + 1] ?? 0) - (a[o + 1] ?? 0)) * t;
      const w = (a[o + 2] ?? 0) + ((b[o + 2] ?? 0) - (a[o + 2] ?? 0)) * t;
      const h = (a[o + 3] ?? 0) + ((b[o + 3] ?? 0) - (a[o + 3] ?? 0)) * t;

      const sprite = this.sprites[i]!;
      sprite.position.set(ax, ay);
      sprite.setSize(w, h);
    }
  }

  setTheme(theme: TTheme): void {
    this.theme = theme;
  }

  destroy(): void {
    this.root.destroy({ children: true });
    this.texture.destroy(true);
    this.sprites.length = 0;
  }
}
