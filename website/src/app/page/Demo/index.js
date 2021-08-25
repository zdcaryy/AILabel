/**
 * @file app/DataCollect
 * @author dingyang
 */

import React from 'react';
import {connect} from 'react-redux';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import './index.less';

// mapStateToProps 建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
const mapStateToProps = state => ({});

// mapDispatchToProps 用来建立 UI 组件的参数到store.dispatch方法的映射 对应的type执行对应的行为
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(props => {
    console.log('--props--', props);

    // 页面render
    return (
        <div className="page-demo">
            <Header />
            I am content
            <Footer />
        </div>
    );
});
