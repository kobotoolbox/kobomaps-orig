import UpdateAreaPercentage from './UpdateAreaPercentage';
import {addInfoWindow} from "../globals/infoWindows";
/**
 Used to update the color and info window of an area
 */
export default function UpdateAreaPercentageMessage(name, percentage, min, spread, message, unit) {
    //first update the polygon and the marker
    UpdateAreaPercentage(name, percentage, min, spread, unit);

    addInfoWindow(name, new google.maps.InfoWindow({content: message}));
}
