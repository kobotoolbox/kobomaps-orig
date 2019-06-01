/**
 *  gives us a list of names for geographicAreas
 */
import createMap from "../util/createMap";

export const areaManager = createMap();
areaManager.areas = [];
areaManager.exists = function (areaName) {
    return !!areaManager.areas[areaName]
};

export function setAreas(areas) {
    areaManager.areas = areas;
}

export function areaExists(areaName) {
    return areaManager.exists(areaName);
}
