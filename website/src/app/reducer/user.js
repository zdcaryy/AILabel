/**
 * @file app/reducer/user
 * @author dingyang
 */

import {combineReducers} from 'redux';

const detail = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_DETAIL':
            return action.detail;
        default:
            return state;
    }
};

export default combineReducers({
    detail
});
