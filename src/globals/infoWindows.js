import {getMap} from "./map";
import createMap from "../util/createMap";

/**
 * global variable that holds all of the info windows
 */
let infoWindows = createMap();
let infoWindowList = [];

export function closeAllInfoWindows() {
    infoWindowList.forEach((infoWindow) => infoWindow.close());
}

export function addInfoWindow(name, infoWindow) {
    infoWindows[name] = infoWindow;
    infoWindowList.push(infoWindow);
}

export function openInfoWindow(name, position) {
    const infoWindow = infoWindows[name];
    if (infoWindow === undefined) {
        return;
    }
    infoWindow.setPosition(position);
    infoWindow.open(getMap());
}

export function clearInfoWindows() {
    infoWindows = createMap();
    infoWindowList = [];
}
