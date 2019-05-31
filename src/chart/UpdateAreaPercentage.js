import formatAreaOpacityColor from '../util/formatAreaOpacityColor';
import calculateColor from '../util/calculateColor';
import addCommas from '../util/addCommas';
import {getArea, getLabel} from "../globals/geographicAreas";
/**
 Used to update the color of an area given a percentage, min and spread
 */

export default function UpdateAreaPercentage(name, percentage, min, spread, unit) {
    //calculate the color
    const color = calculateColor(percentage, min, spread);


    //update the polygon with this new color
    formatAreaOpacityColor(getArea(name), 0.6, color);

    //update the label

    getLabel(name).set('areaValue', addCommas(percentage) + ' ' + unit);
    getLabel(name).draw();


}
