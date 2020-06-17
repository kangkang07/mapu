import { CanvasShape } from "./Shape";
import { ShapeType, LngLat, IShapeStyle } from "../Models";

export class CanvasMark extends CanvasShape {
    shape: ShapeType = 'mark'
    location: LngLat
    
    constructor(location: LngLat, style?: IShapeStyle) {
        super()
        this.location = location
        this.style = Object.assign({},this.style, style)
    }
}
