export interface Size {
    get width(): number
    get height(): number
}

export interface MutableSize extends Size {
    set width(value: number)
    set height(value: number)
}
