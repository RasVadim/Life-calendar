import { LayoutNode, LayoutNodeProps, LayoutContext } from '@snail/layout/LayoutNode'
import { Alignment, alignmentOffset } from '@snail/alignment'
import { StackAxisStrategy } from './StackAxisStrategy'
import { rectsIntersect, Rect } from '@snail/geometry/rect'
import { StackLayoutProperties } from './StackLayoutProperties'

export interface StackNodeProps extends LayoutNodeProps {
    readonly spacing: number
    readonly alignment: Alignment
    readonly axisStrategy: StackAxisStrategy
    readonly layoutProperties: StackLayoutProperties
}

export class StackNode extends LayoutNode {
    declare private readonly spacing: number
    declare private readonly alignment: Alignment
    declare private readonly axisStrategy: StackAxisStrategy
    declare private readonly layoutProperties: StackLayoutProperties

    constructor(
        props: StackNodeProps
    ) {
        super(props)
    }

    override layout(frame: Rect, context: LayoutContext): void {
        super.layout(frame, context)
        if (this.children.length < 1 || !rectsIntersect(frame, context.viewport)) {
            context.modelIndex += this.children.length
            return
        }
        
        const fixedAlignmentOffset = this.layoutProperties.childLengthAcrossAxis ? alignmentOffset(
            this.alignment, 
            this.axisStrategy.lengthAcrossAxis(this.layoutProperties.size), 
            this.axisStrategy.lengthAcrossAxis(this.children[0]!.frame.size)
        ) : undefined

        this.layoutProperties.layoutStrategy.layout(
            frame,
            context,
            this.spacing,
            this.alignment,
            fixedAlignmentOffset,
            this.layoutProperties,
            this.axisStrategy,
            this.children
        )
    }
}
