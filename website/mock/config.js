/**
 * @file mock/config
 * @author dingyang
 */

function setConfig(app) {
    // 高考筛选详情
    var gaokaoQuery = require('./data/gaokaoQuery.json');

    // 高考结果查询
    app.post('/api/gaokao/query', function (req, res) {
        res.send(gaokaoQuery);
    });
}
module.exports = setConfig;
