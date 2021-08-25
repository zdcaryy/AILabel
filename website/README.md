## 本地依赖安装
* node环境 10.xx以上
* npm i 安装依赖插件

## 目录结构说明
* npm run start 本地启动server
* npm run build 执行本地构建

## 目录结构说明
* 本地访问地址：http://localhost:3000/projectName/demo

## 目录结构说明
*  --public【此文件夹一般不需要修改】
*  ----index.html
*  --mock【mock数据部分】
*  ----data【mock:json数据】
*  ----config.js【api接口配置方案】
*  ----mock.js【mock:server】
*  --src
*  ----index.js【入口文件】
*  ----app【主要开发文件夹】
*  ------common【存放公共文件，如request】
*  --------hooks【存放公共hooks方法】
*  ------components【-项目级别-公共组件，如Header/SiderBar/Footer组件】
*  ------config【配置文件，如api/constants/routes等配置】
*  ------reducer【redux数据结合】
*  ------page【页面】
*  --------PageA【页面A】
*  ----------components【页面A子组件】
*  ----------index.js【页面A】
*  --------PageB【页面B】
*  --------PageC【页面C】
*  ----setupProxy.js【代理方案】

## 英文名
* xxxx ...
* xxxx ...
* xxxx ...
* xxxx ...

导出：
git archive -o ../latest.zip HEAD