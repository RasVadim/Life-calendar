import { LayoutBuildContext, LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { EdgeInsets } from '@snail/geometry'
import { LayoutNode } from '@snail/layout/LayoutNode'
import { PaddingNode } from './PaddingNode'

export interface PaddingBuilderProps {
    readonly padding: EdgeInsets
    readonly child: LayoutNodeBuilder
}

export class PaddingBuilder extends LayoutNodeBuilder {
    declare private readonly paddingInsets: EdgeInsets

    constructor(props: PaddingBuilderProps) {
        super(
            {
                width: props.padding.left + props.padding.right + props.child.size.width, 
                height: props.padding.top + props.padding.bottom + props.child.size.height 
            }, 
            [props.child]
        )
        this.paddingInsets = props.padding
    }

    override build(context: LayoutBuildContext): LayoutNode {
        return new PaddingNode({
            ...this.makeNodeProps(context),
            padding: this.paddingInsets
        })
    }
}
