import {areaGPolygons, infoWindows, map} from '../init';
import UpdateAreaPercentage from './UpdateAreaPercentage';
/**
 Used to update the color and info window of an area
 */
export default function UpdateAreaPercentageMessage(name, percentage, min, spread, message, unit) {
    //first update the polygon and the marker
    UpdateAreaPercentage(name, percentage, min, spread, unit);

    //close all other info windows if they are open
    for (var windowName in infoWindows) {
        infoWindows[windowName].close();
    }

    //now make up some info windows and click handlers and such
    const infoWindow = new google.maps.InfoWindow({content: message});
    infoWindows[name] = infoWindow;

    //remove any old listeners
    google.maps.event.clearListeners(areaGPolygons[name], 'click');
    // Add a listener for the click event
    google.maps.event.addListener(areaGPolygons[name], 'click', function (event) {
        //close all other info windows if they are open
        for (let windowName in infoWindows) {
            infoWindows[windowName].close();
        }
        //set up the new info window and open it.
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    });
}
