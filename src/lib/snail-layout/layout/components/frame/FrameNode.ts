import { Rect, Size, RectFactory } from '@snail/geometry';
import { LayoutContext, LayoutNode, LayoutNodeProps } from '@snail/layout/LayoutNode'
import { alignmentOffset, Alignment } from '@snail/alignment'

export interface FrameNodeProps extends LayoutNodeProps {
    readonly size: Size
    readonly horizontalAlignment: Alignment
    readonly verticalAlignment: Alignment
}

export class FrameNode extends LayoutNode implements FrameNodeProps {
    declare readonly size: Size
    declare readonly horizontalAlignment: Alignment
    declare readonly verticalAlignment: Alignment

    constructor(props: FrameNodeProps) {
        super(props)
    }

    override layout(frame: Rect, context: LayoutContext): void {
        super.layout(frame, context)
        const size = {
            width: Number.isFinite(this.size.width) ? this.size.width : frame.width,
            height: Number.isFinite(this.size.height) ? this.size.height : frame.height
        }
        const child = this.children[0]!
        const childFrame = RectFactory.rect(
            frame.x + alignmentOffset(
                this.horizontalAlignment, 
                size.width, 
                child.frame.size.width), 
            frame.y + alignmentOffset(
                this.verticalAlignment, 
                size.height, 
                child.frame.size.height
            ), 
            size.width,
            size.height
        )
        child.layout(childFrame, context)
    }
}
