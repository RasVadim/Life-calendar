import { Size } from '@snail/geometry/size'
import { Rect } from '@snail/geometry/rect'
import { LayoutNodeBuilder } from './LayoutNodeBuilder'
import { LayoutTree } from './LayoutTree'
import { Layout } from './Layout'
import { RectFactory } from '@snail/geometry/rect'

export class LayoutScene {
    private tree: LayoutTree

    constructor(
        public readonly size: Size,
        layoutNodeBuilder: LayoutNodeBuilder
    ) {
        this.tree = new LayoutTree(layoutNodeBuilder)
    }

    layout(viewport?: Rect): Layout {
        const sceneFrame = RectFactory.rect(0, 0, this.size.width, this.size.height)
        return this.tree.layout(sceneFrame, viewport ?? sceneFrame)
    }
}
