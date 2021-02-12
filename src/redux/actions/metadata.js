import actionTypes from './actionTypes';

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

export function setInfoWindowVisibilityFlags(payload) {
    return {
        type: actionTypes.SET_INFO_WINDOW_VISIBILITY_FLAGS,
        payload
    }
}

export function toggleInfoWindowVisibility(index, position) {
    return {
        type: actionTypes.TOGGLE_INFO_WINDOW_VISIBILITY,
        payload: { index, position }
    }
}

export function clearInfoWindowVisibility() {
    return {
        type: actionTypes.CLEAR_INFO_WINDOW_VISIBILITY,
        payload: {index: null}
    }
}
