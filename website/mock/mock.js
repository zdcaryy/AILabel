/**
 * @file mock.js
 * @author dingyang
 */

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 端口号
app.listen(3005);
console.log('server start');


// mock数据
var apdcConfig = require('./config');
apdcConfig(app);
