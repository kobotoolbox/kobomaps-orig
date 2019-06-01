import actionTypes from "../redux/actionTypes";

const initialState = {
    indicators: [],
    areas: {},
    activeIndicator: null
};

function indicatorTrunks(state, action) {
    let newState;
    switch (action.type) {
        case actionTypes.TOGGLE_INDICATOR_BRANCH_VISIBILITY:
            newState = state.map(function (indicator) {
                if (indicator.code === action.payload) {
                    return {...indicator, visible: !indicator.visible}
                }
                return indicator;
            });
            newState.byCode = state.byCode;
            return newState;
        case actionTypes.TOGGLE_INDICATOR_LEAF_VISIBILITY:
            newState = state.map(function (indicator) {
                return {...indicator, children: indicatorBranches(indicator.children, action)}
            });
            newState.byCode = state.byCode;
            return newState;
    }
}

function indicatorBranches(state, action) {
    switch (action.type) {
        case actionTypes.TOGGLE_INDICATOR_LEAF_VISIBILITY:
            return state.map(function (indicator) {
                if (indicator.code === action.payload) {
                    return {...indicator, visible: !indicator.visible}
                }
                return indicator;
            });
    }
}

export function commonState(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_INDICATOR:
            return {...state, activeIndicator: action.payload};
        case actionTypes.SET_INDICATORS:
            return {...state, indicators: action.payload};
        case actionTypes.SET_AREAS:
            return {...state, areas: action.payload};
        case actionTypes.TOGGLE_INDICATOR_BRANCH_VISIBILITY:
        case actionTypes.TOGGLE_INDICATOR_LEAF_VISIBILITY:
            return {...state, indicators: indicatorTrunks(state.indicators, action)};
    }
    return state;
}
