/***/

import {EMapMode} from "./gEnum";

// 基本json对象定义
export interface IObject {
    [other: string]: any
};

// Size: interface
export interface ISize {
    width: number,
    height: number
};

// Point: interface
export interface IPoint {
    x: number,
    y: number
};

// IBasePoint: interface
export interface IBasePoint {
    screen: IPoint,
    global: IPoint
};

// ITransPointOption
export interface ITransPointOption {
    basePoint?: IBasePoint,
    zoom?: number
};

// map.centerAndZoom参数
export interface ICenterAndZoom {
    center?: IPoint,
    zoom?: number
};

// mapOptions: 实例map容器配置项
export interface IMapOptions {
    center?: IPoint,
    zoom?: number,
    size?: ISize,
    mode?: EMapMode,
    zoomWhenDrawing?: boolean
};
