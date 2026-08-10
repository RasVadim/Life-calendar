import { Rect, EdgeInsets } from '@snail/geometry'
import { LayoutContext, LayoutNode, LayoutNodeProps } from '@snail/layout/LayoutNode'

export interface PaddingNodeProps extends LayoutNodeProps {
    readonly padding: EdgeInsets
}

export class PaddingNode extends LayoutNode {
    declare readonly padding: EdgeInsets

    constructor(props: PaddingNodeProps) {
        super(props)
    }

    override layout(frame: Rect, context: LayoutContext): void {
        super.layout(frame, context)
        const child = this.children[0]!
        child.frame.x = frame.x + this.padding.left
        child.frame.y = frame.y + this.padding.top
        // TODO: looks like crap
        child.frame.width = this.frame.width - this.padding.left - this.padding.right
        child.frame.height = this.frame.height - this.padding.top - this.padding.bottom
        child.layout(child.frame, context)
    }
}
