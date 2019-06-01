/**
 *  gives us a list of names for geographicAreas
 */
const geographicAreaNames = [];

export function addArea(areaName) {
    geographicAreaNames[areaName] = true;
}

export function areaExists(areaName) {
    return geographicAreaNames[areaName] ?? false;
}
