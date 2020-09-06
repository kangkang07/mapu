import { hex2rgb, toRGBA } from './Utils/color'
import NanoId from 'nanoid'
import { IShapeStyle, IPromiseCallback,  ICanvasEvent, LngLat, IMapEventListener, EventType, EventTypes, MapEvent  } from './Models'
import { Layer, IRenderContext } from './Layers/Layer';
import { CanvasShape } from './Shapes/Shape';
import { CanvasPolygon } from './Shapes/CanvasPolygon';
import { CanvasCircle } from './Shapes/CanvasCircle';
import { CanvasMark } from './Shapes/CanvasMark';
import { CanvasLine } from './Shapes/CanvasLine';


const AMap:any = (window as any).AMap

export class MapView{

    h3HexagonStyle: IShapeStyle = {
        fillColor: 'rgba(0,44,222,.3)', // 多边形填充颜色
        strokeWeight: 0, // 线条宽度，默认为 1
        // strokeColor: 'rgba(0,44,222,.3)', // 线条颜色
        strokeColor: 'rgba(0,44,222,0)', // 线条颜色
    }
    map: AMap.Map
    nanoid:string = NanoId()
    ready: -1|0|1 = 0
    readyPromise: IPromiseCallback = null

    // custom render layer
    layersMap: Map<string, Layer> = new Map()
    layers: Layer[] = []
    customCanvasLayer: any

    renderFlag:boolean = false

    canvasShapesMap: Map<string, CanvasPolygon | CanvasCircle | CanvasMark | CanvasLine> = new Map()
    // 当发生交互事件时，置为true，之后触发一次渲染，并在渲染时触发事件处理
    canvasEvent: MouseEvent = null
    mapShapesMap: Map<string, any> = new Map()
    marksList: CanvasMark[] = []

    mouseTool: any = null
    onDrawClose: Function = null
    // 图形编辑器是单例，一次只能编辑一个。
    shapeEditor: any = null
    editingMapShape: any = null

    // 事件相关
    eventListenerList: IMapEventListener[] = []
    mouseDown: boolean = false
    mouseDownTime: number = null


    
    private mapEventListeners:Map<string, IMapEventListener> = new Map()

    extraData:any = {}
    

    on(eventName: EventType ,handler:(ev:MapEvent)=>any) {
        this.mapEventListeners.set(eventName,  {
            type: eventName,
            level:'map',
            handler
        })
    }
    off(eventName: EventType) {
        this.mapEventListeners.delete(eventName)
    }
    
    // constructor(el:any,config:any, plugins:string[] = ['AMap.MouseTool']) {
    //     this.initMap(el, config, plugins)
    // }
    async init(el: any, config:any, plugins: string[] = ['AMap.MouseTool']) {
        this.map = new AMap.Map(el, config) 
        
        return new Promise((resolve, reject) => {
            this.readyPromise = {resolve,reject}
            this.map.plugin(plugins, () => {

                let canvas = document.createElement('canvas')

                let layer = new (AMap as any).CustomLayer(canvas, {
                    alwaysRender: true,
                    map: this.map,
                    zIndex:100
                })

                layer.render = (rctx?: IRenderContext) => {
                    let size = this.map.getSize();//resize
        
                    let width = size.getWidth();
                    let height = size.getHeight();
                    let retina = AMap.Browser.retina;
                    // console.log('is retina:', retina)
                    // if(retina){//高清适配
                    //     width*=2;
                    //     height*=2;
                    // }
                    canvas.width = width;
                    canvas.height = height;//清除画布
                    canvas.style.width = width+'px'
                    canvas.style.height = height + 'px'

                    if (!rctx) {
                        rctx = {}
                    }
                    rctx.ctx = canvas.getContext('2d')
                    rctx.retina = retina
                    let bounds = this.map.getBounds()
                    let latRange = [], lngRange = []
                    let ne = bounds.getNorthEast(), sw = bounds.getSouthWest()
                    latRange = [sw.getLat(), ne.getLat()]
                    lngRange = [sw.getLng(),ne.getLng()]
                    rctx.mapBounds = [lngRange, latRange]

                    this.layers.sort((l1,l2)=>l1.zIndex - l2.zIndex).forEach(layer => {
                        if (layer.visible) {
                            layer.render(rctx)
                        }
                    })
                        
                   
                }
                ['click','dblclick', 'mousemove'].forEach((etype:EventType) => {
                    canvas.addEventListener(etype, (event: MouseEvent) => {
                        let dur = Date.now() - this.mouseDownTime
                        if (etype === 'click' && dur > 200) {
                            return
                        }
                        // 鼠标按下时不响应事件
                        if (this.mouseDown) {
                            return
                        }
                        // console.log(this.eventListenerList)
                        // let listener = this.eventListenerList.find(el => el.type === etype)

                        
                        // let shapeListener: IMapEventListener = null
                        // let layerListener: IMapEventListener = null
                        // let mapListener: IMapEventListener = null

                        const mapEvent = MapEvent.create(event)
                        // let rctx: IRenderContext = { event: mapEvent }
                        // if (listener.level === 'map') {
                        //     mapListener = listener
                        // }
                            
                        for (let layer of this.layers.sort((l1,l2)=>l2.zIndex - l1.zIndex)) {
                            let foundShape = null
                            for (let shape of layer.shapes) {
                                if (shape.contain && shape.contain(event.offsetX, event.offsetY)) {
                                    if (shape.eventListeners.has(etype)) {
                                        shape.eventListeners.get(etype).handler(mapEvent)
                                    }
                                    foundShape = shape
                                    mapEvent.sourceObjects.push(shape)
                                    break
                                }
                            }
                            if (foundShape) {
                                if (layer.eventListeners.has(etype)) {
                                    layer.eventListeners.get(etype).handler(mapEvent)
                                }
                                mapEvent.sourceObjects.push(layer)
                                break
                            }
                        }
                      
                        // layer.render(rctx)
                        if (this.mapEventListeners.has(etype)) {
                            this.mapEventListeners.get(etype).handler(mapEvent)
                        }
                    })
                })
                canvas.addEventListener('mousedown', ev => {
                    this.mouseDownTime = Date.now()
                    this.mouseDown = true
                })
                canvas.addEventListener('mouseup', ev => {
                    this.mouseDown = false
                })

                this.customCanvasLayer = layer

                this.ready = 1
                resolve()
            });
        })
    }

    render() {
        this.renderFlag = true
        setTimeout(() => {
            if (this.renderFlag) {
                this.renderFlag = false
                this.customCanvasLayer.render()
            }
        })
    }

    /**
     * 地图相关
     */

    setMap(map: any) {
        this.map = map
    }
    setZoomAndCenter(zoom: number, center: LngLat) {
        this.map.setZoomAndCenter(zoom, center)
    }
    setCenter(center: LngLat) {
        this.map.setCenter(center)
    }
    // 
    addControl(name: string, config?: any) {
        try{
            this.map.addControl(new AMap[name](config))
        }catch(e){

        }
    }
    addMarker(config: any = {}) {
        let marker = new AMap.Marker({
            map: this.map,
            ...config
        })
        marker.nanoid = NanoId()
        this.mapShapesMap.set(marker.nanoid, marker)
        return marker.nanoid
    }
    addMapPolygon(path: any, style: IShapeStyle = {}) {
        let defaultStyle : IShapeStyle = {
            fillColor: 'rgba(0,44,222,0)', // 多边形填充颜色
            strokeWeight: 2, // 线条宽度，默认为 1
            strokeColor: 'rgba(0,44,222,.5)', // 线条颜色
        }
        style = Object.assign({},defaultStyle,style)
        
        let polygon = new AMap.Polygon({
            path: path, 
            ...style,
        });
        polygon.nanoid = NanoId()
        this.mapShapesMap.set(polygon.nanoid, polygon)
        this.map.add(polygon);
        return polygon
    }
    removeMapItem(id: string) {
        let obj = this.mapShapesMap.get(id)
        if (obj) {
            this.map.remove(obj)
            this.mapShapesMap.delete(id)
        }
    }


    /**
     * 
     * shape 相关
     */
    
    addPolygon(polygon:CanvasPolygon):CanvasPolygon {
        this.canvasShapesMap.set(polygon.nanoid, polygon)
        this.renderShapes()
        return polygon
    }
    addPolygonFromMapPolygon(polygon: any): CanvasPolygon{
        let options = polygon.getOptions()
        let style: IShapeStyle = {
            fillColor:options.fillColor,
            strokeColor: options.strokeColor,
            strokeWeight:options.strokeWeight
        }
        return this.addPolygon(new CanvasPolygon(
            polygon.getPath().map((p:any) => [p.lng, p.lat]),
            style,
        ))
    }
    addCircle(circle: CanvasCircle): CanvasCircle {
        this.canvasShapesMap.set(circle.nanoid, circle)
        this.renderShapes()
        return circle
    }
    removeShapes(ids: string[]) {
        ids.forEach(id=>this.canvasShapesMap.delete(id))
        this.renderShapes()
    }
    hideShapes(ids: string[]) {
        this.setShapeVisible(ids.map(id => ({id,visible:false})))
    }
    showShapes(ids: string[]) {
        this.setShapeVisible(ids.map(id => ({id,visible:true})))
    }
    setShapeVisible(settings: any[]) {
        settings.forEach(setting => {
            let shape = this.canvasShapesMap.get(setting.id)
            if (shape) {
                shape.visible = setting.visible
            }
        })
        this.renderShapes()
    }
    renderShapes() {
        setTimeout(() => {
            // this.canvasLayer.render()
            this.layers.forEach(layer => {
                layer.render()
            })
        }, 0)
    }
    setShapeStyle(id: string, style: IShapeStyle) {
        let shape = this.canvasShapesMap.get(id)
        if (shape) {
            shape.style = Object.assign(shape.style, style)
            this.renderShapes()
        }
    }
    clearShapes() {
        this.canvasShapesMap.clear()
        this.mapShapesMap.clear()
        this.renderShapes()
    }
    setMarks(marks: CanvasMark[]) {
        this.marksList.forEach(mark => {
            this.canvasShapesMap.delete(mark.nanoid)
        })
        this.marksList = marks
        marks.forEach(mark => {
            this.canvasShapesMap.set(mark.nanoid,mark)
        })
        this.renderShapes()
    }
    
    // /**
    //  * 绘图相关
    //  * 
    //  *  */ 
    // drawPolygon(style?: IShapeStyle) {
    //     this.mouseTool.polygon(style)
    // }
    // editPolygon(id: string, onAdjust: Function = null) {
    //     // 一次只能编辑一个
    //     if (this.editingMapShape) {
    //         return
    //     }
    //     let polygon = this.canvasShapesMap.get(id)
    //     if (polygon) {
    //         this.hideShapes([id])
    //         polygon = polygon as CanvasPolygon
    //         let mapPolygon = new AMap.Polygon({
    //             path: polygon.path.map(p=>[p[0],p[1]]),
    //             ...polygon.style
    //         })
    //         mapPolygon.nanoid = id
    //         this.editingMapShape = mapPolygon
    //         this.map.add(mapPolygon)
    //         this.shapeEditor = new AMap.PolyEditor(this.map, mapPolygon)
    //         this.shapeEditor.open()
    //         if (onAdjust) {
    //             onAdjust({
    //                 id,
    //                 area: mapPolygon.getArea()
    //             })
    //             this.shapeEditor.on('adjust', () => {
    //                 onAdjust({
    //                     id,
    //                     area: mapPolygon.getArea()
    //                 })
    //             })
                
    //         }
    //     }
    // }
    // // 清除掉正在编辑的地图对象，并还原原有对象
    // private removeEditingShape() {
    //     if (this.editingMapShape) {
    //         this.shapeEditor.close()
    //         this.shapeEditor = null
    //         this.showShapes([this.editingMapShape.nanoid])
    //         this.map.remove(this.editingMapShape)
    //         this.editingMapShape = null
    //     }
    // }
    // // 关闭编辑，将当前编辑数据返回
    // closeEditShape() {
    //     if (this.editingMapShape) {
    //         let shape = this.canvasShapesMap.get(this.editingMapShape.nanoid) as CanvasPolygon
    //         let res = {
    //             id: this.editingMapShape.nanoid,
    //             area: this.editingMapShape.getArea(),
    //             path: this.editingMapShape.getPath().map((p:any)=>[p.lng,p.lat])
    //         }
    //         shape.path = res.path
            

    //         this.removeEditingShape()
    //         return res
    //     }
    //     return null
    // }
    // cancelEditShape() {
    //     this.removeEditingShape()

    // }
    // closeDrawPolygon() {
    //     this.mouseTool.close(true)
    // }

   

    /**
     * h3相关
     *  */

    

}

export default new MapView()