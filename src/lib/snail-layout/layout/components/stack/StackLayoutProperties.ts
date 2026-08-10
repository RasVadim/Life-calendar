import { Size } from '@snail/geometry/size'
import { StackLayoutStrategy } from './StackLayoutStrategy'

export interface StackLayoutProperties {
    readonly size: Size
    readonly childLengthAlongAxis: number | undefined
    readonly childLengthAcrossAxis: number | undefined
    readonly layoutStrategy: StackLayoutStrategy
}
