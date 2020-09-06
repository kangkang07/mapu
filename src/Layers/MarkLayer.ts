import { Layer, IRenderContext, IDataParams } from "./Layer";
import { RenderContext, LngLat, IShapeStyle } from "../Models";
import { CanvasMark } from '../Shapes/CanvasMark';
import { MapView } from '../MapView';
import { CanvasShape } from '../Shapes/Shape';
export default class MarkLayer extends Layer {
    shapes: CanvasMark[] = []
    shapesMap: Map<string, CanvasMark> = new Map()
    constructor(mapView:MapView) {
        super(mapView)
        this.shapeType = 'mark'
    }
    CustomRender({ ctx, retina, event }: IRenderContext) {
        this.shapesMap.forEach((shape) => {
            let style = shape.style

            ctx.fillStyle = style.strokeColor
            ctx.strokeStyle = 'transparent'// style.strokeColor
            ctx.lineWidth = style.strokeWeight
            if (retina) {
                // ctx.lineWidth *= 2
            }
            ctx.beginPath()
            
            shape = shape as CanvasMark
            let center = this.map.lngLatToContainer(new AMap.LngLat(shape.location[0], shape.location[1]))
            let r = shape.style.strokeWeight
            if (retina) {
                // center = (center as any).multiplyBy(2);
                // r *= 2
            }
            ctx.arc(center.getX(), center.getY(), r, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.stroke()
            ctx.fill()
        })
    }
    protected parseData(data:IDataParams): CanvasMark {
        let {loc, style} = data
        let shape = new CanvasMark(loc, style)
        shape.setLayer(this)
        return shape
    }
}