import {createStore} from "redux";
import {commonState} from './reducers';

let store = createStore(commonState);

export function getStore() {
    return store;
}
