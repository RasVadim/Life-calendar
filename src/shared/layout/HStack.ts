export type Size = { width: number, height: number }
export type Origin = { x: number, y: number }
export type Rect = { origin: Origin, size: Size }
export type Axis = 'x' | 'y'

export type StackAxisProps = {
    axis: Axis
    oppositeAxis: Axis
}

export const layoutHStack = (props: StackProps) => {
    return layoutStack({ ...props, axis: 'x', oppositeAxis: 'y' })
}

export const layoutVStack = (props: StackProps) => {
    return layoutStack({ ...props, axis: 'y', oppositeAxis: 'x' })
}

const lengthAlongAxis = (axis: Axis, size: Size) => {
    return axis === 'x' ? size.width : size.height
}

// Input
export type StackProps = {
    container: Size
    children: Size[]
    spacing: Size
}

// Output
export type StackLayout = {
    origin: Origin
    children: Rect[]
}

const layoutStack = (props: StackProps & StackAxisProps): StackLayout => {
    const { container, children, spacing, axis, oppositeAxis } = props

    const childrenLength = children.reduce((acc, child) => acc + lengthAlongAxis(axis, child), 0)
    const spacingLength = lengthAlongAxis(axis, spacing)
    const totalLength = childrenLength + spacingLength * (children.length - 1)

    const maxBreadth = children.reduce((acc, child) => Math.max(acc, lengthAlongAxis(oppositeAxis, child)), 0)

    const containerLength = lengthAlongAxis(axis, container)
    const containerBreadth = lengthAlongAxis(oppositeAxis, container)

    // align to center on both axes
    // optionally, you can add alignment to the props and handle it here
    const origin = {
        [axis]: (containerLength - totalLength) / 2, 
        [oppositeAxis]: (containerBreadth - maxBreadth) / 2,
    }

    let position = origin[axis]
    const childrenRects = children.map(child => {
        const childOrigin = {
            [axis]: position,
            [oppositeAxis]: (containerBreadth - lengthAlongAxis(oppositeAxis, child)) / 2,
        }
        position += lengthAlongAxis(axis, child) + spacingLength
        return { origin: childOrigin as Origin, size: child }
    })

    return { origin: origin as Origin, children: childrenRects }
}
