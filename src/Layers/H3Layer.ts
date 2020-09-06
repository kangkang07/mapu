import { Layer, IRenderContext, IDataParams } from "./Layer";
import { RenderContext, LngLat, IShapeStyle } from "../Models";
import { CanvasPolygon } from '../Shapes/CanvasPolygon';
import { MapView } from '../MapView';
import { CanvasShape } from '../Shapes/Shape';
import PolygonLayer from './PolygonLayer';

const h3 = require('h3-js')

export default class H3Layer extends PolygonLayer {
    shapes: CanvasPolygon[] = []
    shapesMap: Map<string, CanvasPolygon> = new Map()
    indexes:any[] = []
    constructor(mapView:MapView) {
        super(mapView)
        this.shapeType = 'h3'
    }
    CustomRender(rctx: IRenderContext) {
        super.CustomRender(rctx)
    }
    protected parseData(data: IDataParams): CanvasPolygon {
        let index = data.index
        let path: any = h3.h3ToGeoBoundary(index)
        path = path.map(p => [p[1], p[0]])
        
        let shape = super.parseData({ path, style: data.style })
        shape.h3Index = index
        return shape
    }
}