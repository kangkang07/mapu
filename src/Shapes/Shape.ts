
import { IShapeStyle, ShapeType, LngLat, IMapEventListener, EventType, MapEvent } from "../Models";
import NanoId from 'nanoid'
import { Layer } from '../Layers/Layer';
import { MapView } from '../MapView';

export interface IShapeConfig {

}

export class CanvasShape{
    style: IShapeStyle = {
        strokeWeight:2,
        fillColor: 'transparent',
        strokeColor: 'blue'
    }
    hoverStyle: IShapeStyle = null
    shape:ShapeType = 'shape'
    
    nanoid: string = NanoId()
    visible: boolean = true

    mouseOver: boolean = false
    
    extData: any = {}

    eventListeners: Map<EventType, IMapEventListener> = new Map()
    
    layer: Layer
    view: MapView

    constructor() {
       
    }
    setLayer(layer: Layer) {
        this.layer = layer
            this.view = layer.getMapView()
    }
    on(eventName: EventType, handler: (ev: MapEvent) => any) {
        this.eventListeners.set(eventName, {
            type: eventName,
            level:'shape',
            handler
        })
        // this.view.on(eventName,'layer',this, handler)
    }
    off(eventName: EventType) {
        this.eventListeners.delete(eventName)
        // this.view.off(eventName,'layer',this)
    }
 

    contain:(x:number, y:number)=>boolean = null
}



