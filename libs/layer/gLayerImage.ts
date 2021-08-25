import _forEach from 'lodash/forEach';
import _assign from 'lodash/assign';

import Feature from '../feature/gFeature';

import Map from '../gMap';
import {IObject, IPoint} from '../gInterface';
import Graphic from '../gGraphic';

import {ILayerStyle, IImageInfo} from './gInterface';
import CanvasLayer from './gLayerCanvas';
import {ELayerType} from './gEnum';

export default class ImageLayer extends CanvasLayer  {
    /**
     * props: image可选初始化配置项
     * defaultImageInfo: 默认配置项
     * image: userImage merge defaultImageInfo
    */
    static defaultImageInfo: IImageInfo = {
        src: '',
        width: 0,
        height: 0,
        position: {x: 0, y: 0} // 默认起始位置
    }
    public imageInfo: IImageInfo
    public image: HTMLImageElement

    public position: IPoint // 图片当前的位置

    // function: constructor
    constructor(id: string, image: IImageInfo, props: IObject = {}, style: ILayerStyle = {}) {
        super(id, ELayerType.Image, props, style);

        this.imageInfo = _assign({}, ImageLayer.defaultImageInfo, image);
        this.position = this.imageInfo.position;
        this.updateImage();
    }

    // 更新图片信息
    updateImageInfo(image: IImageInfo) {
        this.imageInfo = _assign({}, this.imageInfo, image);
        image.position && (this.position = this.imageInfo.position);
        image.src && this.updateImage();
        this.refresh();
    }

    // 更新image对象
    updateImage() {
        if (this.imageInfo.src) {
            this.image = new Image();
            this.image.src = this.imageInfo.src;
            this.image.onload = () => this.refresh();
        }
    }

    // @override
    onAdd(map: Map) {
        super.onAdd(map);
        this.refresh();
    }

    // 绘制image信息
    drawImage() {
        // 执行坐标转换
        const {x: screenX, y: screenY} = this.map.transformGlobalToScreen(this.position);

        const dpr = CanvasLayer.dpr;
        const scale = this.map.getScale();
        const {width, height} = this.imageInfo;
        const screenWidth = width * scale;
        const screenHeight = height * scale;

        Graphic.drawImage(
            this.canvasContext,
            {
                image: this.image,
                x: screenX * dpr,
                y: screenY * dpr,
                width: screenWidth * dpr,
                height: screenHeight * dpr
            },
            {}
        );
    }

    // @override
    refresh() {
        super.refresh();
        this.drawImage();
    }
}
