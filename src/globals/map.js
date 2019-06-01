import buildMap from "../map/buildMap";
import buildAreaPointsAndLabelPositions from "../map/buildAreaPointsAndLabelPositions";
import parseCSV from "../parsers/parseCSV";
import buildNav from "../nav/buildNav";
import buildLegendContainer from "../legend/LegendContainer";
import $ from "../jquery";

/**
 * global variable that holds the map
 */
let map;

export function initMap(config) {

    //google.maps.event.addListener(map, 'click', closeAllInfoWindows);
}

export function getMap() {
    return map;
}
