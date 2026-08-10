import { RectAdapter, RectsDataBuffer } from '@snail/geometry/rect'
import { Size } from '@snail/geometry/size'
import { LayoutNode } from '@snail/layout/LayoutNode'
import { LayoutBuildContext, LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { ViewNode } from './ViewNode'

export class ViewLayoutBuilder extends LayoutNodeBuilder {
    constructor(size: Size, ...models: unknown[]) {
        super(size)
        this.models.push(...models)
    }

    override build(context: LayoutBuildContext): LayoutNode {
        const indicesRangeStart = context.modelIndex
        let frame = new RectAdapter(context.frames.getRef(context.modelIndex, this.models.length))
        context.modelIndex += this.models.length
        frame.width = this.size.width
        frame.height = this.size.height
        return new ViewNode(frame, this.models, { start: indicesRangeStart, end: context.modelIndex })
    }
}
