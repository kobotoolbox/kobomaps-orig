import actionTypes from './actionTypes';

export function setIndicators(payload) {
    return {
        type: actionTypes.SET_INDICATORS,
        payload
    }
}

export function setAreas(payload) {
    return {
        type: actionTypes.SET_AREAS,
        payload
    }
}

export function setActiveIndicator(payload) {
    return {
        type: actionTypes.SET_ACTIVE_INDICATOR,
        payload
    }
}

export function toggleIndicatorBranchVisibility(payload) {
    return {
        type: actionTypes.TOGGLE_INDICATOR_BRANCH_VISIBILITY,
        payload
    }
}

export function toggleIndicatorLeafVisibility(payload) {
    return {
        type: actionTypes.TOGGLE_INDICATOR_LEAF_VISIBILITY,
        payload
    }
}
