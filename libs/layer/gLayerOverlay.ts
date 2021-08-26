import _forEach from 'lodash/forEach';
import _cloneDeep from 'lodash/cloneDeep';

import Point from '../feature/gFeaturePoint';
import Line from '../feature/gFeatureLine';
import Polyline from '../feature/gFeaturePolyline';
import Rect from '../feature/gFeatureRect';
import Polygon from '../feature/gFeaturePolygon';
import Circle from '../feature/gFeatureCircle';
import DrawAction from '../mask/gActionDraw';
import Text from '../text/gText';

import {IObject, IPoint} from '../gInterface';
import {ILayerStyle} from './gInterface';
import {ELayerType} from './gEnum';
import CanvasLayer from './gLayerCanvas';
import {ICircleShape, IFeatureStyle, ILineShape, IPointShape, IPolygonShape, IPolylineShape, IRectShape} from '../feature/gInterface';
import {IDrawActionShape} from '../mask/gInterface';
import Feature from '../feature/gFeature';
import Action from '../mask/gAction';
import {EFeatureType} from '../feature/gEnum';
import Util from '../gUtil';
import {ITextInfo} from '../text/gInterface';

export default class OverlayLayer extends CanvasLayer  {
    public featureActionTexts: Array<Feature | Action | Text> = [] // 当前featureLayer中所有的features

    // 默认active的样式
    defaultActiveFeatureStyle: IFeatureStyle = {
        strokeStyle: '#FF0000',
        fillStyle: '#FF0000',
        lineWidth: 1
    }

    // function: constructor
    constructor(id: string, props: IObject = {}, style: ILayerStyle = {}) {
        super(id, ELayerType.Overlay, props, style);
    }

    // 添加feature至当前FeatureLayer中
    addFeatureActionText(feature: Feature | Action | Text, option?: IObject) {
        const {clear = false} = option || {};
        clear && this.removeAllFeatureActionText();

        feature.onAdd(this);
        this.featureActionTexts.push(feature);
    }

    // 添加point
    addPointFeature(shape: IPointShape, option: IObject = {}) {
        const {style, clear = true, active = false} = option;
        const feature = new Point(
            `${+new Date()}`, // id
            shape, // shape
            {}, // props
            (style || this.map.drawingStyle), // style
            {active}
        );
        this.addFeatureActionText(feature, {clear});
    }

    // 添加line
    addLineFeature(shape: ILineShape, option: IObject = {}) {
        const {style, clear = true} = option;
        const feature = new Line(
            `${+new Date()}`, // id
            shape, // shape
            {}, // props
            (style || this.map.drawingStyle) // style
        );
        this.addFeatureActionText(feature, {clear});
    }

    // 添加polyline
    addPolylineFeature(shape: IPolylineShape, option: IObject = {}) {
        const {style, clear = true} = option;
        const feature = new Polyline(
            `${+new Date()}`, // id
            shape, // shape
            {}, // props
            (style || this.map.drawingStyle) // style
        );
        this.addFeatureActionText(feature, {clear});
    }

    // 添加rect
    addRectFeature(shape: IRectShape, option: IObject = {}) {
        const {style, clear = true} = option;
        const feature = new Rect(
            `${+new Date()}`, // id
            shape, // shape
            {}, // props
            (style || this.map.drawingStyle) // style
        );
        this.addFeatureActionText(feature, {clear});
    }

    // 添加polygon
    addPolygonFeature(shape: IPolygonShape, option: IObject = {}) {
        const {style, clear = true} = option;
        const feature = new Polygon( // 为了非闭合多段线
            `${+new Date()}`, // id
            shape, // shape
            {}, // props
            (style || this.map.drawingStyle) // style
        );
        this.addFeatureActionText(feature, {clear});
    }

    // 添加circle
    addCircleFeature(shape: ICircleShape, option?: IObject) {
        const {clear = true, style,  active = false} = option || {};

        const feature = new Circle(
            `${+new Date()}`, // id
            shape, // shape
            {}, // props
            (style || this.map.drawingStyle), // style
            {active}
        );
        this.addFeatureActionText(feature, {clear});
    }

    // 添加涂抹action
    addDrawAction(shape: IDrawActionShape) {
        const action = new DrawAction(
            `${+new Date()}`, // id
            'drawAction',
            shape, // shape
            {}, // props
            this.map.drawingStyle // style
        );
        this.addFeatureActionText(action, {clear: true});
    }

    // 添加文本
    addText(textInfo: ITextInfo, option?: IObject) {
        const {clear = true} = option || {};

        const text = new Text(
            `${+new Date()}`, // id
            {...textInfo, offset: {x: 5, y: -5}}, // shape
            {}, // props
            {
                fillStyle: '#FFFFFF',
                strokeStyle: '#D2691E',
                background: true,
                globalAlpha: 1,
                fontColor: '#333',
                font: 'normal 10px Arial',
                textBaseline: 'top'
            } // style
        );
        this.addFeatureActionText(text, {clear});
    }

    // 绘制当前activeFeature
    addActiveFeature(feature) {
        if (!feature) {
            this.removeAllFeatureActionText();
            return;
        }

        // 高亮的样式
        const style = this.defaultActiveFeatureStyle;
        // 做一下深度克隆，避免原有feature被污染[暂时不做克隆，效率太低]
        // const activeFeature = _cloneDeep(feature);
        const {type, shape} = feature;
        switch (type) {
            case EFeatureType.Point: {
                // this.addLineFeature(shape, {style});
                // const {start, end} = shape as ILineShape;
                // this.addActivePoints([start, end], {withCenterPoint: false});
                this.addPointFeature(shape, {style, active: true});
                break;
            }
            case EFeatureType.Line: {
                this.addLineFeature(shape, {style});
                const {start, end} = shape as ILineShape;
                this.addActivePoints([start, end], {withCenterPoint: false});
                break;
            }
            case EFeatureType.Polyline: {
                this.addPolylineFeature(shape, {style});
                this.addActivePoints(shape.points, {withCenterPoint: true});
                break;
            }
            case EFeatureType.Rect: {
                this.addRectFeature(shape, {style});
                const rectPoints = feature.getPoints();
                this.addActivePoints(rectPoints, {withCenterPoint: false});
                break;
            }
            case EFeatureType.Polygon: {
                this.addPolygonFeature(shape, {style});
                this.addActivePoints(shape.points, {withCenterPoint: true});
                break;
            }
            case EFeatureType.Circle: {
                this.addCircleFeature(shape, {style});
                const edgePoints = feature.getEdgePoints();
                this.addActivePoints(edgePoints, {withCenterPoint: false});
                break;
            }
        }
    }

    // 绘制高亮点
    addActivePoints(points: IPoint[], option: IObject = {}) {
        // withCenterPoint是否绘制节点中心点
        const {withCenterPoint = false} = option;

        _forEach(points, (point, index) => {
            const {x: x1, y: y1} = point;
            this.addCircleFeature(
                {sr: 3, cx: x1, cy: y1, stroke: false, fill: true},
                {clear: false, style: {fillStyle: '#FF0000'}}
            );
            if (withCenterPoint) {
                const nextPoint = points[index + 1] || points[0];
                const {x: middleX, y: middleY} = Util.MathUtil.getMiddlePoint(point, nextPoint);
                this.addCircleFeature(
                    {sr: 3, cx: middleX, cy: middleY, stroke: false, fill: true},
                    {clear: false, style: {fillStyle: '#FFDEAD'}}
                );
            }
        });
    }

    // 清空所有子对象
    removeAllFeatureActionText() {
        this.featureActionTexts = [];
        this.clear();
    }

    // @override
    refresh() {
        super.refresh();
        _forEach(this.featureActionTexts, (featureActionText: Feature | Action | Text) => featureActionText.refresh());
    }
}
