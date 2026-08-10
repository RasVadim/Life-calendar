import { RectAdapter } from './RectAdapter'
import { RectDataObject } from './RectDataObject'
import { MutableRect, Rect } from './types'

export class RectFactory {
    private constructor() {}

    static zero(): Rect {
        return new RectAdapter(new RectDataObject(0, 0, 0, 0))
    }

    static rect(x: number, y: number, width: number, height: number): Rect {
        return new RectAdapter(new RectDataObject(x, y, width, height))
    }

    static mutableRectObject(x: number, y: number, width: number, height: number): MutableRect {
        return new RectAdapter(new RectDataObject(x, y, width, height))
    }

}
