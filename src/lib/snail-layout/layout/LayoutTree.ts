import { RectsDataBuffer } from '@snail/geometry/rect'
import { LayoutNodeBuilder, LayoutBuildContext } from './LayoutNodeBuilder'
import { LayoutNode, LayoutContext } from './LayoutNode'
import { Layout } from './Layout'
import { Rect } from '@snail/geometry/rect'

export class LayoutTree {
    private readonly models: unknown[]
    private readonly frames: RectsDataBuffer
    private readonly root: LayoutNode

    constructor(
        rootBuilder: LayoutNodeBuilder
    ) {
        this.models = rootBuilder.models
        this.frames = new RectsDataBuffer(this.models.length)
        let context: LayoutBuildContext = {
            frames: this.frames,
            modelIndex: 0
        }
        this.root = rootBuilder.build(context)
    }

    layout(scene: Rect, viewport: Rect): Layout {
        let indices: number[] = []
        let context: LayoutContext = {
            viewport: viewport,
            modelIndices: indices,
            modelIndex: 0
        }
        this.root.layout(scene, context)
        return {
            indices: indices,
            models: this.models,
            frames: this.frames
        }
    }
}
