/**
 * @file useRequest
 * @description 无redux业务逻辑请求处理
 * @author dingyang
 */

import {useCallback, useEffect, useRef, useState} from "react";
import _ from 'lodash';

import {request, message} from '@/common/common';

export default (props = {}, dep = []) => {
    const {
        silent: oSilent = false,
        api: oApi,
        params: oInputParams,
        errMsg: oErrMsg = '',
        successMsg: oSuccessMsg = '',
        filter: oFilter,
        preRequest: oPreRequest,
        autoRequest: oAutoRequest = true
    } = props;

    // 选项配置项
    const optionsRef = useRef();
    optionsRef.current = {
        silent: oSilent,
        api: oApi,
        inputParams: oInputParams || {},
        errMsg: oErrMsg,
        successMsg: oSuccessMsg,
        filter: oFilter,
        preRequest: oPreRequest,
        autoRequest: oAutoRequest
    };

    const paramsRef = useRef();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();

    const triggerRequest = useCallback(async (params = {}) => {
        const {preRequest, silent, api, errMsg, successMsg, filter} = optionsRef.current;

        try {
            // 如果是false, 阻止请求
            if (_.isFunction(preRequest)) {
                const preResult = preRequest();
                if (!preResult) {
                    return false;
                }
            }

            setLoading(true);
            const res = await request.post(api, params || {});
            paramsRef.current = params;

            successMsg && message.success(successMsg);
            if (_.isFunction(filter)) {
                const newRes = filter(res);
                setData(newRes);
                return newRes;
            }
            else {
                setData(res);
                return res;
            }
        }
        catch (err) {
            if (!silent) {
                message.error((err && err.msg) ? err.msg : (errMsg || '请求失败'));
            }
        }
        finally {
            setLoading(false);
        }
    }, []);

    // 刷新数据
    const triggerRefresh = useCallback(() => {
        triggerRequest(paramsRef.current);
    }, [triggerRequest]);

    useEffect(() => {
        if (!optionsRef.current.autoRequest) {
            return;
        }
        triggerRequest(optionsRef.current.inputParams);
    }, dep);

    return {
        loading,
        data,
        triggerRequest,
        triggerRefresh
    };
};
