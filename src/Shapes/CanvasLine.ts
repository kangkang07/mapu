import { CanvasShape } from "./Shape";
import { ShapeType, LngLat, IShapeStyle } from "../Models";
export class CanvasLine extends CanvasShape {
    path: LngLat[] = []
    containerPath: LngLat[] = []
    shape: ShapeType = 'line'
    constructor(path: LngLat[], style?: IShapeStyle) {
        super()
        this.path = path
        this.style = Object.assign({}, this.style, style)
        // this.setStyle(style)
    }
}