/**
 * @file index
 * @author dingyang
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import reducer from './app/reducer';
import Routes from './app/config/routes';
import * as serviceWorker from './serviceWorker';

import './antd.reset.less';
import './index.less';

let store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
