import { Axis } from "./types"

const AlignmentMask = {
    left: 1 << 0,
    center: 1 << 1,
    right: 1 << 2,
    top: 1 << 3,
    middle: 1 << 4,
    bottom: 1 << 5
}

export type AlignmentPosition = 'leading' | 'center' | 'trailing'


export const HorizontalAlignment = {
    left: AlignmentMask.left,
    center: AlignmentMask.center,
    right: AlignmentMask.right,
}

export const VerticalAlignment = {
    top: AlignmentMask.top,
    middle: AlignmentMask.middle,
    bottom: AlignmentMask.bottom,
}

// TODO: need some generic magic
export type Alignment = number

const alignmentMap = new Map<number, AlignmentPosition>([
    [1 << 0, 'leading'],
    [1 << 1, 'center'],
    [1 << 2, 'trailing'],
])

export const alignmentAlongAxis = (alignment: number, axis: Axis): AlignmentPosition => {
    if (axis === 'x') {
        return alignmentMap.get(alignment & 0b00000111) ?? 'center'
    } else  {
        return alignmentMap.get((alignment >> 3) & 0b00000111) ?? 'center'
    }
}
