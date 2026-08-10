import { Rect } from './types'

export const rectsIntersect = (a: Rect, b: Rect): boolean => {
    return !(
        a.x + a.width  <= b.x || // a is to the left of b
        b.x + b.width  <= a.x || // b is to the left of a
        a.y + a.height <= b.y || // a is above b
        b.y + b.height <= a.y    // b is above a
    )
}
