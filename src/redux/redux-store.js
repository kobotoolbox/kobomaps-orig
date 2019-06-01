import {createStore, applyMiddleware} from "redux";
import creatSagaMiddleware from 'redux-saga';
import {stateTransitions} from './actions/appState';
import main from './reducers/main';

const sagaMiddleware = creatSagaMiddleware();
let store = createStore(
    main,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(stateTransitions);

export function getStore() {
    return store;
}
