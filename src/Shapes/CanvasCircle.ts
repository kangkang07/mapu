import { CanvasShape } from "./Shape";
import { ShapeType, LngLat, IShapeStyle } from "../Models";

export class CanvasCircle extends CanvasShape {
    center: LngLat
    radius: number
    shape: ShapeType = 'circle'
    centerPixel: { x: number, y: number }
    radiusPixel:number
    constructor(center: LngLat, radius: number, style?: IShapeStyle) {
        super()
        this.center = center
        this.radius = radius
        this.style = Object.assign({},this.style, style)
        // this.setStyle(style)
    }
    contain = function(x, y) {
        return Math.sqrt(Math.pow(x - this.centerPixel.x, 2) + Math.pow(y - this.centerPixel.y, 2)) < this.radiusPixel
    
    }
}
