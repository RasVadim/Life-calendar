import { RectsDataBuffer } from '@snail/geometry/rect';
import { Container, Graphics, Renderer, Sprite, Texture } from 'pixi.js';

import { TTheme } from '../types';
import { getBGColor, getCachedColor } from '../utils';
import { TWeekModel } from './weekModel';

// Base size of the rounded sprite texture; corner radius scales with the sprite.
const TEXTURE_SIZE = 128;

const makeRoundedTexture = (renderer: Renderer, cornerRatio: number): Texture => {
  const radius = Math.min(TEXTURE_SIZE / 2, TEXTURE_SIZE * cornerRatio);
  const shape = new Graphics().roundRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE, radius).fill(0xffffff);
  const texture = renderer.generateTexture(shape);
  shape.destroy();
  return texture;
};

/**
 * Lightweight morph layer: one reusable rounded sprite per week, positioned by
 * interpolating two frame buffers. The corner radius is baked into the texture
 * as a fraction of size, so it grows smoothly as squares scale between modes.
 * Big (preview) weeks get their own texture/ratio so they settle on the fixed
 * big-week radius instead of a size-scaled small-week one.
 */
export class SnailGridRenderer {
  private readonly root = new Container();
  private readonly sprites: Sprite[] = [];
  private readonly texture: Texture;
  private readonly bigTexture: Texture | null;
  private readonly bigIndices: ReadonlySet<number>;

  constructor(
    private readonly stage: Container,
    renderer: Renderer,
    private theme: TTheme,
    cornerRatio: number,
    bigCornerRatio: number = cornerRatio,
    bigIndices: ReadonlySet<number> = new Set(),
  ) {
    this.stage.addChild(this.root);

    this.texture = makeRoundedTexture(renderer, cornerRatio);
    this.bigIndices = bigIndices;
    // Only spin up a second texture when big weeks actually need a different curve.
    this.bigTexture =
      bigIndices.size > 0 && bigCornerRatio !== cornerRatio
        ? makeRoundedTexture(renderer, bigCornerRatio)
        : null;
  }

  private textureFor(index: number): Texture {
    return this.bigTexture && this.bigIndices.has(index) ? this.bigTexture : this.texture;
  }

  private ensure(count: number, models: TWeekModel[]): void {
    for (let i = this.sprites.length; i < count; i += 1) {
      const sprite = new Sprite(this.textureFor(i));
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
   *
   * When `viewportHeight` is given, weeks whose full vertical travel (min→max of
   * both endpoints) stays entirely off-screen are hidden and skipped. Linear
   * interpolation keeps each square within its two endpoints, so this never
   * culls a square that crosses the viewport — no visual loss, just less GPU.
   */
  morph(
    from: RectsDataBuffer,
    to: RectsDataBuffer,
    t: number,
    models: TWeekModel[],
    viewportHeight?: number,
  ): void {
    const count = models.length;
    this.ensure(count, models);

    const a = from.buffer;
    const b = to.buffer;

    // Small margin so borders/threads near the edge aren't clipped early.
    const cullTop = -32;
    const cullBottom = (viewportHeight ?? Infinity) + 32;

    for (let i = 0; i < count; i += 1) {
      const o = i * 4;
      const ay0 = a[o + 1] ?? 0;
      const by0 = b[o + 1] ?? 0;
      const sprite = this.sprites[i]!;

      if (viewportHeight !== undefined) {
        const minTop = ay0 < by0 ? ay0 : by0;
        const maxBottom = Math.max(ay0 + (a[o + 3] ?? 0), by0 + (b[o + 3] ?? 0));
        if (maxBottom < cullTop || minTop > cullBottom) {
          sprite.visible = false;
          continue;
        }
        sprite.visible = true;
      }

      const ax = (a[o] ?? 0) + ((b[o] ?? 0) - (a[o] ?? 0)) * t;
      const ay = ay0 + (by0 - ay0) * t;
      const w = (a[o + 2] ?? 0) + ((b[o + 2] ?? 0) - (a[o + 2] ?? 0)) * t;
      const h = (a[o + 3] ?? 0) + ((b[o + 3] ?? 0) - (a[o + 3] ?? 0)) * t;

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
    this.bigTexture?.destroy(true);
    this.sprites.length = 0;
  }
}
