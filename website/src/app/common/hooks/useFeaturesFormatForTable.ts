/**
 * @file common/useFeaturesFormatForTable
 * @author dingyang
 */

import _ from 'lodash';
import {FEATURE_STATUS} from '../../config/constants';

// feature对象数据类型定义
interface Feature {
    FID: string | number,
    fields?: object
}

// 矢量数据格式化
export default (features: Feature[]) => {
    // table:columns
    const columns = [{
        title: 'FID',
        dataIndex: 'FID',
        key: 'FID'
    }];

    // table:data
    const data = [];

    // 获取其属性fields
    _.each(features, (feature: Feature, index: number) => {
        // 数据准备
        const {FID, fields = {}} = feature;
        const featureData = {FID};

        // 处理table:columns & table:data
        _.each(fields, field => {
            let fieldName = ''; // 字段名使用
            let fieldCnName = ''; // 字段中文名：别名
            let fieldValue = ''; // 字段值
            for (let key in field) {
                // 首先需要根据第一条记录定义table:columns
                if (key !== 'CN_NAME' && key !== 'CNNAME') {
                    fieldName = key;
                    fieldValue = field[key];
                }
                else if (key === 'CN_NAME' || key === 'CNNAME') {
                    fieldCnName = field[key];
                }

                // 然后此时需要格式化当前feature: data
                if (fieldName) {
                    featureData[fieldName] = fieldValue
                }
            }
            if (fieldName && index === 0) {
                columns.push({
                    title: fieldCnName || fieldName,
                    dataIndex: fieldName,
                    key: fieldName,
                    filters: fieldName === 'STATUS' ? FEATURE_STATUS : []
                });
            }
        });
        data.push(featureData);
    });

    return {columns, data};
};
