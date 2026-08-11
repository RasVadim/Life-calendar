import { Size } from '@snail/geometry/size'
import { MutableRect, MutableRectData, Rect } from './types'
import { RectDataObject } from './RectDataObject'

export class RectAdapter implements MutableRect {
    constructor(private data: MutableRectData) {}

    get x(): number { return this.data.x }
    get y(): number { return this.data.y }
    get width(): number { return this.data.width }
    get height(): number { return this.data.height }

    set x(value: number) { this.data.x = value }
    set y(value: number) { this.data.y = value }
    set width(value: number) { this.data.width = value }
    set height(value: number) { this.data.height = value }

    get top(): number { return this.data.y }
    get left(): number { return this.data.x }
    get bottom(): number { return this.data.y + this.data.height }
    get right(): number { return this.data.x + this.data.width }

    get size(): Size { return { width: this.data.width, height: this.data.height } }

    set top(value: number) { 
        const delta = value - this.y
        this.y = value
        this.height -= delta
    }
    set left(value: number) {
        const delta = value - this.x
        this.x = value
        this.width -= delta
    }
    set bottom(value: number) {
        const delta = value - this.y - this.height
        this.height += delta
    }
    set right(value: number) { 
        const delta = value - this.x - this.width
        this.width += delta
    }

    copy(): Rect {
        return new RectAdapter(new RectDataObject(this.x, this.y, this.width, this.height))
    }

    mutableCopy(): MutableRect {
        return new RectAdapter(new RectDataObject(this.x, this.y, this.width, this.height))
    }
}
