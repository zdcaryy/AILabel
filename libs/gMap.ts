//
import events from 'events/events';

import _assign from 'lodash/assign';
import _uniqueId from 'lodash/uniqueId';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import _isNumber from 'lodash/isNumber';
import _cloneDeep from 'lodash/cloneDeep';
import _filter from 'lodash/filter';

import {EMapMode, ECursorType, EEventType, EUrlCursorType} from './gEnum';
import {IMapOptions, ISize, IPoint, ICenterAndZoom, ITransPointOption, IObject} from './gInterface';
import Layer from './layer/gLayer';
import EventLayer from './layer/gLayerEvent';
import OverlayLayer from './layer/gLayerOverlay';
import MarkerLayer from './layer/gLayerMarker';
import { IFeatureStyle, IRectShape } from './feature/gInterface';
import Feature from './feature/gFeature';

export default class Map {
    // props: domId / dom
    public domId: string
    public dom: HTMLElement

    // props: layerDomId / layerDom
    public layerDomId: string
    public layerDom: HTMLDivElement

    // props: platformDomId / platformDom
    public platformDomId: string
    public platformDom: HTMLDivElement

    // props: layerDom2Id / layerDom2
    public layerDom2Id: string
    public layerDom2: HTMLDivElement

    // props: controlDomId / controlDom
    public controlDomId: string
    public controlDom: HTMLDivElement

    /**
     * props: map可选初始化配置项
     * defaultMapOptions: 默认配置项
     * mapOptions: userMapOptions merge defaultMapOptions
    */
    static defaultMapOptions: IMapOptions = {
        center: {x: 0, y: 0}, // 中心点坐标
        zoom: 1000, // 缩放值
        mode: EMapMode.Pan, // 默认当前map模式
        size: null // 可自定义容器宽/高，默认取dom: clientWidth/clientHeight
    }
    private mapOptions: IMapOptions

    public zoom: number // 当前缩放值
    public center: IPoint // 左上角代表的实际坐标值

    // 当前map中包含的layers
    public layers: Layer[] = []
    // 当前map上的eventLayer: 做事件监听接收
    public eventLayer: EventLayer
    // 当前map上的overlayLayer: 临时绘制矢量元素
    public overlayLayer: OverlayLayer
    // 当前map上的markerLayer: 注记层，内部使用
    public markerLayer: MarkerLayer

    // 当前map模式-默认
    public mode: EMapMode

    // 绘制状态下相关样式设置
    public drawingStyle: IFeatureStyle = {}

    // events
    public eventsObServer: events.EventEmitter
    // 视野变化触发事件
    public boundsChangedTimer: number | null

    // 当前选中的激活feature对象
    public activeFeature: Feature | null = null

    // function: constructor
    constructor(domId: string, mapOptions?: IMapOptions) {
        this.domId = domId;
        this.dom = document.getElementById(domId);

        this.mapOptions = _assign({}, Map.defaultMapOptions, mapOptions);
        this.zoom = this.mapOptions.zoom; // 更新初始zoom
        this.center = this.mapOptions.center; // 更新初始origin
        this.mode = this.mapOptions.mode; // 更新初始map操作模式

        // 设置容器样式
        this.setDomStyle();
        // 分别创建platformContainer/layerContainer/controlCOntainer
        this.createSubDoms();
        // 添加overlayLayer至当前map，最终会被添加至platform层
        this.addOverlayLayer();
        // 添加eventLayer至当前map，最终会被添加至platform层
        this.addEventLayer();
        // 添加markerLayer至当前map，最终会被添加至platform层
        this.addMarkerLayer();
        // 事件监听实例添加
        this.eventsObServer = new events.EventEmitter();
    }

    // 设置dom容器的style样式
    setDomStyle() {
        this.dom.ondragstart = e => {
            e.preventDefault();
            e.stopPropagation();
        };
        this.dom.oncontextmenu = e => {
            e.preventDefault();
            e.stopPropagation();
        };
    }

    // 设置当前mapMode模式
    setMode(mode: EMapMode) {
        this.mode = mode;
        this.eventLayer.reset();

        // 切换mode时，需要取消activeFeature的选中
        if (this.activeFeature) {
            this.eventsObServer.emit(EEventType.FeatureUnselected, this.activeFeature, 'cancel by switch mode');
        }
    }

    // 设置当前map绘制状态样式
    setDrawingStyle(drawingStyle: IFeatureStyle) {
        this.drawingStyle = drawingStyle;
    }

    // 获取dom宽高（width/height）
    public getSize(): ISize {
        return this.mapOptions.size || {
            width: _get(this.dom, 'clientWidth', 0),
            height: _get(this.dom, 'clientHeight', 0)
        };
    }

    // 获取当前的缩放值
    public getScale(zoom?: number): number {
        const scaleZoom = _isNumber(zoom) ? zoom : this.zoom;
        const dot = 1000000; // 小数点6位数
        const {width} = this.getSize();
        const scale = parseInt(width * dot / scaleZoom + '', 10) / dot;
        return scale;
    }

    // 设置实际坐标系center
    public setCenter(center: IPoint): Map {
        this.center = center;
        this.refresh();
        this.triggerBoundsChanged();
        return this;
    }
    // 获取实际坐标系center
    public getCenter(): IPoint {
        return this.center;
    }

    // 获取屏幕中心点坐标
    public getScreenCenter(): IPoint {
        const {width, height} = this.getSize();
        return {
            x: width / 2,
            y: height / 2
        };
    }

    // 获取当前视野范围
    public getBounds(option?: IObject): IRectShape {
        const {width, height} = this.getSize();
        const {x: ltx, y: lty} = this.transformScreenToGlobal({x: 0, y: 0});
        const {x: rtx, y: rty} = this.transformScreenToGlobal({x: width, y: height});
        return {
            x: ltx,
            y: lty,
            width: rtx - ltx,
            height: lty - rty
        };
    }

    // 定位且zoom到指定zoom值
    centerAndZoom(options: ICenterAndZoom): Map {
        const {center, zoom} = options;
        center && (this.center = center);
        _isNumber(zoom) && (this.zoom = zoom);
        this.refresh();
        this.triggerBoundsChanged();
        return this;
    }

    // 放大-中心点放大
    zoomIn(): void {
        this.zoom = this.zoom / 2;
        this.refresh();
        this.triggerBoundsChanged();
    }

    // 缩小
    zoomOut(): void {
        this.zoom = this.zoom * 2;
        this.refresh();
        this.triggerBoundsChanged();
    }

    // 添加layer至当前map容器
    addLayer(layer: Layer) {
        // 首先将layer-dom-append到容器中
        const layerDom = layer.dom;
        this.layerDom.appendChild(layerDom);
        // 然后调用layer的onAdd方法
        layer.onAdd(this);
        // 添加对象layers中
        this.layers.push(layer);
    }
    // 删除指定layer
    removeLayerById(targetLayerId: string) {
        const newLayers = _filter(this.layers, (layer: Layer) => {
            const layerId = layer.id;
            if (layerId === targetLayerId) {
                layer.onRemove();
                return false;
            }
            return true;
        });
        // 重新设置最新的layers
        this.layers = newLayers;
        // 执行重绘刷新
        this.refresh();
    }
    // 删除所有layer[除内置layers]
    removeAllLayers() {
        const newLayers = _filter(this.layers, (layer: Layer) => {
            layer.onRemove();
            return false;
        });
        // 重新设置最新的layers
        this.layers = newLayers;
        // 执行重绘刷新
        this.refresh();
    }
    // 获取所有手动添加的layers
    public getLayers(): Array<Layer> {
        return this.layers;
    }

    // 触发视野范围变化回调
    triggerBoundsChanged() {
        // 通知上层视野范围发生变化
        if (this.boundsChangedTimer) {
            window.clearTimeout(this.boundsChangedTimer);
            this.boundsChangedTimer = null;
        }
        this.boundsChangedTimer = window.setTimeout(() => {
            this.eventsObServer.emit(EEventType.BoundsChanged);
        }, 666);
    }

    // 刷新当前视图
    refresh() {
        // 用户加入layer刷新
        _forEach(this.layers, (layer: Layer) => layer.refresh());
        // markerLayer也要伴随刷新
        this.markerLayer.refresh();
    }

    // 设置当前active的feature
    setActiveFeature(feature: Feature | null) {
        this.activeFeature = feature;
        // 如果不存在feature，则清空overLayer, 否则添加activeFeature
        feature && this.overlayLayer.addActiveFeature(feature);
        !feature && this.overlayLayer.clear();
        // 主动触发一次mouseMove事件
        const mouseMoveEvent = this.eventLayer.mouseMoveEvent;
        mouseMoveEvent && this.eventLayer.onMouseMove(mouseMoveEvent);
    }
    // 获取当前active的feature
    getActiveFeature(): Feature | null {
        return this.activeFeature;
    }



    // 屏幕坐标转换全局【实际】坐标，默认基于中心点基准point进行计算
    public transformScreenToGlobal(screenPoint: IPoint, options?: ITransPointOption): IPoint {
        const {basePoint, zoom} = options || {};

        const scale = this.getScale(zoom);
        const {x: screenCenterX, y: screenCenterY} = this.getScreenCenter();
        const {x: screenX, y: screenY} = screenPoint;

        const screenBasePointX = _get(basePoint, 'screen.x', screenCenterX);
        const screenBasePointY = _get(basePoint, 'screen.y', screenCenterY);
        const {x: basePointX, y: basePointY} = _get(basePoint, 'global', this.center);

        const dltScreenX = screenX - screenBasePointX;
        const dltScreenY = screenY - screenBasePointY;

        return {
            x: basePointX + dltScreenX / scale,
            y: basePointY - dltScreenY / scale
        };
    }

    // 全局【实际】坐标转换屏幕坐标，默认基于中心点基准point进行计算
    public transformGlobalToScreen(globalPoint: IPoint, options?: ITransPointOption): IPoint {
        const {basePoint, zoom} = options || {};

        const scale = this.getScale(zoom);
        const {x: screenCenterX, y: screenCenterY} = this.getScreenCenter();
        const {x: globalX, y: globalY} = globalPoint;

        const screenBasePointX = _get(basePoint, 'screen.x', screenCenterX);
        const screenBasePointY = _get(basePoint, 'screen.y', screenCenterY);
        const {x: basePointX, y: basePointY} = _get(basePoint, 'global', this.center);

        const dltGlobalX = globalX - basePointX;
        const dltGlobalY = globalY - basePointY;

        return {
            x: screenBasePointX + dltGlobalX * scale,
            y: screenBasePointY - dltGlobalY * scale
        };
    }

    // 创建map容器下相关的container
    createSubDoms(): void {
        this.setLayerDom();
        this.setPlatformDom();
        this.setLayerDom2();
        this.setControlDom();
    }

    // 创建图层container
    setLayerDom(): void {
        const {width, height} = this.getSize();
        this.layerDomId = `layer-wrapper-${_uniqueId()}`;
        this.layerDom = document.createElement('div');
        this.layerDom.setAttribute('id', this.layerDomId);
        this.layerDom.style.position = 'absolute';
        this.layerDom.style.left = '0';
        this.layerDom.style.top = '0';
        this.layerDom.style.width = `${width}px`;
        this.layerDom.style.height = `${height}px`;
        this.layerDom.style.zIndex = '1';

        // add this.layerDom to dom
        this.dom.appendChild(this.layerDom);
    }
    // 创建platform平台container[不会进行位置的移动]
    setPlatformDom(): void {
        const {width, height} = this.getSize();
        this.platformDomId = `platform-wrapper-${_uniqueId()}`;
        this.platformDom = document.createElement('div');
        this.platformDom.setAttribute('id', this.platformDomId);
        this.platformDom.style.position = 'absolute';
        this.platformDom.style.left = '0';
        this.platformDom.style.top = '0';
        this.platformDom.style.width = `${width}px`;
        this.platformDom.style.height = `${height}px`;
        this.platformDom.style.zIndex = '5';
        // add this.platformDom to dom
        this.dom.appendChild(this.platformDom);
    }
    // 创建layer控件container【不同于setLayerDom的是：此容器width=0, height=0】
    setLayerDom2(): void {
        this.layerDom2Id = `layer2-wrapper-${_uniqueId()}`;
        this.layerDom2 = document.createElement('div');
        this.layerDom2.setAttribute('id', this.layerDom2Id);
        this.layerDom2.style.position = 'absolute';
        this.layerDom2.style.left = '0';
        this.layerDom2.style.right = '0';
        this.layerDom2.style.width = '0';
        this.layerDom2.style.height = '0';
        this.layerDom2.style.zIndex = '10';

        // add this.layerDom2 to dom
        this.dom.appendChild(this.layerDom2);
    }
    // 创建control控件container
    setControlDom(): void {
        this.controlDomId = `control-wrapper-${_uniqueId()}`;
        this.controlDom = document.createElement('div');
        this.controlDom.setAttribute('id', this.controlDomId);
        this.controlDom.style.position = 'absolute';
        this.controlDom.style.left = '0';
        this.controlDom.style.right = '0';
        this.controlDom.style.width = '0';
        this.controlDom.style.height = '0';
        this.controlDom.style.zIndex = '15';

        // add this.controlDom to dom
        this.dom.appendChild(this.controlDom);
    }

    // 添加eventLayer至当前map
    addEventLayer() {
        // 实例化eventLayer
        this.eventLayer = new EventLayer(`event-${_uniqueId()}`, {}, {zIndex: 5});

        // 首先将layer-dom-append到容器中
        this.platformDom.appendChild(this.eventLayer.dom);
        this.eventLayer.onAdd(this);
    }

    // 添加overlayLayer至当前map
    addOverlayLayer() {
        // 实例化overlayLayer
        this.overlayLayer = new OverlayLayer(`overlay-${_uniqueId()}`, {}, {zIndex: 1});

        // 首先将layer-dom-append到容器中
        this.platformDom.appendChild(this.overlayLayer.dom);
        this.overlayLayer.onAdd(this);
    }

    // 添加markerLayer至当前map
    addMarkerLayer() {
        // 实例化markerLayer
        this.markerLayer = new MarkerLayer(`marker-${_uniqueId()}`, {}, {zIndex: 10});

        // 首先将layer-dom-append到容器中
        this.layerDom2.appendChild(this.markerLayer.dom);
        this.markerLayer.onAdd(this);
    }

    // setCursor
    setCursor(cursor: ECursorType): Map {
        this.platformDom.style.cursor = cursor;
        return this;
    }
    // setUrlCursor
    setUrlCursor(cursor: EUrlCursorType): Map {
        return this;
    }

    // map-dragging时调用，在平移时调用
    onDrag(dltX: number, dltY: number) {
        this.layerDom.style.left = `${dltX}px`;
        this.layerDom.style.top = `${dltY}px`;

        this.layerDom2.style.left = `${dltX}px`;
        this.layerDom2.style.top = `${dltY}px`;
    }

    // 复位
    reset(): Map {
        this.layerDom.style.left = '0';
        this.layerDom.style.top = '0';

        this.layerDom2.style.left = '0';
        this.layerDom2.style.top = '0';
        return this;
    }

    // 用户事件添加
    public events: IObject = {
        on: (eventType: EEventType, callback: Function) => {
            this.eventsObServer.on(eventType, callback);
        }
    }

    // 打印测试输出
    printInfo() {

    }
}
