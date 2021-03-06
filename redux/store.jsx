import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import { initialState } from './const';
import { reducer } from './reducers';

export function initializeStore(initialState = initialState) {
   return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}
