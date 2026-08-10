import { LayoutNode, LayoutContext } from '@snail/layout/LayoutNode'
import { MutableRect, Rect } from '@snail/geometry/rect'

export class ViewNode extends LayoutNode {
    constructor(frame: MutableRect, models: unknown[], indicesRange: { start: number, end: number }) {
        super({ frame, children: [], models: models, indicesRange: indicesRange })
    }

    override layout(frame: Rect, context: LayoutContext): void {
        for (let i = 0 ; i < this.models.length ; i++) {
            context.modelIndices.push(context.modelIndex++)
        }
    }
}
