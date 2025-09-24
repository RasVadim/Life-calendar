import { Alignment, alignmentAlongAxis } from './alignment'
import { Size, Offset } from './types'

export type ContainerProps = {
    container: Size
    child: Size
    alignment: Alignment
}

export const layoutContainer = (props: ContainerProps): Offset => {
    const { container, child, alignment } = props
    const horizontalAlignment = alignmentAlongAxis(alignment, 'x')
    const verticalAlignment = alignmentAlongAxis(alignment, 'y')

    let x: number
    let y: number
    switch (horizontalAlignment) {
        case 'leading':
            x = 0
            break
        case 'center':
            x = (container.width - child.width) / 2
            break
        case 'trailing':
            x = container.width - child.width
            break
    }
    switch (verticalAlignment) {
        case 'leading':
            y = 0
            break
        case 'center':
            y = (container.height - child.height) / 2
            break
        case 'trailing':
            y = container.height - child.height
            break
    }
    return { x, y }
}
