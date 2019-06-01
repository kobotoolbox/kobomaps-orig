import actionTypes from '../actions/actionTypes';

export function indicatorTrunks(state, action) {
    let newState;
    switch (action.type) {
        case actionTypes.TOGGLE_INDICATOR_BRANCH_VISIBILITY:
            newState = mapVisibility(state, action);
            newState.byCode = state.byCode;
            return newState;
        case actionTypes.TOGGLE_INDICATOR_LEAF_VISIBILITY:
            newState = state.map(function (indicator) {
                return {...indicator, children: indicatorBranches(indicator.children, action)};
            });
            newState.byCode = state.byCode;
            return newState;
        default:
            return state;
    }
}

function indicatorBranches(state, action) {
    if (action.type === actionTypes.TOGGLE_INDICATOR_LEAF_VISIBILITY) {
        return mapVisibility(state, action);
    }
    return state;
}

function mapVisibility(state, action) {
    return state.map(function (indicator) {
        if (indicator.code === action.payload) {
            return {...indicator, visible: !indicator.visible};
        }
        return indicator;
    });
}
