import { MutableRectData } from './types'

export class RectDataRef implements MutableRectData {
    private index: number
    constructor(private buffer: Float32Array, rectIndex: number, private count: number) {
        this.index = rectIndex * 4
    }

    get x(): number { return this.buffer[this.index]! }
    get y(): number { return this.buffer[this.index + 1]! }
    get width(): number { return this.buffer[this.index + 2]! }
    get height(): number { return this.buffer[this.index + 3]! }

    // TODO: probably better to use separate class aka RectsDataRef for multiple rects
    set x(value: number) { 
        for (let i = 0; i < this.count; i++) {
            this.buffer[(this.index + i * 4) + 0]! = value 
        }
    }
    set y(value: number) { 
        for (let i = 0; i < this.count; i++) {
            this.buffer[(this.index + i * 4) + 1]! = value 
        }
    }
    set width(value: number) { 
        for (let i = 0; i < this.count; i++) {
            this.buffer[(this.index + i * 4) + 2]! = value 
        }
    }
    set height(value: number) { 
        for (let i = 0; i < this.count; i++) {
            this.buffer[(this.index + i * 4) + 3]! = value 
        }
    }
}
