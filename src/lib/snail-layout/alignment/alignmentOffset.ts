import { Alignment } from "./types"

export const alignmentOffset = (alignment: Alignment, parent: number, child: number): number => { 
    if (alignment === Alignment.leading) return 0
    const diff = parent - child
    return alignment === Alignment.trailing ? diff : diff / 2
}
