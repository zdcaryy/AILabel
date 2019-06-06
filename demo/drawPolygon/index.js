/**
 * @file ...
 * @author dingyang
 */
/* globals gDBox */

// 常用样式声明
const gFetureStyle = new gDBox.Style({strokeColor: '#0000FF'});

// 容器对象声明
let gMap = new gDBox.Map('map', {zoom: 640, cx: 0, cy: 0, zoomMax: 650 * 10, zoomMin: 650 / 10});

// 设置当前操作模式为‘drawRect’
gMap.setMode('drawPolygon', gFetureStyle);

// 图片层实例\添加
let gImageLayer = new gDBox.Layer.Image('img', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554984437152&di=b7492983dffacde6921f3b5ca6fccb3a&imgtype=0&src=http%3A%2F%2Fimg8.zol.com.cn%2Fbbs%2Fupload%2F23753%2F23752880.JPG', {w: 1280, h: 639}, {zIndex: 1});
gMap.addLayer(gImageLayer);

// 矢量层实例\添加
let gFeatureLayer = new gDBox.Layer.Feature('featureLayer', {zIndex: 2, transparent: true});
gMap.addLayer(gFeatureLayer);

gMap.events.on('geometryDrawDone', function (type, points) {
    // 生成元素唯一标志（时间戳）
    const timestamp = new Date().getTime();
    // 元素添加展示
    let fea = new gDBox.Feature.Polygon(`feature-${timestamp}`, points, {
        name: '中国'
    }, gFetureStyle);
    gFeatureLayer.addFeature(fea);
});
gMap.events.on('geometryEditDone', (type, activeFeature, points) => {
    activeFeature.update({points});
    activeFeature.show();
});


