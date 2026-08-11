import { MutableRectData } from './types'
import { RectDataRef } from './RectDataRef'

export class RectsDataBuffer {
    public buffer: Float32Array

    constructor(public length: number) {
        this.buffer = new Float32Array(length * 4)
    }

    getRef(rectIndex: number, count: number = 1): MutableRectData {
        return new RectDataRef(this.buffer, rectIndex, count)
    }

    translate(x: number, y: number) {
        for (let i = 0; i < this.buffer.length; i += 4) {
            this.buffer[i]! += x
            this.buffer[i + 1]! += y
        }
    }
}
