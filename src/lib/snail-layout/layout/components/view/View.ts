import { ViewLayoutBuilder } from './ViewBuilder'
import { LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { Size } from '@snail/geometry/size'


export const View = (size: Size, ...models: unknown[]): LayoutNodeBuilder => {
    // TODO: we should ensure there is at least one model
    return new ViewLayoutBuilder({ width: size.width, height: size.height }, ...models)
}
