import { Alignment } from '@snail/alignment'
import { LayoutBuildContext, LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { Size } from '@snail/geometry'
import { LayoutNode } from '@snail/layout/LayoutNode'
import { FrameNode } from './FrameNode'

export interface FrameBuilderProps {
    readonly size: Size
    readonly horizontalAlignment: Alignment
    readonly verticalAlignment: Alignment
    readonly child: LayoutNodeBuilder
}

export class FrameBuilder extends LayoutNodeBuilder {
    declare private readonly horizontalAlignment: Alignment
    declare private readonly verticalAlignment: Alignment

    constructor(props: FrameBuilderProps) {
        super(props.size, [props.child])
        Object.assign(this, props)
    }

    build(context: LayoutBuildContext): LayoutNode {
        return new FrameNode(
            {
                ...this.makeNodeProps(context),
                size: this.size,
                horizontalAlignment: this.horizontalAlignment,
                verticalAlignment: this.verticalAlignment,
            }
        )
    }
}
