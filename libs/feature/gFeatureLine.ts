import _isNumber from 'lodash/isNumber';

import {IObject, IPoint} from '../gInterface';
import {IFeatureStyle, ILineShape} from './gInterface';
import {EFeatureType} from './gEnum';
import Feature from './gFeature';
import Graphic from '../gGraphic';
import CanvasLayer from '../layer/gLayerCanvas';
import Util from '../gUtil';

export default class LineFeature extends Feature {
    // function: constructor
    constructor(id: string, shape: ILineShape, props: IObject = {}, style: IFeatureStyle = {}) {
        super(id, EFeatureType.Line, props, style);

        this.shape = shape;
    }

    // @override
    // 判断是否捕捉到当前对象，各子类自行实现
    captureWithPoint(point: IPoint): boolean {
        const {start, end, width} = this.shape as ILineShape;
        const mapScale = this.layer?.map?.getScale();
        const bufferWidth = mapScale ? 3 / mapScale : 0;
        const tolerance = _isNumber(width) ? (width / 2 + bufferWidth) : bufferWidth;
        return Util.MathUtil.pointInPolyline(point, [start, end], {tolerance});
    }

    // 执行绘制当前
    // @override
    refresh() {
        // 执行坐标转换
        const {start, end, width} = this.shape as ILineShape;
        const {x: startX, y: startY} = this.layer.map.transformGlobalToScreen(start);
        const {x: endX, y: endY} = this.layer.map.transformGlobalToScreen(end);

        const dpr = CanvasLayer.dpr;
        const scale = this.layer.map.getScale();
        const screenWidth = (width || 0) * scale;

        Graphic.drawLine(
            this.layer.canvasContext,
            {
                start: {x: startX * dpr, y: startY * dpr},
                end: {x: endX * dpr, y: endY * dpr},
                ...(_isNumber(width) ? {width: screenWidth * dpr} : {})
            },
            this.style,
            {}
        );
    }
}
