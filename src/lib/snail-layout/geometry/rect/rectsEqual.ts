import { Rect } from './types'

export const rectsEqual = (a: Rect, b: Rect): boolean => {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}
