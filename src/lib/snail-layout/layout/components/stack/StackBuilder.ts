import { LayoutBuildContext, LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { LayoutNode } from '@snail/layout/LayoutNode'
import { Alignment } from '@snail/alignment'
import { StackNode } from './StackNode'
import { StackAxisStrategy } from './StackAxisStrategy'
import { StackLayoutProperties } from './StackLayoutProperties'

export interface StackBuilderProps {
    readonly spacing: number
    readonly alignment: Alignment
    readonly axisStrategy: StackAxisStrategy
    readonly children: LayoutNodeBuilder[]
}

export class StackBuilder extends LayoutNodeBuilder implements StackBuilderProps {
    declare readonly spacing: number
    declare readonly alignment: Alignment
    declare readonly axisStrategy: StackAxisStrategy
    declare readonly children: LayoutNodeBuilder[]
    declare readonly layoutProperties: StackLayoutProperties

    constructor(
        props: StackBuilderProps
    ) {
        const layoutProperties = props.axisStrategy.layoutProperties(props.spacing, props.children)
        super(layoutProperties.size, props.children)
        this.layoutProperties = layoutProperties
        Object.assign(this, props)
    }

    override build(context: LayoutBuildContext): LayoutNode {
        return new StackNode(
            {
                ...this.makeNodeProps(context),
                spacing: this.spacing,
                alignment: this.alignment,
                axisStrategy: this.axisStrategy,
                layoutProperties: this.layoutProperties
            }
        )
    }
}
