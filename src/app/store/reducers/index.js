import { combineReducers } from 'redux';
import app from "../../main/store/reducers";
const createReducer = (asyncReducers) =>
    combineReducers({
        app,
        ...asyncReducers
    });

export default createReducer;