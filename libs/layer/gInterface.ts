import {IObject, IPoint, ISize} from "../gInterface";

export interface IFeatureAddOption extends IObject {
    clear?: boolean,
};

export interface ITextAddOption extends IObject {
    clear?: boolean,
};

// 基本json对象定义
export interface ILayerStyle extends IObject {
    zIndex?: number,
    opacity?: number
};

// 图片信息
export interface IImage extends ISize {
    src: string // 图片地址，支持base64/url
};

// 图片层图片信息
export interface IImageInfo extends IObject, IImage {
    position?: IPoint // 图片起始位置
};

// graphic图片信息
export interface IGImage extends ISize, IPoint {
    image: HTMLImageElement
};
