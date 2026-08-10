import { FrameBuilder } from './FrameBuilder'
import { Alignment, HorizontalAlignment, VerticalAlignment } from '@snail/alignment'
import { LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'

export interface FrameProps {
    readonly width?: number
    readonly height?: number
    readonly maxWidth?: number
    readonly maxHeight?: number
    readonly minWidth?: number
    readonly minHeight?: number
    readonly horizontalAlignment?: HorizontalAlignment
    readonly verticalAlignment?: VerticalAlignment
}

LayoutNodeBuilder.prototype.frame = function(props: FrameProps): FrameBuilder {
    return new FrameBuilder({
        size: { 
            width: props.width ?? props.maxWidth ?? (props.minWidth ? Math.max(props.minWidth, this.size.width) : this.size.width),
            height: props.height ?? props.maxHeight ?? (props.minHeight ? Math.max(props.minHeight, this.size.height) : this.size.height)
        },
        horizontalAlignment: (props.horizontalAlignment ?? 0) as unknown as Alignment,
        verticalAlignment: (props.verticalAlignment ?? 0) as unknown as Alignment,
        child: this
    })
}
