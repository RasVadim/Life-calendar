import { Alignment, alignmentOffset } from '@snail/alignment'
import { StackAxisStrategy } from './StackAxisStrategy'
import { LayoutContext } from '@snail/layout/LayoutNode'
import { LayoutNode } from '@snail/layout/LayoutNode'
import { Rect } from '@snail/geometry/rect'
import { StackLayoutProperties } from './StackLayoutProperties'

export interface StackLayoutStrategy {
    layout(
        frame: Rect, 
        context: LayoutContext, 
        spacing: number,
        alignment: Alignment,
        fixedAlignmentOffset: number | undefined, 
        layoutProperties: StackLayoutProperties,
        axisStrategy: StackAxisStrategy,
        nodes: LayoutNode[]
    ): void
}

export const DefaultStackLayoutStrategy: StackLayoutStrategy = {
    layout(
        frame: Rect, 
        context: LayoutContext, 
        spacing: number,
        alignment: Alignment,
        fixedAlignmentOffset: number | undefined, 
        layoutProperties: StackLayoutProperties,
        axisStrategy: StackAxisStrategy,
        nodes: LayoutNode[]
    ): void {
        let pos = axisStrategy.positionAlongAxis(frame)
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]!
            axisStrategy.setPositionAlongAxis(node.frame, pos)
            axisStrategy.setPositionAcrossAxis(
                node.frame, 
                axisStrategy.positionAcrossAxis(frame) + 
                (
                    fixedAlignmentOffset ?? alignmentOffset(
                        alignment, 
                        axisStrategy.lengthAcrossAxis(layoutProperties.size), 
                        axisStrategy.lengthAcrossAxis(node.frame.size)
                    )
                )
            )
            pos += axisStrategy.lengthAlongAxis(node.frame.size) + spacing
            node.layout(node.frame, context)
        }
    }
}

const makeVisibleNodesRange = (
    frame: Rect,
    context: LayoutContext,
    spacing: number,
    layoutProperties: StackLayoutProperties,
    axisStrategy: StackAxisStrategy,
    nodes: LayoutNode[]
): { start: number, end: number } => {
    const pos = axisStrategy.positionAlongAxis(frame)
    const visibleRectStart = axisStrategy.positionAlongAxis(context.viewport)
    const visibleRectEnd = visibleRectStart + axisStrategy.lengthAlongAxis(context.viewport)
    const visibleRectLength = visibleRectEnd - visibleRectStart
    const startDiff = visibleRectStart - pos
    const start = startDiff > 0 
        ? Math.min(Math.floor(startDiff / (layoutProperties.childLengthAlongAxis! + spacing)), nodes.length - 1)
        : 0
    const end = Math.min(nodes.length, start + Math.ceil(visibleRectLength / (layoutProperties.childLengthAlongAxis! + spacing)))
    return { 
        start: start, 
        end: end
    }
}

export const FixedStackLayoutStrategy: StackLayoutStrategy = {
    layout(
        frame: Rect, 
        context: LayoutContext, 
        spacing: number,
        alignment: Alignment,
        fixedAlignmentOffset: number | undefined, 
        layoutProperties: StackLayoutProperties,
        axisStrategy: StackAxisStrategy,
        nodes: LayoutNode[]
    ): void {
        const visibleNodesRange = makeVisibleNodesRange(frame, context, spacing, layoutProperties, axisStrategy, nodes)

        const leadingSkipModelsRange = { 
            start: nodes[0]!.indicesRange.start, 
            end: nodes[visibleNodesRange.start]!.indicesRange.start 
        }

        const trailingSkipModelsRange = { 
            start: nodes[visibleNodesRange.end - 1]!.indicesRange.end, 
            end: nodes[nodes.length - 1]!.indicesRange.end 
        }

        context.modelIndex += leadingSkipModelsRange.end - leadingSkipModelsRange.start

        const pos = axisStrategy.positionAlongAxis(frame)
        for (let i = visibleNodesRange.start; i < visibleNodesRange.end; i++) {
            const node = nodes[i]!
            axisStrategy.setPositionAlongAxis(
                node.frame, 
                pos + (layoutProperties.childLengthAlongAxis! + spacing) * i
            )
            axisStrategy.setPositionAcrossAxis(
                node.frame, 
                axisStrategy.positionAcrossAxis(frame) + 
                (
                    fixedAlignmentOffset ?? alignmentOffset(
                        alignment, 
                        axisStrategy.lengthAcrossAxis(layoutProperties.size), 
                        axisStrategy.lengthAcrossAxis(node.frame.size)
                    )
                )
                
            )
            node.layout(node.frame, context)
        }

        context.modelIndex += trailingSkipModelsRange.end - trailingSkipModelsRange.start
    }
}
