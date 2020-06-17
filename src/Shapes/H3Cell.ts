import { CanvasShape } from "./Shape";
import { ShapeType, LngLat, IShapeStyle } from "../Models";
import { CanvasPolygon } from "./CanvasPolygon";
const h3js = require('h3-js')

export class H3Cell extends CanvasPolygon {
    defaultResolution:number = 10
    constructor(index: string, style?: IShapeStyle) {
        super(h3js.h3ToGeoBoundary(index).map(p=>p.reverse()), style)
        let paths = this.makePolygonPath(index)
    }

    makePolygonPath(index: string):LngLat[]  {
        let paths = h3js.h3ToGeoBoundary(index)
        return paths.map(p=>p.reverse())
    }
    getH3Index(point: LngLat, resolution: Number) {
        
    }
}