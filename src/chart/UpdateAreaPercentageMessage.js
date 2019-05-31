import UpdateAreaPercentage from './UpdateAreaPercentage';
import {getArea} from "../globals/geographicAreas";
import {addInfoWindow, closeAllInfoWindows, openInfoWindow} from "../globals/infoWindows";
/**
 Used to update the color and info window of an area
 */
export default function UpdateAreaPercentageMessage(name, percentage, min, spread, message, unit) {
    //first update the polygon and the marker
    UpdateAreaPercentage(name, percentage, min, spread, unit);

    //now make up some info windows and click handlers and such
    addInfoWindow(name, new google.maps.InfoWindow({content: message}));

    //remove any old listeners
    google.maps.event.clearListeners(getArea(name), 'click');
    // Add a listener for the click event
    google.maps.event.addListener(getArea(name), 'click', function (event) {
        //close all other info windows if they are open
        closeAllInfoWindows();
        //set up the new info window and open it.
        openInfoWindow(name, event.latLng)
    });
}
