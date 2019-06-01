import AppState from '../AppState';
import actionTypes from './actionTypes';

let actions = [];

function setAppState(payload) {
    return {
        type: actionTypes.SET_APP_STATE,
        payload
    };
}

export function appStateTransition(currentAppState, action) {
    if (action !== undefined) {
        actions[action] = true;
    }
    switch (currentAppState) {
        case AppState.CREATED:
            return setAppState(AppState.LOADING_METADATA);
        case AppState.LOADING_METADATA:
            if(actions[actionTypes.SET_INFO_WINDOW_VISIBILITY_FLAGS] && actions[actionTypes.SET_AREAS]) {
                return setAppState(AppState.LOADING_INDICATORS);
            }
            break;
        case AppState.LOADING_INDICATORS:
            if(actions[actionTypes.SET_INDICATORS]) {
                return setAppState(AppState.LOADED)
            }
            break;
        case AppState.LOADED:
        case AppState.NO_INDICATOR:
            if(actions[actionTypes.SET_ACTIVE_INDICATOR]) {
                return setAppState(AppState.ONLINE);
            }
            return setAppState(AppState.NO_INDICATOR);
    }
    return {
        type: actionTypes.DO_NOTHING
    };
}
