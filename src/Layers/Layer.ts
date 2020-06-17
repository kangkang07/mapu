import { MapView } from "../MapView";
import { ShapeType, RenderContext, LngLat, IShapeStyle, IMapEventListener, EventType, MapEvent } from "../Models";
import { CanvasShape } from '../Shapes/Shape';
import NanoId from 'nanoid'


export interface IRenderContext{
    ctx?: CanvasRenderingContext2D
    event?: MapEvent
    retina?: boolean
}

export interface IDataParams {
    config: any
    style: IShapeStyle
    extra?:any
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
    protected abstract CustomRender(rctx: IRenderContext,  eventProcess:(shape:CanvasShape)=>any): void

    
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

    render(rctx?: IRenderContext ) {
        let shapeHandler:IMapEventListener = null
        let layerHandler: IMapEventListener = null
        let mapHandler: IMapEventListener = null
        const eventProcess = (shape: CanvasShape) => { }

        // const eventProcess =  (shape:CanvasShape) => {
        //     let {
        //         ctx,event,retina
        //     } = rctx
        //     let eventName = event.type
        //     let eventSource:any
        //     for (let el of this.view.eventListenerList) {
        //         if (el.level === 'map') {
        //             mapHandler = el
        //         }
        //         if (el.level === 'shape' && el.nanoid === shape.nanoid && el.type === event.type) {
        //             shapeHandler = el
        //         }
        //         if (el.level === 'layer' && el.nanoid === this.nanoid && el.type === event.type) {
        //             layerHandler = el
        //         }
        //     }
        //     if (shapeHandler || layerHandler || mapHandler) {
        //         let x = event.offsetX
        //         let y = event.offsetY
        //         if (retina) {
        //             // x *= 2
        //             // y *= 2
        //         }
                
        //         if (ctx.isPointInPath(x, y) || ctx.isPointInStroke(x, y)) {
        //             if (shapeHandler) {
        //                 let handler = shapeHandler.handler
        //                 setTimeout(() => {
        //                     handler(event)
        //                 }, 0);
        //                 shapeHandler = null
        //             }
        //             if (layerHandler) {
        //                 let handler = layerHandler.handler

        //                 setTimeout(() => {
        //                     handler(event)
        //                 }, 0);
        //                 layerHandler = null
        //             }
        //             if (mapHandler) {
        //                 event.sourceObjects.push(shape)
        //                 event.sourceObjects.push(this)
        //             }
        //         } 
        //     }
        //     // if (eventName === 'mousemove') {
        //     //     shape.mouseOver = shapeEventHit
        //     // }
        // }
        this.CustomRender(rctx,eventProcess)
        // this.mouseOver = layerEventHit
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