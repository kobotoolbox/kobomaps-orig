import actionTypes from '../actions/actionTypes';
import AppState from '../AppState';
import {indicatorTrunks} from './indicators';

const initialState = {
    appState: AppState.CREATED,
    infoWindowVisibilityFlags: {},
    indicators: [],
    areas: {},
    activeIndicator: undefined
};

export default function main(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_APP_STATE:
            return {...state, appState: action.payload};
        case actionTypes.SET_ACTIVE_INDICATOR:
            return {...state, activeIndicator: action.payload};
        case actionTypes.SET_INDICATORS:
            return {...state, indicators: action.payload};
        case actionTypes.SET_AREAS:
            return {...state, areas: action.payload};
        case actionTypes.SET_INFO_WINDOW_VISIBILITY_FLAGS:
            return {...state, infoWindowVisibilityFlags: action.payload};
        case actionTypes.TOGGLE_INDICATOR_BRANCH_VISIBILITY:
        case actionTypes.TOGGLE_INDICATOR_LEAF_VISIBILITY:
            return {...state, indicators: indicatorTrunks(state.indicators, action)};
        default:
            return {...state, infoWindowVisibilityFlags: visibilityFlagsReducer(state.infoWindowVisibilityFlags, action)};
    }
}

function visibilityFlagsReducer(state, action) {
    if(action.type === actionTypes.TOGGLE_INFO_WINDOW_VISIBILITY || action.type === actionTypes.CLEAR_INFO_WINDOW_VISIBILITY) {
        return state.map(function (current, index) {
            if (index === action.payload.index) {
                return action.payload.position;
            }
            return false;
        });
    }
}
