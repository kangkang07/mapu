import { MapView } from "../MapView";
import { ShapeType, RenderContext, LngLat, IShapeStyle, IMapEventListener, EventType, MapEvent } from "../Models";
import { CanvasShape } from '../Shapes/Shape';
import NanoId from 'nanoid'


export interface IRenderContext{
    ctx?: CanvasRenderingContext2D
    event?: MapEvent
    retina?: boolean
    mapBounds?: [any,any]
}

export interface IDataParams {
    path?: any
    radius?:  number
    loc?: any
    style: IShapeStyle
    extra?: any
    [other:string]:any
}

export abstract class Layer {
    shapes: CanvasShape[] = []
    shapesMap: Map<string, CanvasShape> = new Map()
    ids: string[] = []
    json: string = ''
    shapeType: ShapeType = 'shape'
    name: string = ''
    nanoid:string = NanoId()
    extData: any = {}
    style: IShapeStyle = {
        strokeWeight:2,
        fillColor: 'transparent',
        strokeColor: 'blue'
    }


    private _visible: boolean = true
    
    get visible() {
        return this._visible
    }
    
    private defaultStyle:IShapeStyle 

    private view: MapView

    eventListeners: Map<EventType, IMapEventListener> = new Map()

    mouseOver:boolean = false

    


    constructor(mapView:MapView) {
        this.view = mapView
        this.view.layersMap.set(this.nanoid, this)
        this.view.layers.push(this)

    }
    getMapView() {
        return this.view
    }

    get map(): AMap.Map{
        return this.view ? this.view.map : null
    }
    on(eventName: EventType, handler: (ev: MapEvent) => any) {
        this.eventListeners.set(eventName, {
            type: eventName,
            level:'layer',
            handler
        })
        // this.view.on(eventName,'layer',this, handler)
    }
    off(eventName: EventType) {
        this.eventListeners.delete(eventName)
        // this.view.off(eventName,'layer',this)
    }
    // setMapView(view: MapView) {
    //     this.view = view
    //     view.map.ad
    // }

    hide() {
        this._visible = false
        this.view.render()
    }
    show() {
        this._visible = true
        this.view.render()
    }

    clear() {
        this.shapesMap.clear()
        this.shapes.splice(0)
        this.view.render()
    }


    // 具体的图层数据处理由子类实现
    protected abstract parseData(data: IDataParams): CanvasShape
    
    // 具体的render逻辑由子类实现
    protected abstract CustomRender(rctx: IRenderContext): void

    
    addShape(shape: CanvasShape, name?:string) {
        this.shapes.push(shape)
        this.shapesMap.set(shape.nanoid, shape)
        this.view.render()
    }


    removeShape(param: string | CanvasShape) {
        let shape, id
        if (typeof param === 'string') {
            id = param
            shape = this.shapesMap.get(id)
        } else if (param instanceof CanvasShape) {
            shape = param
            id = param.nanoid
        }
        if (shape) {
            this.shapesMap.delete(id)
            this.shapes.splice(this.shapes.indexOf(shape),1)
        }
        this.view.render()

    }

    lnglatToContainer(lnglat: LngLat, bounds:[any,any], container:any) {
        let [lngRange, latRange] = bounds
        // if (lnglat[0] < lngRange[0] || lnglat[0] > lngRange[1] || lnglat[1] < latRange[0] || lnglat[1] > latRange[1]) {
        //     return null
        // }
        let lngRatio = (lnglat[0] - lngRange[0]) / (lngRange[1] - lngRange[0])
        let latRatio = (lnglat[1] - latRange[0]) / (latRange[1] - latRange[0])
        let x = Math.round(lngRatio * container.width)
        let y = Math.round((1 - latRatio) * container.height)
        return { x, y }
    
    }

    render(rctx?: IRenderContext ) {
        let shapeHandler:IMapEventListener = null
        let layerHandler: IMapEventListener = null
        let mapHandler: IMapEventListener = null
        this.CustomRender(rctx)
    }
   
    data(data: IDataParams[]) {
        this.shapesMap.clear()
        this.shapes.splice(0)
        data.forEach(d => {
            let shape = this.parseData(d)
            shape.extData = d.extra
            this.shapesMap.set(shape.nanoid, shape)
            this.shapes.push(shape)
        })
        this.view.render()
    }
}