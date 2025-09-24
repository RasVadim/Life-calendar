import { Axis, Size } from "./types"

export const lengthAlongAxis = (axis: Axis, size: Size) => {
    return axis === 'x' ? size.width : size.height
}
