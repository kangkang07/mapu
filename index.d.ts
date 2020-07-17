export declare interface IShapeStyle {
    fillColor?: string // 多边形填充颜色
    strokeWeight?: number // 线条宽度
    strokeColor?: string // 线条颜色
    [other:string]:any
}
export declare interface ICanvasEvent {
    isEvent: boolean
    type: 'hover' | 'click'
    loc: { x: number, y: number }
}


export declare type ShapeType = 'shape'|'line'|'polygon'|'circle'|'mark'|'h3'


export declare interface IPromiseCallback{
    resolve:Function
    reject:Function
}

export declare type LngLat = [number, number]

export declare type RenderContext = {
    ctx: CanvasRenderingContext2D
    retina: boolean
}

export declare type MapObject = CanvasShape|Layer|MapView


export declare class MapEvent extends MouseEvent {
    sourceObjects: MapObject[]
    extData:any
    static create(mouseEv: MouseEvent, extData?:any) : MapEvent
}


export declare interface IMapEventListener {
    type: EventType
    level: string
    nanoid: string
    source: CanvasShape | Layer | MapView
    handler: (e: MapEvent) => void
}

export declare type TMouseStatus = "mouseover"

export declare type EventType = 'click' | 'hover' | 'dblclick' | 'mousemove' |'unmousemove'

export declare interface IRenderContext{
    ctx?: CanvasRenderingContext2D
    event?: MapEvent
    retina?: boolean
}

export declare class MapView{
    constructor()
    map: any
    nanoid: string
    layers: Layer[]
    customCanvasLayer: any
    extraData: any
    render():void
    addControl(ctrl:string, config?:any):void
    initMap(el: any, config: any, plugins?: string[]):Promise<void>
    on(eventName: EventType, handler: (ev: MapEvent) => any): void
    off(eventName: EventType): void
    

}
export declare class CanvasShape{
    style: IShapeStyle
    shape: ShapeType
    nanoid: string
    visible: boolean
    extData: any
    layer: Layer
    view: MapView
    setLayer(layer: Layer): void
    on(eventName: EventType, handler: (ev: MapEvent) => any) :void
    off(eventName: EventType) :void
}

export declare class CanvasCircle extends CanvasShape {
    center: LngLat
    radius: number
    constructor(center: LngLat, radius: number, style?: IShapeStyle)
    
}
export declare class CanvasLine extends CanvasShape {
    path: LngLat[]
    constructor(path:LngLat[],style?:IShapeStyle)
}
export declare class CanvasMark extends CanvasShape {
    location: LngLat
    constructor(location:LngLat,style?:IShapeStyle)
}
export declare class CanvasPolygon extends CanvasShape {
    path: LngLat[]
    constructor(path:LngLat[],style?:IShapeStyle)
}


export declare class Layer{
    shapes: CanvasShape[]
    shapeMap: Map<string, CanvasShape>
    ids: string[]
    json: string
    shapeType: ShapeType
    name: string
    nanoid: string
    extData: any
    style: IShapeStyle
    readonly visible: boolean
    readonly map:any
    getMapView(): MapView
    on(eventName: EventType, handler: (ev: MapEvent) => any)
    off(eventName: EventType)
    hide()
    show()
    clear()
    render(rctx?: IRenderContext)
    data(data: any)
}
export declare class CircleLayer extends Layer {
    shapes: CanvasCircle[]
    shapeMap: Map<string, CanvasCircle>
    constructor(mapView:MapView)
}
export declare class LineLayer extends Layer {
    shapes: CanvasLine[]
    shapeMap: Map<string, CanvasLine>
    constructor(mapView:MapView)
}
export declare class MarkLayer extends Layer {
    shapes: CanvasMark[]
    shapeMap: Map<string, CanvasMark>
    constructor(mapView:MapView)
}
export declare class PolygonLayer extends Layer {
    shapes: CanvasPolygon[]
    shapeMap: Map<string, CanvasPolygon>
    constructor(mapView:MapView)
}
export declare class H3Layer extends PolygonLayer {
    shapes: CanvasPolygon[]
    shapeMap: Map<string, CanvasPolygon>
    indexes:any[] 
    constructor(mapView:MapView)
}

declare type CalcType = 'log10'|'log2'|'ln'|'logx'|'linear'
declare type ColorUtils = {
    calcColorLevel(val: number, max: number, calcType?: CalcType, base?: number),
    generateColor(num?: number, alpha?: number): string | string[],
    hex2rgb(val: String, alpha?: number): string,
    rgb2hex(rgb: string): string,
    toRGBA(val: string, alpha?: number): string
}
export declare const colorUtils: ColorUtils

declare const mapu: MapView 


export default mapu

