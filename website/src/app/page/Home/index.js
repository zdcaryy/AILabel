/**
 * @file app/Home
 * @author dingyang
 */

import React, { useCallback, useEffect, useRef } from 'react';

import AILabel from '../../../dist/index';

import './index.less';

const CONTAINER_ID = 'mapPan';

export default props => {
    const gMap = useRef();

    const init = useCallback(() => {
        gMap.current = new AILabel.Map(CONTAINER_ID, {
            center: {x: 0, y: 0},
            zoom: 800,
            mode: 'PAN' // 绘制线段
        });

        // 图片层添加
        const gFirstImageLayer = new AILabel.Layer.Image(
            'first-layer-image', // id
            {
                src: 'https://img2.baidu.com/it/u=2053804264,1341330775&fm=26&fmt=auto&gp=0.jpg',
                width: 500,
                height: 354,
                position: { // 左上角坐标
                    x: -250,
                    y: 177
                }
            }, // imageInfo
            {name: '第一个图片图层'}, // props
            {zIndex: 5} // style
        );
        gMap.current.addLayer(gFirstImageLayer);
    }, []);

    // 实例化
    useEffect(() => {
        init();
    }, [init]);

    return (
        <div className="home-wrap">
            <h3>图片浏览</h3>
            <div className="map-example">
                <div id={CONTAINER_ID} className="map-container" />
                <div className="map-code">代码部分</div>
            </div>
        </div>
    );
};
