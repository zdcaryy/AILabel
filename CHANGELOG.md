# 5.0.0
`2021-08-25`
1、重构版正式开源发布

# 5.0.4
`2021-08-26`
1、绘制线段完成修改为单击结束
2、绘制过程中增加tip提示文字
3、绘制编辑过程中可自由缩放/平移
4、mapOption增加zoomWhenDrawing绘制过程中是否可以自由缩放，默认false
4、mapOption增加panWhenDrawing绘制过程中是否可以自动平移，默认false
5、增加mapMode='BAN' // 禁用浏览
6、ctrl+z撤销节点
7、编辑圆bug修复
8、增加绘制时ctrl+z撤销
9、Map支持自定义坐标轴方向【修改为默认x右，y下】

# 5.0.5
`2021-08-27`
1、矩形编辑时坐标显示bug修复
2、文本text为空时不进行相关绘制【即不显示】
3、rect/polygon/circle支持IFeatureStyle stroke/fill配置

# 5.0.6
`2021-08-27`
1、鼠标滑轮缩放性能优化，MapOption增加refreshDelayWhenZooming配置，默认true
2、涂抹擦除性能优化，不会存在卡顿现象
3、Map鼠标事件外放

# 5.0.7
`2021-08-28`
1、Circle绘制提示tip位置bug
2、Marker拖拽坐标bug修复
3、Map对象增加getTargetFeatureWithPoint方法获取命中feature｜null
4、Layer.Image支持grid网格设置
