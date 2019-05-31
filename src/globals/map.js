import buildMap from "../map/buildMap";
import {closeAllInfoWindows} from "./infoWindows";
import parseJsonToGmap from "../map/parseJsonToGmap";

/**
 * global variable that holds the map
 */
let map;

export function initMap(config) {
    parseJsonToGmap(config.boundariesFilename, config.dataFiles).then(function () {buildMap(config);});
    //google.maps.event.addListener(map, 'click', closeAllInfoWindows);
}

export function getMap() {
    return map;
}
