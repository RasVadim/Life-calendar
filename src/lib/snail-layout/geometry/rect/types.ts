import { Size } from "@snail/geometry/size"

export interface RectData {
    get x(): number
    get y(): number
    get width(): number
    get height(): number
}

export interface MutableRectData extends RectData {
    set x(value: number)
    set y(value: number)
    set width(value: number)
    set height(value: number)
}

export interface Rect extends RectData {
    get top(): number
    get left(): number
    get bottom(): number
    get right(): number
    get size(): Size

    copy(): Rect
    mutableCopy(): MutableRect
}

export interface MutableRect extends Rect {
    set x(value: number)
    set y(value: number)
    set width(value: number)
    set height(value: number)

    set top(value: number)
    set left(value: number)
    set bottom(value: number)
    set right(value: number)
}
