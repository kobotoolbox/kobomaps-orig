import buildMap from "../map/buildMap";

/**
 * global variable that holds the map
 */
let map;

export function createMap(config) {
    map = buildMap(config);
}

export function getMap() {
    return map;
}
