import { Alignment, HorizontalAlignment, VerticalAlignment } from '@snail/alignment'
import { LayoutNodeBuilder } from '@snail/layout/LayoutNodeBuilder'
import { HStackAxisStrategy, VStackAxisStrategy } from '@snail/layout/components/stack/StackAxisStrategy'
import { StackBuilder } from '@snail/layout/components/stack/StackBuilder'
import { fromArrayLiteral, ArrayLiteral } from '@snail/shared/ArrayLiteral'

interface StackProps {
    readonly spacing: number
}

export interface VStackProps extends StackProps {
    readonly alignment?: HorizontalAlignment
}

export interface HStackProps extends StackProps {
    readonly alignment?: VerticalAlignment
}

export const HStack = (props: HStackProps, ...children: ArrayLiteral<LayoutNodeBuilder>): StackBuilder => {
    return new StackBuilder(
        {
            axisStrategy: HStackAxisStrategy, 
            spacing: props.spacing, 
            alignment: (props.alignment ?? VerticalAlignment.top) as unknown as Alignment, 
            children: fromArrayLiteral(children)
        }
    )
}

export const VStack = (props: VStackProps, ...children: ArrayLiteral<LayoutNodeBuilder>): StackBuilder => {
    return new StackBuilder(
        {
            axisStrategy: VStackAxisStrategy, 
            spacing: props.spacing, 
            alignment: (props.alignment ?? HorizontalAlignment.left) as unknown as Alignment, 
            children: fromArrayLiteral(children)
        }
    )
}
