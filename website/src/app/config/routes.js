/**
 * @file app/config/routes
 * @author dingyang
 */

import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from 'antd';

import Header from '../components/Header';
import Demo from '../page/Demo';
import Login from '../page/Login';
import Home from '../page/Home';
import Error from '../page/Error';
import Doc from '../page/Doc';
import {PROJECT_NAME} from './constants';

export default props => (
    <Router>
        <ConfigProvider locale={zhCN}><div>
            <Header />
            <Switch>
                <Route path={`/${PROJECT_NAME}/login`} component={Login} />
                <Route path={`/${PROJECT_NAME}/home`} component={Home} />
                <Route path={`/${PROJECT_NAME}/demo`} component={Demo} />
                <Route path={`/${PROJECT_NAME}/doc`} component={Doc} />
                <Route component={Error}/>
            </Switch>
        </div></ConfigProvider>
    </Router>
);
