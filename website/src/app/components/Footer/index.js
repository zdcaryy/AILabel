/**
 * @file components/Footer
 * @author dingyang
 */

import React from 'react';
import {connect} from 'react-redux';

import './index.less';

// mapStateToProps 建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
const mapStateToProps = state => ({
    user: state.user
});

// mapDispatchToProps 用来建立 UI 组件的参数到store.dispatch方法的映射 对应的type执行对应的行为
const mapDispatchToProps = dispatch => ({
    storeUserDetail: detail => dispatch({type: 'SET_USER_DETAIL', detail})
});

export default connect(mapStateToProps, mapDispatchToProps)(props => (
    <div className="page-footer">
        我是页面footer
    </div>
));
