import { applyMiddleware, createStore, combineReducers } from "redux";

import ReduxThunk from "redux-thunk";

import Reducer from "./reducers";

const middlewares = applyMiddleware(ReduxThunk);

const configureStore = () =>
  createStore(combineReducers({ ...Reducer }), {}, middlewares);

const store = configureStore();

export default store;
