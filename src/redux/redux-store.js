import {createStore} from "redux";
import main from './reducers/main';

let store = createStore(main);

export function getStore() {
    return store;
}
