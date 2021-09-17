import _forEach from 'lodash/forEach';
import _assign from 'lodash/assign';
import _last from 'lodash/last';
import _isNumber from 'lodash/isNumber';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _uniq from 'lodash/uniq';

import {IPoint, ISize} from '../gInterface';

import CanvasLayer from './gLayerCanvas';
import {IRectShape} from '../feature/gInterface';
import Feature from '../feature/gFeature';
import Text from '../text/gText';
import ImageLayer from './gLayerImage';
import Graphic from '../gGraphic';

export type IObjectItem = Feature | Text;

export default class ExportHelperLayer  {
    public bounds: IRectShape // canvas大小

    // public canvas: OffscreenCanvas
    // public canvasContext: OffscreenCanvasRenderingContext2D
    public canvas: HTMLCanvasElement
    public canvasContext: CanvasRenderingContext2D

    public objects: Array<IObjectItem> = [] // 当前maskLayer中所有的actions

    // 伪造map对象，给feature使用
    public map = {
        // 空属性/方法
        activeFeature: null,
        setActiveFeature() {},
        getScale() {
            return 1;
        },
        transformGlobalToScreen(point: IPoint): IPoint {
            const {x, y} = point;
            const {x: startX, y: startY} = this.bounds;
            return {x: x - startX, y: y - startY};
        }
    }

    // function: constructor
    constructor(bounds: IRectShape) {
        this.bounds = bounds;
        this.createRenderCanvas();

        // 对象冒充运行环境
        this.map.getScale = this.map.getScale.bind(this);
        this.map.transformGlobalToScreen = this.map.transformGlobalToScreen.bind(this);
    }

    // override 创建offscreenCanvas层
    createRenderCanvas() {
        // const {width, height} = this.bounds;
        // this.canvas = new OffscreenCanvas(width, height);
        // this.canvas.width = width * CanvasLayer.dpr;
        // this.canvas.height = height * CanvasLayer.dpr;
        // this.canvasContext = this.canvas.getContext('2d');

        const {width, height} = this.bounds;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width * CanvasLayer.dpr;
        this.canvas.height = height * CanvasLayer.dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.canvas.style.border = '1px solid red';
        this.canvasContext = this.canvas.getContext('2d');
        // document.body.appendChild(this.canvas);
    }

    // 添加object至当前HelperLayer中
    addObject(object: IObjectItem) {
        object.onAdd(this);
        this.objects.push(object);
    }

    // 添加objects至当前HelperLayer中
    addObjects(objects: Array<IObjectItem>) {
        _forEach(objects, (object: IObjectItem) => this.addObject(object));
    }

    // 添加图片
    addImageLayer(imageLayer: ImageLayer) {
        // 执行坐标转换
        const {x: screenX, y: screenY} = this.map.transformGlobalToScreen(imageLayer.position);

        const dpr = CanvasLayer.dpr;
        const scale = this.map.getScale();
        const {width, height} = imageLayer.imageInfo;
        const screenWidth = width * scale;
        const screenHeight = height * scale;

        (imageLayer.image && imageLayer.imageSuccess) && Graphic.drawImage(
            this.canvasContext,
            {
                image: imageLayer.image,
                x: screenX * dpr,
                y: screenY * dpr,
                width: screenWidth * dpr,
                height: screenHeight * dpr
            },
            {}
        );
    }

    // // Converts canvas to an image
    // convertCanvasToBitmap() {
    //     const bitmap = this.canvas.transferToImageBitmap();
    //     return bitmap;
    // }

    convertCanvasToImage() {
        // 获取base64
        const base64 = this.canvas.toDataURL('image/png');
        // resize图片大小（因为dpr的存在，会导致大小变成dpr倍）
        const {width, height} = this.bounds;
        return this.resizeImage(base64, {width, height});
    }

    // 重设图片大小
    resizeImage(base64: string, size: ISize) {
        const image = new Image();
        image.src = base64;

        // create an off-screen canvas
        const {width, height} = size;
        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // drawImage
        ctx.drawImage(image, 0, 0, width, height);
        const newBase64 = canvas.toDataURL('image/png');

        return newBase64;
    }

    // @override
    refresh() {
        // 绘制objects中所有object对象
        _forEach(this.objects, (object: IObjectItem) => object.refresh());
    }

    // 清空canvas画布
    clear() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
