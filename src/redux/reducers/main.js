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
        case actionTypes.TOGGLE_INFO_WINDOW_VISIBILITY:
            return {...state, infoWindowVisibilityFlags: visibilityFlagsReducer(state.infoWindowVisibilityFlags, action)};
        default:
            return state;
    }
}

function visibilityFlagsReducer(state, action) {
    if(action.type === actionTypes.TOGGLE_INFO_WINDOW_VISIBILITY) {
        if (action.payload.position === false) {
            return {...state, [action.payload.name]: false};
        }
        return Object.keys(state).reduce(function (acc, current) {
            if (action.payload.name === current) {
                acc[current] = action.payload.position;
            } else {
                acc[current] = false;
            }
            return acc
        }, {});
    }
}
