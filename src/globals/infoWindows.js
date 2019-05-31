import {getMap} from "./map";

/**
 * global variable that holds all of the info windows
 */
let infoWindows = Object.create(null);
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

    infoWindow.setPosition(position);
    infoWindow.open(getMap());
}

export function clearInfoWindows() {
    infoWindows = Object.create(null);
    infoWindowList = [];
}
