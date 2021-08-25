import _assign from 'lodash/assign';

import Map from '../gMap';

import {EControlType} from './gEnum';
export default class Control {
    // controlId
    public id: string
    // controlType
    public type: EControlType

    // function: constructor
    constructor() {

    }

    // function: trigger when control add to map
    onAdd(map: Map): void {

    }

    // trigger when control remove from map
    // map exits first
    onRemove(): void {

    }

    // 刷新当前数据
    refresh() {}

    // 打印测试输出
    printInfo() {

    }
}
