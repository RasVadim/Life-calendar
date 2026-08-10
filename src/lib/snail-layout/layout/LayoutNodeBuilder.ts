import { Size } from '@snail/geometry/size'
import { LayoutNode, LayoutNodeProps } from './LayoutNode'
import { RectFactory, RectsDataBuffer } from '@snail/geometry/rect'
import { FrameProps } from './components/frame/Frame'
import { PaddingProps } from './components/padding/Padding'

export interface LayoutBuildContext {
    readonly frames: RectsDataBuffer
    modelIndex: number
}

export interface LayoutNodeBuilder {
    frame(props: FrameProps): LayoutNodeBuilder
    padding(props: PaddingProps): LayoutNodeBuilder
}

export abstract class LayoutNodeBuilder {
    readonly models: unknown[] = []

    constructor(public readonly size: Size, public readonly children: LayoutNodeBuilder[] = []) {
        for (const child of children) {
            this.models.push(...child.models)
        }
    }

    abstract build(context: LayoutBuildContext): LayoutNode

    protected makeNodeProps(context: LayoutBuildContext): LayoutNodeProps {
        const indicesRangeStart = context.modelIndex
        return {
            frame: RectFactory.mutableRectObject(0, 0, this.size.width, this.size.height),
            models: this.models,
            children: this.children.map(child => child.build(context)),
            indicesRange: { start: indicesRangeStart, end: context.modelIndex }
        }
    }
}
