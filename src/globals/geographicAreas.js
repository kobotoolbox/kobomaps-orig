/**
 *  gives us a list of names for geographicAreas
 */
const geographicAreaNames = [];
/**
 * global variable holding the polygons for each area. areaGPolygons["bomi"]
 * would return the polygon for Bomi
 */
const areaGPolygons = [];
/**
 * global variable holding all the Labels for each area
 */
const labels = [];

export function addArea(areaName, areaPolygon, areaLabel) {
    geographicAreaNames[areaName] = true;
    areaGPolygons[areaName] = areaPolygon;
    labels[areaName] = areaLabel;
}

export function areaExists(areaName) {
    return geographicAreaNames[areaName] ?? false;
}

export function updateAreaLabel(name, value) {
    labels[name].set('areaValue', value);
    labels[name].draw();

}

export function updateAreaColor(name, color) {
    areaGPolygons[name].setOptions({
        fillColor: color,
        fillOpacity: .6
    });
}
