import { RectsDataBuffer } from '@snail/geometry/rect'

export interface Layout {
    readonly indices: number[]
    readonly models: unknown[]
    readonly frames: RectsDataBuffer
}
