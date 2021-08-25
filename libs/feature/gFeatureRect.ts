import {IObject, IPoint} from '../gInterface';
import FeatureLayer from '../layer/gLayerFeature';
import {IFeatureStyle, IRectShape} from './gInterface';
import {EFeatureType} from './gEnum';
import Feature from './gFeature';
import Graphic from '../gGraphic';
import CanvasLayer from '../layer/gLayerCanvas';
import Util from '../gUtil';

export default class RectFeature extends Feature {
    // function: constructor
    constructor(id: string, shape: IRectShape, props: IObject = {}, style: IFeatureStyle = {}) {
        super(id, EFeatureType.Rect, props, style);

        this.shape = shape;
    }

    // @override
    // 判断是否捕捉到当前对象，各子类自行实现
    captureWithPoint(point: IPoint): boolean {
        return Util.MathUtil.pointInRect(point, this.shape as IRectShape);
    }

    // 获取rect矩形的四个点
    getPoints(): IPoint[] {
        const {x: startX, y: startY, width, height} = this.shape as IRectShape;
        const endX = startX + width;
        const endY = startY - height;
        // 矩形点
        return [
            {x: startX, y: startY},
            {x: endX, y: startY},
            {x: endX, y: endY},
            {x: startX, y: endY}
        ];
    }

    // 执行绘制当前
    // @override
    refresh() {
        const dpr = CanvasLayer.dpr;
        const scale = this.layer.map.getScale();

        Graphic.drawRect(
            this.layer.canvasContext,
            this.shape as IRectShape,
            this.style,
            {
                format: (shape: IRectShape) => {
                    const {x, y, width, height} = shape;
                    const {x: screenX, y: screenY} = this.layer.map.transformGlobalToScreen({x, y});
                    const screenWidth = width * scale;
                    const screenHeight = height * scale;
                    return {
                        x: screenX * dpr,
                        y: screenY * dpr,
                        width: screenWidth * dpr,
                        height: screenHeight * dpr
                    }
                }
            }
        );
    }
}
