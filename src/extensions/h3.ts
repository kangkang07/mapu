const h3js = require('h3-js')
import {IShapeStyle} from '../Models'
import { CanvasPolygon } from '@/Shapes/CanvasPolygon';
import mapView, { MapView } from '@/MapView';
export class H3Utils extends MapView{
    h3Resolution: number = 9
    h3HexagonStyle:IShapeStyle
    getH3Index(lat: number | string, lng: number | string, resolution:Number) {
        return h3js.geoToH3(Number(lat), Number(lng), resolution)
    }
    paintH3Hexagon(index: string, style: IShapeStyle = {}):CanvasPolygon {
        style = Object.assign({},this.h3HexagonStyle,style)
       
        let hexPaths = h3js.h3ToGeoBoundary(index)
        let hexagon = mapView.addPolygon(new CanvasPolygon(hexPaths.map((p:any[]) => p.reverse()), style))
        hexagon.h3Index = index
        return hexagon
    }
    h3Polyfill(path: any[]) {
        return h3js.polyfill(path, this.h3Resolution);
    }
    fillWithH3(path: any[], style: IShapeStyle = {}) {
        // console.log(paths)
        style = Object.assign({}, this.h3HexagonStyle, style)
        const hexagons = this.h3Polyfill(path);
        return hexagons.map((index:string) => {
            return this.paintH3Hexagon(index,style)
        })
    }
}

export default new H3Utils()