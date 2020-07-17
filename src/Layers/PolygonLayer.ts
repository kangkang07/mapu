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
    CustomRender({ ctx,event, retina, mapBounds}: IRenderContext) {
        // console.log(ctx.canvas.width, ctx.canvas.height)
        let visCount = 0
        // console.time('trans')
        this.shapesMap.forEach((shape) => {
            let style = shape.style

          
            if (retina) {
                // ctx.lineWidth *= 2
            }
            let path = shape.path
            shape.containerPath.splice(0)
            let visible:boolean = false
            for (let i = 0; i < path.length; i++){
                let p = path[i]
                let pos = this.lnglatToContainer(p, mapBounds, ctx.canvas)
              
                // let pos = this.map.lngLatToContainer(p)
                if (retina) {
                    // pos = (pos as any).multiplyBy(2);
                }
                // let screenPos: LngLat = [pos.getX(), pos.getY()]
                let screenPos: LngLat = [pos.x, pos.y]
                shape.containerPath.push(screenPos)
                
                if (!visible && screenPos[0] > 0 && screenPos[0] < ctx.canvas.width && screenPos[1] > 0 && screenPos[1] < ctx.canvas.height) {
                    visible = true
                }
            }
            if (visible) {
                visCount++
                ctx.fillStyle = style.fillColor
                ctx.strokeStyle = style.strokeColor
                ctx.lineWidth = style.strokeWeight
                ctx.beginPath()

                for (let pos of shape.containerPath) {
                    ctx.lineTo(pos[0],pos[1])
                }
                ctx.closePath()
                ctx.stroke()
                ctx.fill()
            }
           
        })
        // console.log('viscount', visCount)
        // console.timeEnd('trans')
        
    }
    protected parseData(data: IDataParams): CanvasPolygon {
        let {path, style} = data
        let shape = new CanvasPolygon(path, style)
        shape.setLayer(this)
        return shape
    }
}