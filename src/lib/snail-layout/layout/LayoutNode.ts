import { MutableRect } from '@snail/geometry/rect'
import { Rect } from '@snail/geometry/rect'

export interface LayoutContext {
    readonly viewport: Rect
    readonly modelIndices: number[]
    modelIndex: number
}

export interface LayoutNodeProps {
    readonly frame: MutableRect
    readonly models: unknown[]
    readonly indicesRange: { start: number, end: number }
    readonly children: LayoutNode[]
}

export class LayoutNode implements LayoutNodeProps {
    declare readonly frame: MutableRect
    declare readonly models: unknown[]
    declare readonly indicesRange: { start: number, end: number }
    declare readonly children: LayoutNode[]

    constructor(props: LayoutNodeProps) {
        Object.assign(this, props)
    }
    
    // TODO: probably Infinity values should be stored and used separately
    layout(frame: Rect, context: LayoutContext): void {
        this.frame.width = Number.isFinite(this.frame.width) ? this.frame.width : frame.width,
        this.frame.height = Number.isFinite(this.frame.height) ? this.frame.height : frame.height
    }
}
