import {labels, areaGPolygons} from '../init';
import formatAreaOpacityColor from '../util/formatAreaOpacityColor';
import calculateColor from '../util/calculateColor';
import addCommas from '../util/addCommas';
/**
 Used to update the color of an area given a percentage, min and spread
 */

export default function UpdateAreaPercentage(name, percentage, min, spread, unit) {
    //calculate the color
    const color = calculateColor(percentage, min, spread);


    //update the polygon with this new color
    formatAreaOpacityColor(areaGPolygons[name], 0.6, color);

    //update the label

    labels[name].set('areaValue', addCommas(percentage) + ' ' + unit);
    labels[name].draw();


}
