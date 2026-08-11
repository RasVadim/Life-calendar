import { LayoutNodeBuilder } from './LayoutNodeBuilder'
import { Size } from '@snail/geometry/size'
import { LayoutScene } from './LayoutScene'

export const Scene = (size: Size, layoutNodeBuilder: LayoutNodeBuilder): LayoutScene => {
    return new LayoutScene(size, layoutNodeBuilder)
}
