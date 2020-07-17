import { Layer, IRenderContext, IDataParams } from "./Layer";
import { RenderContext, LngLat, IShapeStyle } from "../Models";
import { CanvasLine } from '../Shapes/CanvasLine';
import { MapView } from '../MapView';
import { CanvasShape } from '../Shapes/Shape';
export default class LineLayer extends Layer {
    shapes: CanvasLine[] = []
    shapesMap: Map<string, CanvasLine> = new Map()
    constructor(mapView:MapView) {
        super(mapView)
        this.shapeType = 'line'
    }
    CustomRender({ ctx, retina, event }:IRenderContext) {
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
                let pos = this.map.lngLatToContainer(new AMap.LngLat(p[0], p[1]))
                // console.log(pos)
                if (retina) {
                    // pos = (pos as any).multiplyBy(2);
                }
                shape.containerPath.push([pos.getX(),pos.getY()])
                ctx.lineTo(pos.getX(),pos.getY())
            }
            ctx.stroke()
        })
    }
    protected parseData(data: IDataParams): CanvasLine {
    
        let {path, style} = data
        let shape = new CanvasLine(path, style)
        shape.setLayer(this)
        return shape
    }
}