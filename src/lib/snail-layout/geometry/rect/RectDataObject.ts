import { MutableRectData } from './types'

export class RectDataObject implements MutableRectData {
    constructor(public x: number, public y: number, public width: number, public height: number) {}
}
