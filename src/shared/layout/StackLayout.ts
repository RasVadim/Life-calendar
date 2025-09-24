import { Axis, Size, Origin, Rect } from "./types"
import { lengthAlongAxis } from "./lengthAlongAxis"
import { alignmentAlongAxis, Alignment } from "./alignment"

export const layoutHStack = (props: StackProps) => {
    return layoutStack({ ...props, axis: 'x', oppositeAxis: 'y' })
}

export const layoutVStack = (props: StackProps) => {
    return layoutStack({ ...props, axis: 'y', oppositeAxis: 'x' })
}

export type StackAxisProps = {
    axis: Axis
    oppositeAxis: Axis
}

// Input
export type StackProps = {
    children: Size[]
    spacing: Size
    alignment: Alignment
}

// Output
export type StackLayout = {
    children: Rect[]
    size: Size
}

const layoutStack = (props: StackProps & StackAxisProps): StackLayout => {
    const { children, spacing,  axis, oppositeAxis } = props

    const childrenLength = children.reduce((acc, child) => acc + lengthAlongAxis(axis, child), 0)
    const spacingLength = lengthAlongAxis(axis, spacing)
    const totalLength = childrenLength + spacingLength * (children.length - 1)

    const maxBreadth = children.reduce((acc, child) => Math.max(acc, lengthAlongAxis(oppositeAxis, child)), 0)

    const alignment = alignmentAlongAxis(props.alignment, oppositeAxis)
    let position = 0
    const childrenRects = children.map(child => {
        let oppositeAxisPosition = 0
        switch (alignment) {
            case 'leading':
                oppositeAxisPosition = 0
                break
            case 'center':
                oppositeAxisPosition = (maxBreadth - lengthAlongAxis(oppositeAxis, child)) / 2
                break
            case 'trailing':
                oppositeAxisPosition = maxBreadth - lengthAlongAxis(oppositeAxis, child)
                break
        }
        const childOrigin = {
            [axis]: position,
            [oppositeAxis]: oppositeAxisPosition,
        }
        position += lengthAlongAxis(axis, child) + spacingLength
        return { origin: childOrigin as Origin, size: child }
    })

    return { children: childrenRects, size: { width: totalLength, height: maxBreadth } }
}
