import { Layer, IRenderContext, IDataParams } from "./Layer";
import { RenderContext, LngLat, IShapeStyle } from "../Models";
import { CanvasPolygon } from '../Shapes/CanvasPolygon';
import { MapView } from '../MapView';
import { CanvasShape } from '../Shapes/Shape';

export default class PolygonLayer extends Layer {
    shapes: CanvasPolygon[] = []
    shapesMap: Map<string, CanvasPolygon> = new Map()
    constructor(mapView:MapView) {
        super(mapView)
        this.shapeType = 'polygon'
    }
    CustomRender({ ctx,event, retina}: IRenderContext,  eventProcess:(shape:CanvasShape)=>any) {
      
        this.shapesMap.forEach((shape) => {
            let style = shape.style

            ctx.fillStyle = style.fillColor
            ctx.strokeStyle = style.strokeColor
            ctx.lineWidth = style.strokeWeight
            if (retina) {
                // ctx.lineWidth *= 2
            }
            ctx.beginPath()
            let path = shape.path
            shape.containerPath.splice(0)
            for (let i = 0; i < path.length; i++){
                let p = path[i]
                let pos = this.map.lngLatToContainer(p)
                if (retina) {
                    // pos = (pos as any).multiplyBy(2);
                }
                shape.containerPath.push([pos.getX(),pos.getY()])
                ctx.lineTo(pos.getX(),pos.getY())
            }
            ctx.closePath()
            // 处理事件

            if (event) {
                eventProcess(shape)
            }
            ctx.stroke()
            ctx.fill()
        })
        
    }
    protected parseData(data: IDataParams): CanvasPolygon {
        let {config, style} = data
        let shape = new CanvasPolygon(config, style)
        shape.setLayer(this)
        return shape
    }
}