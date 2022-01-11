import _forEach from 'lodash/forEach';
import _cloneDeep from 'lodash/cloneDeep';
import _isFunction from 'lodash/isFunction';

import Text from '../text/gText';

import {IObject} from '../gInterface';
import {ILayerStyle} from './gInterface';
import {ELayerType} from './gEnum';
import CanvasLayer from './gLayerCanvas';
import {IFeatureStyle} from '../feature/gInterface';
import Feature from '../feature/gFeature';
import {ITextInfo} from '../text/gInterface';

export default class SupportLayer extends CanvasLayer  {
    public supports: Array<Feature | Text> = [] // 当前supportLayer中所有的supports

    // 默认text文本的样式
    public defaultTextStyle: IFeatureStyle = {
        fillStyle: '#FFFFFF',
        strokeStyle: '#D2691E',
        background: true,
        globalAlpha: 1,
        fontColor: '#333',
        font: 'normal 10px Arial',
        textBaseline: 'top'
    }

    // function: constructor
    constructor(id: string, props: IObject = {}, style: ILayerStyle = {}) {
        super(id, ELayerType.Support, props, style);
    }

    // 添加feature至当前FeatureLayer中
    addSupports(feature: Feature | Text, option?: IObject) {
        const {clear = false} = option || {};
        clear && this.removeAllFeatureActionText();

        feature.onAdd(this);
        this.supports.push(feature);
    }

    // 添加文本
    addText(textInfo: ITextInfo, option?: IObject) {
        const {clear = true} = option || {};

        const text = new Text(
            `${+new Date()}`, // id
            {...textInfo, offset: {x: 5, y: -5}}, // shape
            {}, // props
            this.defaultTextStyle // style
        );
        this.addSupports(text, {clear});
    }

    // 清空所有子对象
    removeAllFeatureActionText() {
        this.supports = [];
        this.clear();
    }

    // @override
    refresh() {
        super.refresh();
        _forEach(this.supports, (support: Feature | Text) => support.refresh());
    }
}
