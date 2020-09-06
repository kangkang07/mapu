import { CanvasShape } from "./Shape";
import { ShapeType, LngLat, IShapeStyle } from "../Models";
import windingLine from '../Utils/windingLine';


const EPSILON = 1e-8;

function isAroundEqual(a, b) {
    return Math.abs(a - b) < EPSILON;
}

export class CanvasPolygon extends CanvasShape  {
    path: LngLat[] = []
    containerPath: LngLat[] = []
    h3Index: string = ''
    shape: ShapeType = 'polygon'
    constructor(path: LngLat[], style?: IShapeStyle) {
        super()
        this.path = path
        this.style = Object.assign({}, this.style, style)
        // this.setStyle(style)
    }
    getArea() {
        return  AMap.GeometryUtil.ringArea(this.path)
    }
    contain = function(x, y) {
        var w = 0;
        let points = this.containerPath
        var p = points[0];

        if (!p) {
            return false;
        }

        for (var i = 1; i < points.length; i++) {
            var p2 = points[i];
            w += windingLine(p[0], p[1], p2[0], p2[1], x, y);
            p = p2;
        }

        // Close polygon
        var p0 = points[0];
        if (!isAroundEqual(p[0], p0[0]) || !isAroundEqual(p[1], p0[1])) {
            w += windingLine(p[0], p[1], p0[0], p0[1], x, y);
        }

        return w !== 0;
    }
}
