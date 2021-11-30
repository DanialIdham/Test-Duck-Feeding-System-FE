import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { appReducer } from './store/reducers/app.reducer';

export const store = createStore(appReducer, applyMiddleware(thunk));
