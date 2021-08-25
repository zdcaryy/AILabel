/**
 * @file app/common/request
 * @author dingyang
 * message: 统一报错
 * request: 请求
 * formatFeatureFields: feature；fileds格式[] -> {}
 * convertArrayToJsonWithValueName: 将[{value: name：}]形式数组转换为{[value]: name}
 */

import _ from 'lodash';
import axios from 'axios';
import {message as Message} from 'antd';

// 统一message报错信息
export const message = {
    error: msg => {
        let showMsg = '服务出错了~';
        if (_.isString(msg)) {
            showMsg = msg;
        }
        if (_.isObject(msg) && msg.msg) {
            showMsg = msg.msg;
        }
        Message.error(showMsg);
    },
    success: msg => Message.success(msg),
    info: msg => Message.info(msg),
    warning: msg => Message.warning(msg),
    config: config => Message.config(config)
};

export const request = {
    async post(url, params) {
        try {
            // const formatParams = qs.stringify(params || {});
            const formatParams = params || {};
            console.log(`${url}: request params：`, formatParams);
            const res = await axios.post(url, {params: formatParams});
            const resData = res.data;
            return new Promise((resolve, reject) => {
                if (resData.success) {
                    resolve(resData);
                }
                else {
                    reject(resData);
                }
            });
        }
        catch (err) {
            message.error(`api:post：${url}->请求出错...`);
        }
    },

    async get(url, params) {
        try {
            // const formatParams = qs.stringify(params || {});
            const formatParams = params || {};
            console.log(`${url}: request params：`, formatParams);
            const res = await axios.get(url, {params: formatParams});
            const resData = res.data;
            return new Promise((resolve, reject) => {
                if (resData.success) {
                    resolve(resData);
                }
                else {
                    reject(resData);
                }
            });
        }
        catch (err) {
            message.error(`api:get：${url}->请求出错...`);
        }
    }
};

// format：fields，将feature属性属性由数组格式转换为json格式
export function formatFeatureFields(fields) {
    const formatFields = {};
    if (_.isObject(fields) && !_.isArray(fields)) {
        return fields;
    }
    if (!_.isArray(fields) || !fields.length) {
        return formatFields;
    }

    _.each(fields, field => {
        const keys = Object.keys(field);
        _.each(keys, key => {
            formatFields[key] = field[key];
        });
    });
    return formatFields;
}

// format：mapping将[{value: name：}]形式数组转换为{[value]: name}
export function convertArrayToJsonWithValueName(arrayOptions) {
    if (_.isArray(arrayOptions)) {
        const res = {};
        _.each(arrayOptions, option => {
            const {value, name} = option;
            if (value) {
                res[value] = name;
            }
        });
        return res;
    }
    return {};
}
