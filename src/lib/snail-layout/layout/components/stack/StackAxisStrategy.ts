import { MutableRect } from '@snail/geometry/rect'
import { Rect } from '@snail/geometry/rect'
import { Size, MutableSize } from '@snail/geometry/size'
import { StackLayoutProperties } from './StackLayoutProperties'
import { LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { DefaultStackLayoutStrategy, FixedStackLayoutStrategy } from './StackLayoutStrategy'

export interface StackAxisStrategy {
    lengthAlongAxis(size: Size): number
    lengthAcrossAxis(size: Size): number
    positionAlongAxis(rect: Rect): number
    positionAcrossAxis(rect: Rect): number
    setPositionAlongAxis(rect: MutableRect, value: number): void
    setPositionAcrossAxis(rect: MutableRect, value: number): void
    layoutProperties(spacing: number, children: LayoutNodeBuilder[]): StackLayoutProperties
}

export const HStackAxisStrategy: StackAxisStrategy = {
    lengthAlongAxis: (size: Size) => size.width,
    lengthAcrossAxis: (size: Size) => size.height,
    positionAlongAxis: (rect: Rect) => rect.x,
    positionAcrossAxis: (rect: Rect) => rect.y,
    setPositionAlongAxis: (rect: MutableRect, value: number) => rect.x = value,
    setPositionAcrossAxis: (rect: MutableRect, value: number) => rect.y = value,
    layoutProperties: (spacing: number, children: LayoutNodeBuilder[]): StackLayoutProperties => { 
        if (children.length === 0) {
            return {
                size: { width: 0, height: 0 },
                childLengthAlongAxis: undefined,
                childLengthAcrossAxis: undefined,
                layoutStrategy: DefaultStackLayoutStrategy
            }
        }
        const firstChildSize = children[0]!.size
        let isSameChildrenLengthAlongAxis = true
        let isSameChildrenLengthAcrossAxis = true
        let size: MutableSize = { width: firstChildSize.width, height: firstChildSize.height }
        for (let i = 1; i < children.length; i++) {
            const child = children[i]!
            size.width += child.size.width + spacing
            size.height = Math.max(size.height, child.size.height)
            isSameChildrenLengthAlongAxis = isSameChildrenLengthAlongAxis && child.size.width === firstChildSize.width
            isSameChildrenLengthAcrossAxis = isSameChildrenLengthAcrossAxis && child.size.height === firstChildSize.height
        }
        return {
            size: { width: size.width, height: size.height },
            childLengthAlongAxis: isSameChildrenLengthAlongAxis ? firstChildSize.width : undefined,
            childLengthAcrossAxis: isSameChildrenLengthAcrossAxis ? firstChildSize.height : undefined,
            layoutStrategy: isSameChildrenLengthAlongAxis ? FixedStackLayoutStrategy : DefaultStackLayoutStrategy
        }
    }
}

export const VStackAxisStrategy: StackAxisStrategy = {
    lengthAlongAxis: (size: Size) => size.height,
    lengthAcrossAxis: (size: Size) => size.width,
    positionAlongAxis: (rect: Rect) => rect.y,
    positionAcrossAxis: (rect: Rect) => rect.x,
    setPositionAlongAxis: (rect: MutableRect, value: number) => rect.y = value,
    setPositionAcrossAxis: (rect: MutableRect, value: number) => rect.x = value,
    layoutProperties: (spacing: number, children: LayoutNodeBuilder[]): StackLayoutProperties => { 
        if (children.length === 0) {
            return {
                size: { width: 0, height: 0 },
                childLengthAlongAxis: undefined,
                childLengthAcrossAxis: undefined,
                layoutStrategy: DefaultStackLayoutStrategy
            }
        }
        const firstChildSize = children[0]!.size
        let isSameChildrenLengthAlongAxis = true
        let isSameChildrenLengthAcrossAxis = true
        let size: MutableSize = { width: firstChildSize.width, height: firstChildSize.height }
        for (let i = 1; i < children.length; i++) {
            const child = children[i]!
            size.height += child.size.height + spacing
            size.width = Math.max(size.width, child.size.width)
            isSameChildrenLengthAlongAxis = isSameChildrenLengthAlongAxis && child.size.height === firstChildSize.height
            isSameChildrenLengthAcrossAxis = isSameChildrenLengthAcrossAxis && child.size.width === firstChildSize.width
        }
        return {
            size: { width: size.width, height: size.height },
            childLengthAlongAxis: isSameChildrenLengthAlongAxis ? firstChildSize.height : undefined,
            childLengthAcrossAxis: isSameChildrenLengthAcrossAxis ? firstChildSize.width : undefined,
            layoutStrategy: isSameChildrenLengthAlongAxis ? FixedStackLayoutStrategy : DefaultStackLayoutStrategy
        }
    }
}
