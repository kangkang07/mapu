import { Layer, IRenderContext } from "./Layer";
import { RenderContext, LngLat, IShapeStyle } from "../Models";
import { CanvasCircle } from '../Shapes/CanvasCircle';
import { MapView } from '../MapView';
import { CanvasShape } from '../Shapes/Shape';
export default class CircleLayer extends Layer {
    shapes: CanvasCircle[] = []
    shapesMap: Map<string, CanvasCircle> = new Map()
    constructor(mapView:MapView) {
        super(mapView)
        this.shapeType = 'circle'
    }
    CustomRender( { ctx, retina, event }:IRenderContext,eventProcess: (shape:CanvasShape)=>any) {
        this.shapesMap.forEach((shape) => {
            let style = shape.style

            ctx.fillStyle = style.fillColor
            ctx.strokeStyle = style.strokeColor
            ctx.lineWidth = style.strokeWeight
            if (retina) {
                // ctx.lineWidth *= 2
            }
            ctx.beginPath()
            shape = shape as CanvasCircle
            
            // let center = this.map.lngLatToContainer(new AMap.LngLat(shape.center[0], shape.center[1]))
            let center = this.map.lngLatToContainer(shape.center)
            let centerPixel = {
                x: center.getX(),
                y:center.getY()
            }
            // 计算一个比例，将实际距离转换为页面距离。由于纬度是均匀的，使用纬度
            let loc1 = shape.center
            let p1 = centerPixel
            let loc2:LngLat = shape.center.map(v => v) as LngLat
            if (loc2[1] >= 89) {
                loc2[1] -= 1
            } else {
                loc2[1] +=1
            }
            
            let p2 = this.map.lngLatToContainer(loc2)
            let locDistance = AMap.GeometryUtil.distance(loc1, loc2)
            let pDistance = Math.sqrt(Math.pow(p1.x - p2.getX(), 2) + Math.pow(p1.y - p2.getY(), 2))
            let ratio = pDistance / locDistance

            let r = shape.radius * ratio
            if (retina) {
                // center = (center as any).multiplyBy(2)
                // r *= 2
            }
            ctx.arc(center.getX(), center.getY(), r, 0, 2 * Math.PI)

            shape.centerPixel = centerPixel
            shape.radiusPixel = r


            ctx.closePath()
            if (event) {
                eventProcess(shape)
            }
            ctx.stroke()
            ctx.fill()
        })
    }
    protected parseData(data: { config: {center:LngLat,radius:number}, style: IShapeStyle, extra:any }): CanvasCircle {
    
        let { config, style } = data
        const {center,radius} = config
        let shape = new CanvasCircle(center, radius, style)
        shape.setLayer(this)
        return shape
    }
}