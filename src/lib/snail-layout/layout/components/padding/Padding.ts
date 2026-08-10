export * from './PaddingBuilder'
import { PaddingBuilder } from './PaddingBuilder'
import { LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { EdgeInsets } from '@snail/geometry'

export type PaddingProps = EdgeInsets

LayoutNodeBuilder.prototype.padding = function(props: PaddingProps): LayoutNodeBuilder {
    return new PaddingBuilder({
        padding: { 
            top: props.top ?? 0, 
            left: props.left ?? 0, 
            bottom: props.bottom ?? 0, 
            right: props.right ?? 0 
        },
        child: this
    })
}
