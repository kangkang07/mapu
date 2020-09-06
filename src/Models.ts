import { CanvasShape } from './Shapes/Shape';
import { Layer } from './Layers/Layer';
import { MapView } from './MapView';


export interface IShapeStyle {
    fillColor?: string // 多边形填充颜色
    strokeWeight?: number // 线条宽度
    strokeColor?: string // 线条颜色
    [other:string]:any
}
export interface ICanvasEvent {
    isEvent: boolean
    type: 'hover' | 'click'
    loc: { x: number, y: number }
}

export type ShapeType = 'shape'|'line'|'polygon'|'circle'|'mark'|'h3'

export const ShapeTypeText = {
    'shape':'图形',
    'line':'线',
    'polygon':'多边形',
    'circle':'圆',
    'mark':'点',
    'h3':'h3块',
}

export interface IPromiseCallback{
    resolve:Function
    reject:Function
}

export type LngLat = [number, number]

export type RenderContext = {
    ctx: CanvasRenderingContext2D
    retina: boolean
}

export type MapObject = CanvasShape|Layer|MapView



export class MapEvent extends MouseEvent {
    sourceObjects: MapObject[]
    extData:any
    static create(mouseEv: MouseEvent, extData?:any) : MapEvent {
        let mapEv: MapEvent = mouseEv as MapEvent
        mapEv.sourceObjects = []
        mapEv.extData = extData
        return mapEv
    }
}


export interface IMapEventListener {
    type: EventType
    level: 'map'|'layer'|'shape'
    nanoid?: string
    source?: CanvasShape | Layer | MapView
    handler: (e: MapEvent) => void
}

export type TMouseStatus = "mouseover"

export type EventType = 'click' | 'hover' | 'dblclick' | 'mousemove' |'unmousemove'

export const EventTypes = ['click', 'hover', 'dblclick', 'mousemove','unmousemove']