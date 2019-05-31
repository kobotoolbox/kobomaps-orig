import calculateColor from '../util/calculateColor';
import addCommas from '../util/addCommas';
import {updateAreaLabel, updateAreaColor} from "../globals/geographicAreas";

/**
 Used to update the color of an area given a percentage, min and spread
 */

export default function UpdateAreaPercentage(name, percentage, min, spread, unit) {
    updateAreaColor(name, calculateColor(percentage, min, spread));
    updateAreaLabel(name, addCommas(percentage) + ' ' + unit);
}
