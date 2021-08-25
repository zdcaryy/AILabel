/**
 * @file components/Header
 * @author dingyang
 */

import React from 'react';

import './index.less';

export default props => {
    return (
        <div className="page-header">
            <div className="header-icon">icon</div>
            <div className="header-menus"></div>
            <div className="header-user"></div>
        </div>
    );
};
