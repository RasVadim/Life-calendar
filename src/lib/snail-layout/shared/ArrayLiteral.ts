export type ArrayLiteral<T> = (T | T[] | (() => Generator<T, void, unknown>))[]

export const fromArrayLiteral = <T>(arrayLiteral: ArrayLiteral<T>): T[] => {
    if (Array.isArray(arrayLiteral[0])) {
        return arrayLiteral[0]
    } else if (typeof arrayLiteral[0] === 'function') {
        return Array.from((arrayLiteral[0] as () => Generator<T, void, unknown>)())
    } else {
        return arrayLiteral as T[]
    }
}
