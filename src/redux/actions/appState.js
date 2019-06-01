import AppState from '../AppState';
import actionTypes from './actionTypes';
import { put, takeEvery, select } from 'redux-saga/effects'
import createMap from '../../util/createMap';

let actions = createMap();

function setAppState(payload) {
    return {
        type: actionTypes.SET_APP_STATE,
        payload
    };
}

function* changeAppState(action) {
    actions[action.type] = true;
    let state = yield select((state) => state.appState);
    switch (state) {
        case AppState.CREATED:
            yield put(setAppState(AppState.LOADING_METADATA));
            break;
        case AppState.LOADING_METADATA:
            if(actions[actionTypes.SET_INFO_WINDOW_VISIBILITY_FLAGS] && actions[actionTypes.SET_AREAS]) {
                yield put( setAppState(AppState.LOADING_INDICATORS));
            }
            break;
        case AppState.LOADING_INDICATORS:
            if(actions[actionTypes.SET_INDICATORS]) {
                yield put( setAppState(AppState.LOADED))
            }
        case AppState.LOADED:
        case AppState.NO_INDICATOR:
            if(actions[actionTypes.SET_ACTIVE_INDICATOR]) {
                yield put( setAppState(AppState.ONLINE));
            } else {
                yield put(setAppState(AppState.NO_INDICATOR));
            }
            break;
    }
}

export function* stateTransitions() {
    yield takeEvery([actionTypes.SET_INDICATORS,actionTypes.SET_ACTIVE_INDICATOR,actionTypes.SET_INFO_WINDOW_VISIBILITY_FLAGS,actionTypes.SET_AREAS], changeAppState)
}
