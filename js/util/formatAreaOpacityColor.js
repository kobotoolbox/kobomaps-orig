import {areaGPolygons} from '../dataVisualize';

/**
 * Function to be called from the HTML to specify a new opacity and/or color value for a county
 * countyName - name of the county as defined in the json file
 * opacityValue - number between 1.0 and 0.0
 * colorValue - html color value, in the form "#RRGGBB" such as "#ff0000" which is red
 */
export default function formatAreaOpacityColor(name, opacityValue, colorValue) {
    areaGPolygons[name].setOptions({
        fillColor: colorValue,
        fillOpacity: opacityValue
    });
}
