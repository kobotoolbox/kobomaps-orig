import buildMap from "../map/buildMap";
import {closeAllInfoWindows} from "./infoWindows";

/**
 * global variable that holds the map
 */
let map;

export function createMap(config) {
    map = buildMap(config);
    google.maps.event.addListener(map, 'click', closeAllInfoWindows);
}

export function getMap() {
    return map;
}
