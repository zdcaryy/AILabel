// canvas-layer
// based zRender

import Map from '../gMap';
import {IObject} from '../gInterface';
import {ILayerStyle} from './gInterface';
import Layer from './gLayer';
import {ELayerType} from './gEnum';

export default class CanvasLayer extends Layer  {
    static dpr: number = window.devicePixelRatio // 实例化时创建

    public canvas: HTMLCanvasElement
    public canvasContext: CanvasRenderingContext2D

    // function: constructor
    constructor(id: string, layerType: ELayerType, props: IObject = {}, style: ILayerStyle = {}) {
        super(id, layerType, props, style);
    }

    onAdd(map: Map): void {
        super.onAdd(map);
        this.createRenderCanvas();
    }

    // 创建canvas层
    createRenderCanvas() {
        const {width, height} = this.map.getSize();
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.width = width * CanvasLayer.dpr;
        canvas.height = height * CanvasLayer.dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        this.dom.appendChild(canvas);

        // canvas上下文赋值
        this.canvas = canvas;
        this.canvasContext = canvas.getContext('2d');
    }

    // @override
    refresh() {
        // 进行canvas画布清除
        this.clear();
        super.refresh();
    }

    // 清空canvas画布
    clear() {
        this.canvasContext?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
